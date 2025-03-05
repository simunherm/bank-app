"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kontu_slag } from "./page";

const formSchema = z.object({
  kontu_navn: z.string().min(1, { message: "kontu_navn er kravt" }),
  kontu_typa: z.string().min(1, { message: "kontu_typa er kravt" }),
});

export default function StovnaKontuForm({
  eigari,
  kontu_sløg,
}: {
  eigari: string;
  kontu_sløg: kontu_slag[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kontu_navn: "",
      kontu_typa: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const body = {
      eigari: eigari,
      kontunavn: values.kontu_navn,
      ks_navn: values.kontu_typa,
    };

    console.log(body);
    try {
      const response = await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/kontu",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      form.reset();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stovna kontu</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="kontu_navn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kontu navn</FormLabel>
                      <FormControl>
                        <Input placeholder="Mín konta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="kontu_typa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontuslag</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vel kontuslag" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kontu_sløg.map(
                            ({ kredit_renta, debit_renta, ks_navn }) => (
                              <SelectItem key={ks_navn} value={`${ks_navn}`}>
                                {ks_navn} - kredit renta: {kredit_renta} - debit
                                renta: {debit_renta}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Stovna kontu
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
