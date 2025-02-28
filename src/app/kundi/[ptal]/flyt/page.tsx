import React from "react";
import TransactionForm from "./transaction_form";

const Flyti = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Flyting</h1>
        <TransactionForm mínar_kontuir={[{ navn: "mín kontu", nummar: 199 }]} />
      </div>
    </main>
  );
};

export default Flyti;
