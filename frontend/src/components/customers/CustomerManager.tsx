"use client";

import { useState } from "react";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerList } from "@/components/customers/CustomerList";

export function CustomerManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCustomerCreated() {
    setRefreshKey((currentKey) => currentKey + 1);
  }

  return (
    <div className="space-y-8">
      <CustomerForm
        onCustomerCreated={handleCustomerCreated}
      />

      <CustomerList refreshKey={refreshKey} />
    </div>
  );
}