"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, SquareUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const router = useRouter();
  const [ptal, setPtal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!ptal) {
        throw new Error("Please enter both ptal and password");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Login successful:", { ptal });
      router.push("/kundi/" + ptal);
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <Wallet className="h-10 w-10 text-primary" />
            <span className="ml-2 text-2xl font-bold">NextBank</span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Rita inn
            </CardTitle>
            <CardDescription className="text-center">
              Skriva títt ptal fyri at rita inn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ptal">ptal</Label>
                <div className="relative">
                  <SquareUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="ptal"
                    type="ptal"
                    placeholder="DDMMYYXXX"
                    className="pl-10"
                    value={ptal}
                    onChange={(e) => setPtal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "arbeiðir..." : "rita inn"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
