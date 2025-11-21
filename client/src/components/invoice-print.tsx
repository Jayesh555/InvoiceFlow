import { forwardRef } from "react";
import { format } from "date-fns";
import type { Invoice } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

interface InvoicePrintProps {
  invoice: Invoice;
}

const InvoicePrintComponent = ({ invoice }: InvoicePrintProps) => {
  return (
    <div className="bg-white text-black p-12 max-w-4xl mx-auto w-full">
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
        <div className="grid grid-cols-2 gap-8">
          <div className="border-r-2 border-black pr-6">
            <h2 className="text-xl font-bold mb-4">Medical Pharmacy</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold">Address:</p>
                <p className="text-gray-700">123 Medical Plaza, Healthcare Street</p>
              </div>
              <div>
                <p className="font-semibold">Mobile:</p>
                <p className="text-gray-700">+91 98765 43210</p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs font-semibold text-gray-600 mb-2">License Numbers:</p>
                <div className="space-y-1 text-xs">
                  <p><span className="font-semibold">License 1:</span> LIC/2024/001</p>
                  <p><span className="font-semibold">License 2:</span> LIC/2024/002</p>
                  <p><span className="font-semibold">License 3:</span> LIC/2024/003</p>
                  <p><span className="font-semibold">License 4:</span> LIC/2024/004</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pl-6">
            <h2 className="text-xl font-bold mb-4 text-center">MEDICAL INVOICE</h2>
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-3">
                <p className="text-xs text-gray-600">INVOICE NUMBER</p>
                <p className="text-2xl font-bold font-mono">{invoice.invoiceNumber}</p>
              </div>
              <div className="border-b-2 border-black pb-3">
                <p className="text-xs text-gray-600">DATE</p>
                <p className="text-lg font-semibold">{format(new Date(invoice.date), "dd MMM yyyy")}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-300" />

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Patient Information</h3>
            <div className="space-y-1">
              <p className="font-semibold text-lg">{invoice.clientName}</p>
              <p className="text-sm">{invoice.clientAddress}</p>
              <p className="text-sm">Mobile: {invoice.clientMobile}</p>
              <p className="text-sm">Contact: {invoice.clientContact}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Doctor Information</h3>
            <div className="space-y-1">
              <p className="font-semibold text-lg">{invoice.doctorName}</p>
              <p className="text-sm">{invoice.doctorSpecialization}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-300" />

        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Prescribed Medicines</h3>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 text-xs font-semibold">Product Name</th>
                <th className="text-center py-2 text-xs font-semibold">Category</th>
                <th className="text-center py-2 text-xs font-semibold">Manufacturer</th>
                <th className="text-center py-2 text-xs font-semibold">Batch No.</th>
                <th className="text-center py-2 text-xs font-semibold">Exp.</th>
                <th className="text-right py-2 text-xs font-semibold">Qty</th>
                <th className="text-right py-2 text-xs font-semibold">Rate</th>
                <th className="text-right py-2 text-xs font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 text-xs">{item.medicineName}</td>
                  <td className="py-2 text-xs text-center">{item.category}</td>
                  <td className="py-2 text-xs text-center">{item.manufacturer || "-"}</td>
                  <td className="py-2 text-xs text-center font-mono">{item.batchNo || "-"}</td>
                  <td className="py-2 text-xs text-center font-mono">{item.expiry || "-"}</td>
                  <td className="py-2 text-xs text-center">{item.quantity}</td>
                  <td className="py-2 text-xs text-right font-mono">₹{item.price.toFixed(2)}</td>
                  <td className="py-2 text-xs text-right font-mono">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

        <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-600">
          <p>Thank you for your business</p>
          <p className="mt-1">This is a computer-generated invoice</p>
        </div>
      </div>
    </div>
  );
};

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  (props, ref) => (
    <div ref={ref}>
      <InvoicePrintComponent {...props} />
    </div>
  )
);

InvoicePrint.displayName = "InvoicePrint";
