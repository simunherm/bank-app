import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Bóking = {
  vidmerking: string;
  bókinga_nr: number;
  játta_av: string;
  virði: number;
  bókingar_dato: string;
  transaction_number: number;
  leypandi_saldo: number;
};

const RecentTransactions = async ({
  params,
}: {
  params: Promise<{ kontu_nr: string }>;
}) => {
  const kontu_nr = (await params).kontu_nr;
  const bókingar: Bóking[] = (
    await (
      await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/kontu/" + kontu_nr,
        { cache: "no-store" }
      )
    ).json()
  ).items;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flytingar á {kontu_nr}</CardTitle>
        <CardDescription>kontu flytingar</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 divide-y-2">
          {bókingar.map((bóking) => (
            <li key={bóking.bókinga_nr} className="grid grid-cols-3 w-full">
              <div>
                <div className="flex gap-4">
                  <p className="font-medium">{bóking.transaction_number}</p>
                  {!!bóking.vidmerking && (
                    <p className="font-medium">{bóking.vidmerking}</p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {bóking.bókingar_dato}
                </p>
              </div>
              <p
                className={`font-medium ${
                  bóking.virði > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {bóking.virði > 0 ? "+" : ""}
                {Math.abs(bóking.virði).toFixed(2)} DKK
              </p>
              <p
                className={`font-medium ${
                  bóking.leypandi_saldo > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {bóking.leypandi_saldo > 0 ? "+" : ""}
                {Math.abs(bóking.leypandi_saldo).toFixed(2)} DKK
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
