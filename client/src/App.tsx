import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

// Pages
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ClientsPage from "@/pages/clients";
import DoctorsPage from "@/pages/doctors";
import MedicinesPage from "@/pages/medicines";
import ManufacturersPage from "@/pages/manufacturers";
import InvoicesPage from "@/pages/invoices";
import CreateInvoicePage from "@/pages/create-invoice";
import ViewInvoicePage from "@/pages/view-invoice";
import SetupPage from "@/pages/setup";
import NotFound from "@/pages/not-found";

// Firebase services
import * as firebaseServices from "@/lib/firebase-services";
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

function Router() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Real-time Firebase data
  const [clients, setClients] = useState<Client[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Check if Firebase is configured
  const firebaseConfigured = isFirebaseConfigured();
  const auth = getFirebaseAuth();

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    try {
      // Check for redirect result on mount
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            toast({
              title: "Welcome back!",
              description: `Signed in as ${result.user.email}`,
            });
          }
        })
        .catch((error) => {
          console.error("Sign in error:", error);
          // Don't show error if it's a normal redirect result check
          if (error?.code !== "auth/operation-not-supported-in-this-environment") {
            toast({
              title: "Sign in failed",
              description: error.message,
              variant: "destructive",
            });
          }
        });

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Auth setup error:", error);
      setLoading(false);
    }
  }, [toast, firebaseConfigured, auth]);

  // Subscribe to Firebase collections when user is authenticated
  useEffect(() => {
    if (!user) return;

    const unsubscribes = [
      firebaseServices.subscribeToClients(setClients),
      firebaseServices.subscribeToDoctors(setDoctors),
      firebaseServices.subscribeToMedicines(setMedicines),
      firebaseServices.subscribeToManufacturers(setManufacturers),
      firebaseServices.subscribeToInvoices(setInvoices),
    ];

    // Mark data as loaded after a short delay
    const timer = setTimeout(() => setDataLoading(false), 500);

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      clearTimeout(timer);
    };
  }, [user]);

  const handleLogin = async () => {
    const authInstance = getFirebaseAuth();
    const googleProviderInstance = getGoogleProvider();
    
    if (!authInstance || !googleProviderInstance) {
      toast({
        title: "Error",
        description: "Firebase is not configured",
        variant: "destructive",
      });
      return;
    }
    setIsLoggingIn(true);
    try {
      await signInWithRedirect(authInstance, googleProviderInstance);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Firebase CRUD handlers
  const handleAddClient = async (data: InsertClient) => {
    try {
      await firebaseServices.addClient(data);
      toast({ title: "Success", description: "Client added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateClient = async (id: string, data: InsertClient) => {
    try {
      await firebaseServices.updateClient(id, data);
      toast({ title: "Success", description: "Client updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await firebaseServices.deleteClient(id);
      toast({ title: "Success", description: "Client deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddDoctor = async (data: InsertDoctor) => {
    try {
      await firebaseServices.addDoctor(data);
      toast({ title: "Success", description: "Doctor added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateDoctor = async (id: string, data: InsertDoctor) => {
    try {
      await firebaseServices.updateDoctor(id, data);
      toast({ title: "Success", description: "Doctor updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    try {
      await firebaseServices.deleteDoctor(id);
      toast({ title: "Success", description: "Doctor deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddManufacturer = async (data: InsertManufacturer) => {
    try {
      await firebaseServices.addManufacturer(data);
      toast({ title: "Success", description: "Manufacturer added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateManufacturer = async (id: string, data: InsertManufacturer) => {
    try {
      await firebaseServices.updateManufacturer(id, data);
      toast({ title: "Success", description: "Manufacturer updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteManufacturer = async (id: string) => {
    try {
      await firebaseServices.deleteManufacturer(id);
      toast({ title: "Success", description: "Manufacturer deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMedicine = async (data: InsertMedicine) => {
    try {
      const manufacturer = manufacturers.find((m) => m.id === data.manufacturerId);
      if (!manufacturer) {
        throw new Error("Manufacturer not found");
      }
      await firebaseServices.addMedicine(data, manufacturer.name);
      toast({ title: "Success", description: "Medicine added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateMedicine = async (id: string, data: InsertMedicine) => {
    try {
      const manufacturer = manufacturers.find((m) => m.id === data.manufacturerId);
      if (!manufacturer) {
        throw new Error("Manufacturer not found");
      }
      await firebaseServices.updateMedicine(id, data, manufacturer.name);
      toast({ title: "Success", description: "Medicine updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      await firebaseServices.deleteMedicine(id);
      toast({ title: "Success", description: "Medicine deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateInvoice = async (data: any) => {
    try {
      const client = clients.find((c) => c.id === data.clientId);
      const doctor = doctors.find((d) => d.id === data.doctorId);

      if (!client || !doctor) {
        throw new Error("Client or Doctor not found");
      }

      await firebaseServices.addInvoice(data, client, doctor);
      toast({ title: "Success", description: "Invoice created successfully" });
      setLocation("/invoices");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!firebaseConfigured) {
    return <SetupPage />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} isLoading={isLoggingIn} />;
  }

  const stats = {
    invoices: invoices.length,
    clients: clients.length,
    doctors: doctors.length,
    medicines: medicines.length,
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar onLogout={handleLogout} userEmail={user.email || undefined} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/">
                <DashboardPage stats={stats} isLoading={dataLoading} />
              </Route>
              <Route path="/clients">
                <ClientsPage
                  clients={clients}
                  isLoading={dataLoading}
                  onAdd={handleAddClient}
                  onUpdate={handleUpdateClient}
                  onDelete={handleDeleteClient}
                />
              </Route>
              <Route path="/doctors">
                <DoctorsPage
                  doctors={doctors}
                  isLoading={dataLoading}
                  onAdd={handleAddDoctor}
                  onUpdate={handleUpdateDoctor}
                  onDelete={handleDeleteDoctor}
                />
              </Route>
              <Route path="/manufacturers">
                <ManufacturersPage
                  manufacturers={manufacturers}
                  isLoading={dataLoading}
                  onAdd={handleAddManufacturer}
                  onUpdate={handleUpdateManufacturer}
                  onDelete={handleDeleteManufacturer}
                />
              </Route>
              <Route path="/medicines">
                <MedicinesPage
                  medicines={medicines}
                  manufacturers={manufacturers}
                  isLoading={dataLoading}
                  onAdd={handleAddMedicine}
                  onUpdate={handleUpdateMedicine}
                  onDelete={handleDeleteMedicine}
                />
              </Route>
              <Route path="/invoices">
                {selectedInvoice ? (
                  <ViewInvoicePage
                    invoice={selectedInvoice}
                    onBack={() => setSelectedInvoice(null)}
                  />
                ) : location === "/invoices/create" ? (
                  <CreateInvoicePage
                    clients={clients}
                    doctors={doctors}
                    medicines={medicines}
                    onSubmit={handleCreateInvoice}
                    onCancel={() => setLocation("/invoices")}
                  />
                ) : (
                  <InvoicesPage
                    invoices={invoices}
                    isLoading={dataLoading}
                    onCreateNew={() => setLocation("/invoices/create")}
                    onView={(invoice) => setSelectedInvoice(invoice)}
                  />
                )}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
