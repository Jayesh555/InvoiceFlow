import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client, Doctor, Medicine, InvoiceItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const createInvoiceFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  items: z.array(
    z.object({
      medicineId: z.string().min(1, "Medicine is required"),
      batchNo: z.string().min(1, "Batch number is required"),
      expiry: z.string().min(1, "Expiry date is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one medicine is required"),
});

type CreateInvoiceForm = z.infer<typeof createInvoiceFormSchema>;

interface CreateInvoicePageProps {
  clients: Client[];
  doctors: Doctor[];
  medicines: Medicine[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CreateInvoicePage({
  clients,
  doctors,
  medicines,
  onSubmit,
  onCancel,
  isSubmitting,
}: CreateInvoicePageProps) {
  const form = useForm<CreateInvoiceForm>({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues: {
      clientId: "",
      doctorId: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [batchNo, setBatchNo] = useState("");
  const [expiry, setExpiry] = useState("");

  const watchedItems = form.watch("items");
  
  const calculateTotal = () => {
    let total = 0;
    watchedItems.forEach((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (medicine) {
        total += medicine.price * item.quantity;
      }
    });
    return total;
  };

  const handleAddMedicine = () => {
    const qty = parseInt(quantity) || 1;
    if (selectedMedicineId && qty > 0 && batchNo && expiry) {
      append({
        medicineId: selectedMedicineId,
        quantity: qty,
        batchNo,
        expiry,
      });
      setSelectedMedicineId("");
      setQuantity("1");
      setBatchNo("");
      setExpiry("");
    }
  };

  const handleSubmit = async (data: CreateInvoiceForm) => {
    const invoiceItems: InvoiceItem[] = data.items.map((item: any) => {
      const medicine = medicines.find((m) => m.id === item.medicineId)!;
      return {
        medicineId: medicine.id,
        medicineName: medicine.name,
        category: medicine.category,
        manufacturer: medicine.manufacturerName || "",
        batchNo: item.batchNo,
        expiry: item.expiry,
        quantity: item.quantity,
        price: medicine.price,
        total: medicine.price * item.quantity,
      };
    });

    const invoiceData = {
      clientId: data.clientId,
      doctorId: data.doctorId,
      items: invoiceItems,
    };

    await onSubmit(invoiceData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold mb-2">Create Invoice</h1>
            <p className="text-muted-foreground">Generate a new invoice</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client / Patient</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-client">
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.patientName}
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
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-doctor">
                                <SelectValue placeholder="Select doctor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Medicines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <Select
                        value={selectedMedicineId}
                        onValueChange={setSelectedMedicineId}
                      >
                        <SelectTrigger data-testid="select-medicine">
                          <SelectValue placeholder="Select medicine" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicines.map((medicine) => (
                            <SelectItem key={medicine.id} value={medicine.id}>
                              {medicine.name} - ₹{medicine.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Batch No."
                        value={batchNo}
                        onChange={(e) => setBatchNo(e.target.value)}
                        data-testid="input-batch-no"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Exp. (MM/YY)"
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + "/" + val.slice(2, 4);
                          }
                          setExpiry(val);
                        }}
                        maxLength="5"
                        data-testid="input-expiry"
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value || "1")}
                        placeholder="Qty"
                        data-testid="input-quantity"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddMedicine}
                      disabled={!selectedMedicineId || !batchNo || !expiry}
                      data-testid="button-add-medicine"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {fields.length > 0 && (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Manufacturer</TableHead>
                            <TableHead>Batch No.</TableHead>
                            <TableHead>Exp.</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field: any, index) => {
                            const medicine = medicines.find(
                              (m) => m.id === field.medicineId
                            );
                            if (!medicine) return null;
                            const itemTotal = medicine.price * field.quantity;
                            return (
                              <TableRow key={field.id}>
                                <TableCell className="font-medium">
                                  {medicine.name}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{medicine.category}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {medicine.manufacturerName || "-"}
                                </TableCell>
                                <TableCell className="text-sm font-mono">{field.batchNo}</TableCell>
                                <TableCell className="text-sm font-mono">{field.expiry}</TableCell>
                                <TableCell className="text-right">{field.quantity}</TableCell>
                                <TableCell className="text-right font-mono">
                                  ₹{medicine.price.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  ₹{itemTotal.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    data-testid={`button-remove-medicine-${index}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{fields.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold pt-2">
                      <span>Total</span>
                      <span className="font-mono" data-testid="text-total">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || fields.length === 0}
                    data-testid="button-save-invoice"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Creating..." : "Create Invoice"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
