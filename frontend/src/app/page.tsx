import { CustomerManager } from "@/components/customers/CustomerManager";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de clientes
          </h1>

          <p className="mt-2 text-gray-600">
            Cadastre clientes com preenchimento automático do
            endereço pelo CEP.
          </p>
        </header>

        <CustomerManager />
      </div>
    </main>
  );
}