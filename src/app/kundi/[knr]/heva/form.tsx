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
import { Kontu } from "./page";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  avKontu: z.string().min(1, { message: "From account is required" }),
  virði: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  viðmerking: z.enum(["Tyki út", "Set inn"], {
    required_error: "Vell eitt",
  }),
});

export default function HevaForm({
  frá_kontuir,
  kunda_nr,
}: {
  frá_kontuir: Kontu[];
  kunda_nr: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avKontu: "",
      virði: "",
      viðmerking: "Tyki út",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let virði = Number(values.virði);
    if (values.viðmerking == "Tyki út") {
      virði = -virði;
    }
    const requestBody = {
      kontu: values.avKontu,
      virdi: virði,
      vidmerking: values.viðmerking,
    };

    try {
      const response = await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/heva-set-a",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      form.reset();
      router.push("/kundi/" + kunda_nr);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Heva ella set inn</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="viðmerking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handling</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vel handling" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tyki út">Heva</SelectItem>
                          <SelectItem value="Set inn">Set inn</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avKontu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Av kontu</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vel kontu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frá_kontuir.map((kontu) => (
                          <SelectItem
                            key={kontu.nummar}
                            value={`${kontu.nummar}`}
                          >
                            {kontu.eigari} - {kontu.navn} - {kontu.nummar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="virði"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virði</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">DKK</span>
                        </div>
                        <Input
                          className="pl-12"
                          placeholder="0.00"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Avgreið
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
