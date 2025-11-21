import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import type { Invoice } from "@shared/schema";
import { InvoicePrint } from "@/components/invoice-print";
import { useReactToPrint } from "react-to-print";

interface ViewInvoicePageProps {
  invoice: Invoice;
  onBack: () => void;
}

export default function ViewInvoicePage({ invoice, onBack }: ViewInvoicePageProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold mb-2">View Invoice</h1>
            <p className="text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
          </div>
        </div>
        <Button onClick={handlePrint} data-testid="button-print">
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
      </div>

      <Card className="overflow-hidden">
        <InvoicePrint ref={componentRef} invoice={invoice} />
      </Card>
    </div>
  );
}
