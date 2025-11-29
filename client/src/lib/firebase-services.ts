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
  runTransaction,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
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

// Helper to get db
const getDb = () => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase Firestore not initialized");
  return db;
};

// Clients
export async function addClient(data: InsertClient): Promise<Client> {
  const db = getDb();
  const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTS), {
    ...data,
    createdAt: Timestamp.now().toMillis(),
  });
  return {
    id: docRef.id,
    ...data,
    contact: (data as any).contact ?? "",
    mobileNo: (data as any).mobileNo ?? "",
    createdAt: Timestamp.now().toMillis(),
  };
}

export async function updateClient(id: string, data: InsertClient): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.CLIENTS, id);
  await updateDoc(docRef, data);
}

export async function deleteClient(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.CLIENTS, id);
  await deleteDoc(docRef);
}

export function subscribeToClients(
  callback: (clients: Client[]) => void
): Unsubscribe {
  const db = getDb();
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
  const db = getDb();
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
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.DOCTORS, id);
  await updateDoc(docRef, data);
}

export async function deleteDoctor(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.DOCTORS, id);
  await deleteDoc(docRef);
}

export function subscribeToDoctors(
  callback: (doctors: Doctor[]) => void
): Unsubscribe {
  const db = getDb();
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
  const db = getDb();
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
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.MANUFACTURERS, id);
  await updateDoc(docRef, data);
}

export async function deleteManufacturer(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.MANUFACTURERS, id);
  await deleteDoc(docRef);
}

export function subscribeToManufacturers(
  callback: (manufacturers: Manufacturer[]) => void
): Unsubscribe {
  const db = getDb();
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
  const db = getDb();
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
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.MEDICINES, id);
  await updateDoc(docRef, {
    ...data,
    manufacturerName,
  });
}

export async function deleteMedicine(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.MEDICINES, id);
  await deleteDoc(docRef);
}

export function subscribeToMedicines(
  callback: (medicines: Medicine[]) => void
): Unsubscribe {
  const db = getDb();
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
  const db = getDb();
  if (!db) {
    throw new Error("Firebase Firestore is not initialized. Please check your Firebase configuration.");
  }
  const subtotal = data.items.reduce((sum: number, item: any) => sum + item.total, 0);

  // Use a transaction on a `counters/invoices` doc to generate a unique, incremental
  // invoice number in the format BAF-000001. This avoids collisions when multiple
  // clients create invoices concurrently.
  try {
    const result = await runTransaction(db, async (tx) => {
      const counterRef = doc(db, "counters", "invoices");
      let nextNumber = 1;

      try {
        const counterSnap = await tx.get(counterRef as any);
        if (counterSnap.exists()) {
          const dataVal: any = counterSnap.data();
          nextNumber = (dataVal.lastNumber || 0) + 1;
          tx.update(counterRef as any, { lastNumber: nextNumber });
        } else {
          tx.set(counterRef as any, { lastNumber: nextNumber });
        }
      } catch (err) {
        // If reading the counter fails, still attempt to set it to 1
        tx.set(counterRef as any, { lastNumber: nextNumber });
      }

      const invoiceNumber = `BAF-${String(nextNumber).padStart(6, "0")}`;

      const invoiceDocRef = doc(collection(db, COLLECTIONS.INVOICES));
      const invoiceRecord = {
        invoiceNumber,
        date: typeof data.date === "number" && !isNaN(data.date)
          ? data.date
          : Timestamp.now().toMillis(),
        clientId: data.clientId,
        clientName: clientData.patientName,
        // clientContact: clientData.contact,
        clientAddress: clientData.address,
        // clientMobile: clientData.mobileNo,
        doctorId: data.doctorId,
        doctorName: doctorData.name,
        doctorSpecialization: doctorData.specialization,
        items: data.items,
        subtotal,
        total: subtotal,
        createdAt: Timestamp.now().toMillis(),
      };

      tx.set(invoiceDocRef as any, invoiceRecord);

      return { id: invoiceDocRef.id, ...invoiceRecord } as Invoice;
    });

    console.log("Invoice saved successfully with ID:", result.id);
    return result;
  } catch (error: any) {
    console.error("Firestore transaction/write error:", error);
    if (error.code === "permission-denied") {
      throw new Error(
        "Permission denied! Your Firebase Firestore security rules don't allow writes. " +
        "Go to Firebase Console → Firestore → Rules and update them to allow authenticated users to read/write."
      );
    }
    throw error;
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, COLLECTIONS.INVOICES, id);
  await deleteDoc(docRef);
}

export function subscribeToInvoices(
  callback: (invoices: Invoice[]) => void
): Unsubscribe {
  const db = getDb();
  const q = query(collection(db, COLLECTIONS.INVOICES), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const invoices: Invoice[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Invoice));
    callback(invoices);
  });
}
