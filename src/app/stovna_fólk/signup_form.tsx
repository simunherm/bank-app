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
import { isPtalValid } from "@/lib/utils";

const formSchema = z
  .object({
    fornavn: z.string().min(1, { message: "Fornavn er kravt" }),
    eftirnavn: z.string().min(1, { message: "Eftirnavn er kravt" }),
    fodiar: z
      .number()
      .min(1900, { message: "Ikki valid føði ár" })
      .max(new Date().getFullYear(), { message: "Ikki valid føði ár" }),
    ptal: z.string().refine(isPtalValid, { message: "Ikki galdandi ptal" }),
    addr: z.string().min(1, { message: "Addressa er kravt" }),
    tlf_nr: z.string().min(1, { message: "telfon nummar er kravt" }),
    post_nr: z.string().min(1, { message: "postnr er kravt" }),
  })
  .refine(
    ({ ptal, fodiar }) => {
      return ptal.slice(4, 6) === fodiar.toString().slice(2);
    },
    { message: "ptal og fóðiár passa ikki" }
  );

export default function SignupForm({
  post_nr,
}: {
  post_nr: { bygd: string; post_nr: string }[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fornavn: "",
      eftirnavn: "",
      ptal: "",
      fodiar: 0,
      addr: "",
      tlf_nr: "",
      post_nr: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const Føðingardagur = `${values.ptal.slice(0, 2)}/${values.ptal.slice(
      2,
      4
    )}/${values.fodiar}`;
    const body = {
      addr: values.addr,
      tlf_nr: values.tlf_nr,
      post_nr: values.post_nr,
      eftirnavn: values.eftirnavn,
      fornavn: values.fornavn,
      fd: Føðingardagur,
      ptal: values.ptal,
    };

    console.log(body);
    try {
      const response = await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/folk",
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
          <CardTitle>Stovna kunda</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fodiar"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Føðiár</FormLabel>
                    <Input
                      type="number"
                      placeholder="1912"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fornavn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornavn</FormLabel>
                      <FormControl>
                        <Input placeholder="Jón" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eftirnavn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eftirnavn</FormLabel>
                    <FormControl>
                      <Input placeholder="Joensen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ptal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ptal</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="310193xxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tlf_nr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon nummar</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Addressa</FormLabel>
                    <FormControl>
                      <Input placeholder="Langagøta 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="post_nr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postnr</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vel Postnr" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {post_nr.map(({ bygd: býður, post_nr }) => (
                            <SelectItem key={post_nr} value={`${post_nr}`}>
                              {post_nr} - {býður}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* <Input type="number" placeholder="100" {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Avgreið Flyting
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
