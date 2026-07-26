"use client";

import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";
import type { Customer } from "@/types/customer";

type CustomerListProps = {
  refreshKey: number;
};

export function CustomerList({ refreshKey }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const customerList = await getCustomers();

        setCustomers(customerList);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os clientes.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, [refreshKey]);

  if (isLoading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Carregando clientes...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Clientes cadastrados
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Total de clientes: {customers.length}
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {!errorMessage && customers.length === 0 && (
        <p className="rounded-lg bg-gray-50 p-4 text-gray-600">
          Nenhum cliente cadastrado.
        </p>
      )}

      {!errorMessage && customers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">CEP</th>
                <th className="px-4 py-3 font-medium">Endereço</th>
                <th className="px-4 py-3 font-medium">Cidade/UF</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-100 text-sm text-gray-700 last:border-0"
                >
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {customer.name}
                  </td>

                  <td className="px-4 py-4">
                    {customer.email}
                  </td>

                  <td className="px-4 py-4">
                    {customer.cep}
                  </td>

                  <td className="px-4 py-4">
                    {customer.street}, {customer.number}
                    {customer.complement
                      ? ` - ${customer.complement}`
                      : ""}
                    <div className="text-gray-500">
                      {customer.neighborhood}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {customer.city}/{customer.state}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}