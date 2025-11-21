import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertManufacturerSchema, type Manufacturer, type InsertManufacturer } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ManufacturersPageProps {
  manufacturers: Manufacturer[];
  isLoading?: boolean;
  onAdd: (data: InsertManufacturer) => Promise<void>;
  onUpdate: (id: string, data: InsertManufacturer) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ManufacturersPage({
  manufacturers,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
}: ManufacturersPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] = useState<Manufacturer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertManufacturer>({
    resolver: zodResolver(insertManufacturerSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleOpenDialog = (manufacturer?: Manufacturer) => {
    if (manufacturer) {
      setEditingManufacturer(manufacturer);
      form.reset({
        name: manufacturer.name,
      });
    } else {
      setEditingManufacturer(null);
      form.reset({
        name: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingManufacturer(null);
    form.reset();
  };

  const handleSubmit = async (data: InsertManufacturer) => {
    setIsSubmitting(true);
    try {
      if (editingManufacturer) {
        await onUpdate(editingManufacturer.id, data);
      } else {
        await onAdd(data);
      }
      handleCloseDialog();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (manufacturer: Manufacturer) => {
    setManufacturerToDelete(manufacturer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (manufacturerToDelete) {
      await onDelete(manufacturerToDelete.id);
      setDeleteDialogOpen(false);
      setManufacturerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Manufacturers</h1>
          <p className="text-muted-foreground">Manage medicine manufacturers</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-manufacturer">
          <Plus className="h-4 w-4 mr-2" />
          Add Manufacturer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manufacturer List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : manufacturers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No manufacturers found</p>
              <Button onClick={() => handleOpenDialog()} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Manufacturer
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturers.map((manufacturer) => (
                    <TableRow key={manufacturer.id} data-testid={`row-manufacturer-${manufacturer.id}`}>
                      <TableCell className="font-medium">{manufacturer.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(manufacturer)}
                            data-testid={`button-edit-manufacturer-${manufacturer.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(manufacturer)}
                            data-testid={`button-delete-manufacturer-${manufacturer.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingManufacturer ? "Edit Manufacturer" : "Add New Manufacturer"}
            </DialogTitle>
            <DialogDescription>
              Enter manufacturer information below
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pfizer"
                        {...field}
                        data-testid="input-manufacturer-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-submit-manufacturer"
                >
                  {isSubmitting ? "Saving..." : editingManufacturer ? "Update" : "Add Manufacturer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Manufacturer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {manufacturerToDelete?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
