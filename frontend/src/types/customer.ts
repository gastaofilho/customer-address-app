export type Customer = {
  id: number;
  name: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export type CustomerFormData = {
  name: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};