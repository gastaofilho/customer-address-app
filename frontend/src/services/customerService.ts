import { API_URL } from "@/services/api";
import type { Customer, CustomerFormData } from "@/types/customer";

type CustomerListResponse = {
    data: Customer[];
};

type CustomerCreateResponse = {
    message: string;
    data: Customer;
};

type ApiErrorResponse = {
    message?: string;
};

export async function getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_URL}/customers`);

    if (!response.ok) {
        throw new Error("Não foi possível carregar os clientes.");
    }

    const result: CustomerListResponse = await response.json();

    return result.data;
}

export async function createCustomer(
    customerData: CustomerFormData,
): Promise<Customer> {
    const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(customerData),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        throw new Error(error.message ?? "Não foi possível cadastrar o cliente.");
    }

    const result: CustomerCreateResponse = await response.json();

    return result.data;
}