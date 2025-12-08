import { z } from "zod";

// Client/Patient Schema
export interface Client {
  id: string;
  patientName: string;
  contact: string;
  address: string;
  mobileNo: string;
  createdAt: number;
}

export const insertClientSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  // contact: z.string().min(1, "Contact is required"),
  address: z.string().min(1, "Address is required"),
  // mobileNo: z.string().min(10, "Valid mobile number is required"),
});

export type InsertClient = z.infer<typeof insertClientSchema>;

// Doctor Schema
export interface Doctor {
  id: string;
  name: string;
  contact: string;
  specialization: string;
  address: string;
  email: string;
  createdAt: number;
}

export const insertDoctorSchema = z.object({
  name: z.string().min(1, "Doctor name is required"),
  contact: z.string().min(1, "Contact is required"),
  specialization: z.string().min(1, "Specialization is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Valid email is required"),
});

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

// Manufacturer Schema
export interface Manufacturer {
  id: string;
  name: string;
  createdAt: number;
}

export const insertManufacturerSchema = z.object({
  name: z.string().min(1, "Manufacturer name is required"),
});

export type InsertManufacturer = z.infer<typeof insertManufacturerSchema>;

// Medicine Categories
export const medicineCategories = ["TAB", "SYP", "OINT", "CAP", "SUPPO", "INJ", "VAIL", "AMP", "POWD", "GEL", "SPRAY", "LOTION", "LIQ", "DRP", "CREAM", "OIL", "FACEWASH", "RESP", "ROTACAP", "SYRINGE", "SOAP", "BOLUS"] as const;
export type MedicineCategory = typeof medicineCategories[number];

// Medicine Schema


export interface Medicine {
  id: string;
  name: string;
  category: MedicineCategory;
  manufacturerId: string;
  manufacturerName?: string; // For display purposes
  price: number;
  batchNo: string;
  expiry: string; // MM/YY format
  stock: number;
  createdAt: number;
}



export const insertMedicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  category: z.enum(medicineCategories, { required_error: "Category is required" }),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  batchNo: z.string().min(1, "Batch number is required"),
  expiry: z.string().min(1, "Expiry date is required"),
  stock: z.number().min(0, "Stock must be 0 or greater"),
});

export type InsertMedicine = z.infer<typeof insertMedicineSchema>;

// Invoice Item Schema
export interface InvoiceItem {
  medicineId: string;
  medicineName: string;
  category: MedicineCategory;
  manufacturer: string;
  batchNo: string;
  expiry: string; // MM/YY format
  quantity: number;
  price: number;
  total: number;
}

export const invoiceItemSchema = z.object({
  medicineId: z.string(),
  medicineName: z.string(),
  category: z.enum(medicineCategories),
  manufacturer: z.string(),
  batchNo: z.string(),
  expiry: z.string(), // MM/YY format
  quantity: z.number().min(1),
  price: z.number().min(0),
  total: z.number().min(0),
});

// Invoice Schema
export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: number;
  clientId: string;
  clientName?: string;
  // clientContact?: string;
  clientAddress?: string;
  // clientMobile?: string;
  doctorId: string;
  doctorName?: string;
  doctorSpecialization?: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  createdAt: number;
}

export const insertInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one medicine is required"),
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// User Schema (for authentication)
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
}
