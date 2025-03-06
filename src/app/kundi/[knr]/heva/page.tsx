import React from "react";
import { Item, RF_Kontu } from "../page";
import HevaForm from "./form";

export type Kontu = {
  eigari: string;
  navn: string;
  nummar: string;
};

const heva = async ({ params }: { params: Promise<{ knr: string }> }) => {
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <HevaForm frá_kontuir={kontoir} kunda_nr={knr} />
      </div>
    </main>
  );
};

export default heva;
