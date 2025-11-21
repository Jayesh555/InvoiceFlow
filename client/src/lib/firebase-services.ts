import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Client,
  Doctor,
  Medicine,
  Manufacturer,
  Invoice,
  InsertClient,
  InsertDoctor,
  InsertMedicine,
  InsertManufacturer,
} from "@shared/schema";

// Collection names
const COLLECTIONS = {
  CLIENTS: "clients",
  DOCTORS: "doctors",
  MEDICINES: "medicines",
  MANUFACTURERS: "manufacturers",
  INVOICES: "invoices",
};

// Clients
export async function addClient(data: InsertClient): Promise<Client> {
  const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTS), {
    ...data,
    createdAt: Timestamp.now().toMillis(),
  });
  return {
    id: docRef.id,
    ...data,
    createdAt: Timestamp.now().toMillis(),
  };
}

export async function updateClient(id: string, data: InsertClient): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CLIENTS, id);
  await updateDoc(docRef, data);
}

export async function deleteClient(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CLIENTS, id);
  await deleteDoc(docRef);
}

export function subscribeToClients(
  callback: (clients: Client[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.CLIENTS), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const clients: Client[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Client));
    callback(clients);
  });
}

// Doctors
export async function addDoctor(data: InsertDoctor): Promise<Doctor> {
  const docRef = await addDoc(collection(db, COLLECTIONS.DOCTORS), {
    ...data,
    createdAt: Timestamp.now().toMillis(),
  });
  return {
    id: docRef.id,
    ...data,
    createdAt: Timestamp.now().toMillis(),
  };
}

export async function updateDoctor(id: string, data: InsertDoctor): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DOCTORS, id);
  await updateDoc(docRef, data);
}

export async function deleteDoctor(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DOCTORS, id);
  await deleteDoc(docRef);
}

export function subscribeToDoctors(
  callback: (doctors: Doctor[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.DOCTORS), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const doctors: Doctor[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Doctor));
    callback(doctors);
  });
}

// Manufacturers
export async function addManufacturer(
  data: InsertManufacturer
): Promise<Manufacturer> {
  const docRef = await addDoc(collection(db, COLLECTIONS.MANUFACTURERS), {
    ...data,
    createdAt: Timestamp.now().toMillis(),
  });
  return {
    id: docRef.id,
    ...data,
    createdAt: Timestamp.now().toMillis(),
  };
}

export async function updateManufacturer(
  id: string,
  data: InsertManufacturer
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MANUFACTURERS, id);
  await updateDoc(docRef, data);
}

export async function deleteManufacturer(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MANUFACTURERS, id);
  await deleteDoc(docRef);
}

export function subscribeToManufacturers(
  callback: (manufacturers: Manufacturer[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.MANUFACTURERS),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const manufacturers: Manufacturer[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Manufacturer));
    callback(manufacturers);
  });
}

// Medicines
export async function addMedicine(
  data: InsertMedicine,
  manufacturerName: string
): Promise<Medicine> {
  const docRef = await addDoc(collection(db, COLLECTIONS.MEDICINES), {
    ...data,
    manufacturerName,
    createdAt: Timestamp.now().toMillis(),
  });
  return {
    id: docRef.id,
    ...data,
    manufacturerName,
    createdAt: Timestamp.now().toMillis(),
  };
}

export async function updateMedicine(
  id: string,
  data: InsertMedicine,
  manufacturerName: string
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MEDICINES, id);
  await updateDoc(docRef, {
    ...data,
    manufacturerName,
  });
}

export async function deleteMedicine(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MEDICINES, id);
  await deleteDoc(docRef);
}

export function subscribeToMedicines(
  callback: (medicines: Medicine[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.MEDICINES), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const medicines: Medicine[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Medicine));
    callback(medicines);
  });
}

// Invoices
export async function addInvoice(
  data: any,
  clientData: Client,
  doctorData: Doctor
): Promise<Invoice> {
  const subtotal = data.items.reduce((sum: number, item: any) => sum + item.total, 0);
  
  const invoiceData = {
    invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
    date: Timestamp.now().toMillis(),
    clientId: data.clientId,
    clientName: clientData.patientName,
    clientContact: clientData.contact,
    clientAddress: clientData.address,
    clientMobile: clientData.mobileNo,
    doctorId: data.doctorId,
    doctorName: doctorData.name,
    doctorSpecialization: doctorData.specialization,
    items: data.items,
    subtotal,
    total: subtotal,
    createdAt: Timestamp.now().toMillis(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.INVOICES), invoiceData);
  
  return {
    id: docRef.id,
    ...invoiceData,
  };
}

export function subscribeToInvoices(
  callback: (invoices: Invoice[]) => void
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.INVOICES), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const invoices: Invoice[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Invoice));
    callback(invoices);
  });
}
