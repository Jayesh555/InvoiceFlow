import { forwardRef } from "react";
import { format } from "date-fns";
import type { Invoice } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface InvoicePrintProps {
  invoice: Invoice;
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ invoice }, ref) => {
    return (
      <div ref={ref} className="bg-white text-black p-12 max-w-4xl mx-auto">
        <style type="text/css" media="print">
          {`
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page { margin: 0.5in; }
            }
          `}
        </style>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-6">
            <h1 className="text-3xl font-bold mb-2">MEDICAL INVOICE</h1>
            <p className="text-sm text-gray-600">Professional Healthcare Services</p>
          </div>

          {/* Invoice Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="text-xl font-bold font-mono">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold">
                {format(new Date(invoice.date), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <Separator className="bg-gray-300" />

          {/* Patient and Doctor Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Patient Information
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-lg">{invoice.clientName}</p>
                <p className="text-sm">{invoice.clientAddress}</p>
                <p className="text-sm">Mobile: {invoice.clientMobile}</p>
                <p className="text-sm">Contact: {invoice.clientContact}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Doctor Information
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-lg">{invoice.doctorName}</p>
                <p className="text-sm">{invoice.doctorSpecialization}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-300" />

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
              Prescribed Medicines
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 text-sm font-semibold">Medicine Name</th>
                  <th className="text-center py-2 text-sm font-semibold">Category</th>
                  <th className="text-center py-2 text-sm font-semibold">Quantity</th>
                  <th className="text-right py-2 text-sm font-semibold">Price</th>
                  <th className="text-right py-2 text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm">{item.medicineName}</td>
                    <td className="py-3 text-sm text-center">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-right font-mono">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-3 text-sm text-right font-mono">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between py-2 border-t-2 border-black">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-mono">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-black">
                <span>TOTAL:</span>
                <span className="font-mono">₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-600">
            <p>Thank you for your business</p>
            <p className="mt-1">This is a computer-generated invoice</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePrint.displayName = "InvoicePrint";
