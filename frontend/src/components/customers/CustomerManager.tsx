"use client";

import { useState } from "react";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerList } from "@/components/customers/CustomerList";
import { deleteCustomer } from "@/services/customerService";
import type { Customer } from "@/types/customer";

export function CustomerManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  function handleCustomerSaved() {
    setEditingCustomer(null);
    setRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div
          role="alert"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800 shadow-lg"
        >
          {errorMessage}
        </div>
      )}

      {feedbackMessage && (
        <div
          role="status"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800 shadow-lg"
        >
          {feedbackMessage}
        </div>
      )}

      <CustomerForm
        key={editingCustomer?.id ?? "new"}
        editingCustomer={editingCustomer}
        onCustomerSaved={handleCustomerSaved}
        onCancelEdit={handleCancelEdit}
      />

      <CustomerList
        refreshKey={refreshKey}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />

      {isDeleting && (
        <p className="text-center text-sm text-gray-500">
          Excluindo cliente...
        </p>
      )}
    </div>
  );

  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer);
    setFeedbackMessage("");
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeleteCustomer(customer: Customer) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o cliente "${customer.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setFeedbackMessage("");
    setErrorMessage("");

    try {
      const message = await deleteCustomer(customer.id);

      setFeedbackMessage(message);
      setRefreshKey((currentKey) => currentKey + 1);

      if (editingCustomer?.id === customer.id) {
        setEditingCustomer(null);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o cliente.";

      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancelEdit() {
    setEditingCustomer(null);
  }
}
