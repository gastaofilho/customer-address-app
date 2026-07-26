import { API_URL } from "@/services/api";
import type { Address } from "@/types/address";

type CepResponse = {
  data: Address;
};

type ApiErrorResponse = {
  message?: string;
};

export async function getAddressByCep(cep: string): Promise<Address> {
  const normalizedCep = cep.replace(/\D/g, "");

  const response = await fetch(`${API_URL}/ceps/${normalizedCep}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();

    throw new Error(error.message ?? "Não foi possível consultar o CEP.");
  }

  const result: CepResponse = await response.json();

  return result.data;
}