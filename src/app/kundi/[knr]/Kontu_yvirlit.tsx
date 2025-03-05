import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
// import { Link } from "lucide-react";
import { Kontu } from "./page";
import Link from "next/link";

const Kontu_yvirlit = ({
  mínar_kontuir,
  femandar_kontuir,
}: {
  mínar_kontuir?: Kontu[];
  femandar_kontuir?: Kontu[];
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Kontu yvirlit</CardTitle>
        {/* <CardDescription>Summary of all your accounts</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mínar kontuir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 ">
              {!!mínar_kontuir &&
                mínar_kontuir.map((kontu) => (
                  <Link
                    href={"/kontu/" + kontu.nummar}
                    key={`link${kontu.nummar}`}
                  >
                    <Card key={kontu.nummar}>
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
              {!!femandar_kontuir &&
                femandar_kontuir.map((kontu) => (
                  <Link
                    href={"/kontu/" + kontu.nummar}
                    key={`link${kontu.nummar}`}
                  >
                    <Card key={kontu.nummar}>
                      <CardHeader>
                        <CardTitle>{kontu.navn} </CardTitle>
                        <CardDescription>
                          Eigari: {kontu.eigari}
                        </CardDescription>
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
      </CardContent>
    </Card>
  );
};

export default Kontu_yvirlit;
