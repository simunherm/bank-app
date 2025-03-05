import React from "react";
import StovnaKontuForm from "./stova_kontu_form";
import { notFound } from "next/navigation";

export type kontu_slag = {
  ks_navn: string;
  kredit_renta: string;
  debit_renta: string;
};

const SignupPage = async ({ params }: { params: Promise<{ knr: string }> }) => {
  const knr = (await params).knr;
  // if (!isPtalValid(ptal)) {
  //   notFound();
  // }
  // fetch;

  const kontu_sløg: kontu_slag[] = (
    await (
      await fetch("https://apex.oracle.com/pls/apex/karij12/api/kontu_slag")
    ).json()
  ).items;
  return (
    <div>
      {/* <pre>{JSON.stringify(kontu_sløg, null, 2)}</pre> */}
      <StovnaKontuForm eigari={knr} kontu_sløg={kontu_sløg} />
    </div>
  );
};

export default SignupPage;
