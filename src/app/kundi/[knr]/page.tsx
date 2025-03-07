import { Button } from "@/components/ui/button";
import Link from "next/link";
import Kontu_yvirlit from "./Kontu_yvirlit";
import { notFound } from "next/navigation";

export type Item = {
  kunda_nr: string;
  fornavn: string;
  eftirnavn: string;
  kontonummar: string;
  kontonavn: string;
  saldo: number;
  kontuslag: string;
  kreditrenta: number;
  debiterenta: number;
};

export type Kontu = {
  eigari: string;
  nummar: string;
  navn: string;
  saldo: number;
};

export type RF_Kontu = {
  frá_kunda_nr: string;
  eigara_kunda_nr: string;
  fornavn: string;
  eftirnavn: string;
  kreditrenta: number;
  debitrenta: number;
  kontunummar: string;
  kontunavn: string;
  saldo: number;
  kontuslag: string;
};

export default async function BankAccountPage({
  params,
}: {
  params: Promise<{ knr: string }>;
}) {
  const knr = (await params).knr;
  const fornavn: string = (
    await (
      await fetch("https://apex.oracle.com/pls/apex/karij12/api/folk/" + knr, {
        cache: "no-store",
      })
    ).json()
  )?.items[0]?.fornavn;
  if (!fornavn) {
    notFound();
  }

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

  if (mínar_kontuir.length == 0) {
    <div>Ongar kontuir í hesum navni</div>;
  }
  const kontuir: Kontu[] = mínar_kontuir.map(
    ({ kontonavn, kontonummar, saldo, fornavn }) => ({
      eigari: fornavn,
      nummar: kontonummar,
      navn: kontonavn,
      saldo: saldo,
    })
  );

  const fk: Kontu[] = rf_kontuir.map(
    ({ kontunummar, kontunavn, saldo, fornavn, eftirnavn }) => ({
      eigari: `${fornavn} ${eftirnavn}`,
      nummar: kontunummar,
      navn: kontunavn,
      saldo: saldo,
    })
  );
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Hey {fornavn}</h1>
      <Link href={`${knr}/flyt`}>
        <Button
          className="w-full h-20 text-2xl font-bold mb-3 rounded"
          variant="default"
        >
          Gerð flyting
        </Button>
      </Link>
      <Link href={`${knr}/stovna_kontu`}>
        <Button
          className="w-full h-20 text-2xl font-bold mb-3 rounded"
          variant="default"
        >
          Stovna Kontu
        </Button>
      </Link>
      <Link href={`${knr}/heva`}>
        <Button
          className="w-full h-20 text-2xl font-bold mb-3 rounded"
          variant="default"
        >
          Heva / Set inn
        </Button>
      </Link>
      <Kontu_yvirlit mínar_kontuir={kontuir} femandar_kontuir={fk} />
    </div>
  );
}
