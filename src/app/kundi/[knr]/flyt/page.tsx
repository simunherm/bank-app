import React from "react";
import TransactionForm from "./transaction_form";
import { Item, RF_Kontu } from "../page";

export type Kontu = {
  eigari: string;
  navn: string;
  nummar: string;
};

const Flyti = async ({ params }: { params: Promise<{ knr: string }> }) => {
  const knr = (await params).knr;
  const mínar_kontuir: Item[] = (
    await (
      await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/kundi?id=" + knr,
        { cache: "no-store" }
      )
    ).json()
  ).items;
  const rf_kontuir: RF_Kontu[] = (
    await (
      await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/reletara_kontoir/" + knr,
        { cache: "no-store" }
      )
    ).json()
  ).items;

  const kontoir: Kontu[] = mínar_kontuir
    .map(({ kontonavn, kontonummar, fornavn }) => ({
      eigari: fornavn,
      navn: kontonavn,
      nummar: kontonummar,
    }))
    .concat(
      rf_kontuir.map(({ fornavn, kontunavn, kontunummar }) => ({
        eigari: fornavn,
        navn: kontunavn,
        nummar: kontunummar,
      }))
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Flyting</h1>
        <TransactionForm frá_kontuir={kontoir} />
      </div>
    </main>
  );
};

export default Flyti;
