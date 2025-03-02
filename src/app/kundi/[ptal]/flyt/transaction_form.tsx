"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  avKontu: z.string().min(1, { message: "From account is required" }),
  ákontu: z.string().min(1, { message: "To account is required" }),
  virði: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  date: z.date({
    required_error: "Transaction date is required",
  }),
  viðmerking: z.string().optional(),
});

export default function TransactionForm({
  mínar_kontuir,
}: {
  mínar_kontuir: { navn: string; nummar: number }[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avKontu: "",
      ákontu: "",
      virði: "",
      viðmerking: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedDate = format(values.date, "dd/MM/yyyy");

    const requestBody = {
      av_kontu: values.avKontu,
      a_kontu: values.ákontu,
      virdi: values.virði,
      vidmerking: values.viðmerking,
      dato: formattedDate,
    };

    try {
      const response = await fetch(
        "https://apex.oracle.com/pls/apex/karij12/api/flyting",
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
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stovna Flyting</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Bókingar Dato</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          {mínar_kontuir.map((kontu) => (
                            <SelectItem
                              key={kontu.nummar}
                              value={`${kontu.nummar}`}
                            >
                              {kontu.navn} - {kontu.nummar}
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
                  name="ákontu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Account</FormLabel>
                      <FormControl>
                        <Input placeholder="Kontu nummar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <FormField
                control={form.control}
                name="viðmerking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viðmerking</FormLabel>
                    <FormControl>
                      <Input placeholder="viðmerk flyting" {...field} />
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
