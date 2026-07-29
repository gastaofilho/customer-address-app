"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { createCustomer, updateCustomer } from "@/services/customerService";
import { getAddressByCep } from "@/services/cepService";
import type { Customer, CustomerFormData } from "@/types/customer";

const initialFormData: CustomerFormData = {
  name: "",
  email: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

type CustomerFormProps = {
  editingCustomer: Customer | null;
  onCustomerSaved: () => void;
  onCancelEdit: () => void;
};

export function CustomerForm({
  editingCustomer,
  onCustomerSaved,
  onCancelEdit,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(() =>
    getInitialFormData(editingCustomer),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setErrorMessage("");
    }, 7000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "cep") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 8);

      formattedValue = numbersOnly.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
    }

    if (name === "state") {
      formattedValue = value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: formattedValue,
    }));
  }

  async function handleCepBlur() {
    const normalizedCep = formData.cep.replace(/\D/g, "");

    setErrorMessage("");

    if (normalizedCep.length !== 8) {
      setErrorMessage("Informe um CEP com 8 números.");

      setFormData((currentFormData) => ({
        ...currentFormData,
        street: "",
        neighborhood: "",
        city: "",
        state: "",
      }));

      return;
    }

    setIsSearchingCep(true);

    try {
      const address = await getAddressByCep(normalizedCep);

      setFormData((currentFormData) => ({
        ...currentFormData,
        cep: address.cep,
        street: address.logradouro ?? "",
        neighborhood: address.bairro ?? "",
        city: address.cidade ?? "",
        state: address.uf ?? "",
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o CEP.";

      setErrorMessage(message);
    } finally {
      setIsSearchingCep(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Informe o nome do cliente.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Informe o e-mail do cliente.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Informe um e-mail válido.");
      return;
    }

    const normalizedCep = formData.cep.replace(/\D/g, "");

    if (normalizedCep.length !== 8) {
      setErrorMessage("Informe um CEP com 8 números.");
      return;
    }

    if (!formData.street.trim()) {
      setErrorMessage("Informe o logradouro.");
      return;
    }

    if (!formData.number.trim()) {
      setErrorMessage("Informe o número do endereço.");
      return;
    }

    if (!formData.neighborhood.trim()) {
      setErrorMessage("Informe o bairro.");
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage("Informe a cidade.");
      return;
    }

    if (formData.state.trim().length !== 2) {
      setErrorMessage("Informe uma UF válida com 2 letras.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);

        setSuccessMessage("Cliente atualizado com sucesso.");
      } else {
        await createCustomer(formData);

        setSuccessMessage("Cliente cadastrado com sucesso.");
      }

      setFormData(initialFormData);
      onCustomerSaved();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o cliente.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">
        {editingCustomer ? "Editar cliente" : "Novo cliente"}
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        {editingCustomer
          ? "Altere os dados do cliente selecionado."
          : "Informe os dados pessoais e o endereço do cliente."}
      </p>

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800 shadow-lg"
        >
          <strong className="block font-semibold">
            Não foi possível concluir o cadastro
          </strong>

          <span className="mt-1 block text-sm">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800 shadow-lg"
        >
          <strong className="block font-semibold">Cadastro realizado</strong>

          <span className="mt-1 block text-sm">{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 grid gap-4 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nome
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="cep"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            CEP
          </label>

          <input
            id="cep"
            name="cep"
            type="text"
            value={formData.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            maxLength={9}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />

          {isSearchingCep && (
            <p className="mt-1 text-sm text-gray-500">Consultando CEP...</p>
          )}
        </div>

        <div>
          <label
            htmlFor="number"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Número
          </label>

          <input
            id="number"
            name="number"
            type="text"
            value={formData.number}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="street"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Logradouro
          </label>

          <input
            id="street"
            name="street"
            type="text"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="complement"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Complemento
          </label>

          <input
            id="complement"
            name="complement"
            type="text"
            value={formData.complement}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="neighborhood"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Bairro
          </label>

          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            value={formData.neighborhood}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Cidade
          </label>

          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            UF
          </label>

          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            maxLength={2}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase text-gray-900"
          />
        </div>

        <div className="flex flex-col items-end gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting || isSearchingCep}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? editingCustomer
                ? "Salvando alterações..."
                : "Cadastrando..."
              : editingCustomer
                ? "Editar cadastro"
                : "Cadastrar cliente"}
          </button>
          {editingCustomer && (
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setErrorMessage("");
                setSuccessMessage("");
                onCancelEdit();
              }}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </section>
  );

  function getInitialFormData(customer: Customer | null): CustomerFormData {
    if (!customer) {
      return initialFormData;
    }

    return {
      name: customer.name,
      email: customer.email,
      cep: customer.cep,
      street: customer.street,
      number: customer.number,
      complement: customer.complement ?? "",
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
    };
  }
}
