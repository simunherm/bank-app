import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Item = {
  ptal: string;
  fornavn: string;
  eftirnavn: string;
  kontonummar: string;
  kontonavn: string;
  saldo: number;
  kontuslag: string;
  kreditrenta: number;
  debiterenta: number;
};

type Kontu = {
  nummar: string;
  navn: string;
  saldo: number;
};

type RF_Kontu = {
  eigara_fornavn: string;
  eigara_eftirnavn: string;
  kontunummar: string;
  kontunavn: string;
  saldo: number;
  kontuslag: string;
};

const Kontu_yvirlit = ({
  mínar_kontuir,
  femandar_kontuir,
}: {
  mínar_kontuir: Kontu[];
  femandar_kontuir: RF_Kontu[];
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>kontu yvirlit</CardTitle>
        <CardDescription>Summary of all your accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mínar kontuir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 ">
              {mínar_kontuir.map((kontu) => (
                <Link href={"/kontu/" + kontu.nummar} key={kontu.nummar}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{kontu.navn}</CardTitle>
                      <CardDescription>****{kontu.nummar}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-2xl font-bold ${
                          kontu.saldo >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(kontu.saldo).toFixed(2)} DKK
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {kontu.saldo >= 0
                          ? "Innistandandi peningur"
                          : "Outstanding Balance"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fremandar kontuir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 ">
              {femandar_kontuir.map((kontu) => (
                <Link
                  href={"/kontu/" + kontu.kontunummar}
                  key={kontu.kontunummar}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{kontu.kontunavn} </CardTitle>
                      <CardDescription>
                        Eigari: {kontu.eigara_fornavn}
                      </CardDescription>
                      <CardDescription>****{kontu.kontunummar}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`text-2xl font-bold ${
                          kontu.saldo >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {Math.abs(kontu.saldo).toFixed(2)} DKK
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {kontu.saldo >= 0
                          ? "Innistandandi peningur"
                          : "Outstanding Balance"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
};

export default async function BankAccountPage({
  params,
}: {
  params: Promise<{ ptal: string }>;
}) {
  const ptal = (await params).ptal;
  const mínar_kontuir: Item[] = (
    await (
      await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/kundi?id=" + ptal,
        { cache: "no-store" }
      )
    ).json()
  ).items;
  const rf_kontuir: RF_Kontu[] = (
    await (
      await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/reletara_kontoir/" + ptal,
        { cache: "no-store" }
      )
    ).json()
  ).items;

  if (mínar_kontuir.length == 0) {
    <div>Ongar kontuir í hesum navni</div>;
  }
  const kontuir: Kontu[] = mínar_kontuir.map(
    ({ kontonavn, kontonummar, saldo }) => ({
      nummar: kontonummar,
      navn: kontonavn,
      saldo: saldo,
    })
  );

  const fornavn = mínar_kontuir[0].fornavn;
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Hey {fornavn}</h1>
      <Link href={`${ptal}/flyt`}>
        <Button
          className="w-full h-20 text-2xl font-bold mb-3 rounded"
          variant="default"
        >
          Gerð flyting
        </Button>
      </Link>
      <Kontu_yvirlit mínar_kontuir={kontuir} femandar_kontuir={rf_kontuir} />
    </div>
  );
}
