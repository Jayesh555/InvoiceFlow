import { forwardRef } from "react";
import { format } from "date-fns";
import type { Invoice } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

// Helper: convert numbers to words (INR-friendly)
function numberToWords(amount: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function twoDigits(n: number) {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10);
    const o = n % 10;
    return `${tens[t]}${o ? " " + ones[o] : ""}`.trim();
  }

  function threeDigits(n: number) {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    let str = "";
    if (h) str += `${ones[h]} Hundred`;
    if (rem) str += (str ? " " : "") + twoDigits(rem);
    return str.trim();
  }

  function inWords(n: number) {
    if (n === 0) return "Zero";
    const parts: string[] = [];
    const crore = Math.floor(n / 10000000);
    if (crore) {
      parts.push(`${inWords(crore)} Crore`);
      n = n % 10000000;
    }
    const lakh = Math.floor(n / 100000);
    if (lakh) {
      parts.push(`${inWords(lakh)} Lakh`);
      n = n % 100000;
    }
    const thousand = Math.floor(n / 1000);
    if (thousand) {
      parts.push(`${inWords(thousand)} Thousand`);
      n = n % 1000;
    }
    if (n) {
      parts.push(threeDigits(n));
    }
    return parts.join(" ").trim();
  }

  const rupees = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - rupees) * 100);

  let result = "";
  if (rupees > 0) result += `${inWords(rupees)} Rupees`;
  if (paise > 0) result += `${result ? " and " : ""}${inWords(paise)} Paise`;
  if (!result) result = "Zero Rupees";
  result += " Only";
  // Preserve negative sign if needed
  return amount < 0 ? `Minus ${result}` : result;
}
interface InvoicePrintProps {
  invoice: Invoice;
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ invoice }, ref) => {
    const amountInWords = numberToWords(invoice.total || 0);
    return (
      <div
        ref={ref}
        className="bg-white text-black p-12 max-w-4xl mx-auto w-full"
      >
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
         <div className="pt-3 border-t border-gray-300 text-center text-xs text-gray-600">
            <p>SUBJECT TO MALEGAON JURISDICTION</p>
          </div>
          {/* Header with Medical Info and Invoice Details */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Side - Medical Information */}
            <div className="border-r-2 border-black pr-6">
              <h2 className="text-xl font-bold mb-4">
                Bafana Medical & General Stores
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  {/* <p className="font-semibold">Address:</p> */}
                  <p className="text-gray-700">
                    359, A/P- Dabhadi, Dist:- Nashik, Maharashtra - 423203
                  </p>
                </div>
                <div>
                  {/* <p className="font-semibold">Mobile:</p> */}
                  <p className="text-gray-700">+91 9923454313</p>
                </div>
              </div>
            </div>

            {/* Right Side - Invoice Details */}
            <div className="pl-6">
              {/* <h2 className="text-xl font-bold mb-4 text-center">
                MEDICAL INVOICE
              </h2> */}
              <div className="space-y-2">
                <div className="">
                  <p className="text-xs text-black">
                    INVOICE NO.: {invoice.invoiceNumber}
                  </p>
                  {/* <p className="text-s font-bold font-mono">
                    {invoice.invoiceNumber}
                  </p> */}
                </div>
                <div className="">
                  <p className="text-xs text-black">
                    DATE : {format(new Date(invoice.date), "dd MMM yyyy")}
                  </p>
                  {/* <p className="text-s font-semibold">
                    {format(new Date(invoice.date), "dd MMM yyyy")}
                  </p> */}
                </div>
                <div className="">
                  <div className="space-y-1 text-xs">
                    <p>
                      <span className="font-semibold">License No.:</span>{" "}
                      NK20/241784 NK21/241786
                    </p>
                    <p>
                      <span className="font-semibold">HOM LIC NO.:</span>{" "}
                      20C/241785
                    </p>
                    <p>
                      <span className="font-semibold">GSTIN:</span>{" "}
                      27AGVPB3069R1ZJ
                    </p>
                    <p>
                      <span className="font-semibold">FOOD LIC NO.:</span>{" "}
                      21517133000053
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-300" />

          {/* Patient and Doctor Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Patient Name
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-m">{invoice.clientName}</p>
                <p className="text-sm">{invoice.clientAddress}</p>
                {/* <p className="text-sm">Mobile: {invoice.clientMobile}</p>
                <p className="text-sm">Contact: {invoice.clientContact}</p> */}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Doctor Name
              </h3>
              <div className="space-y-1">
                <p className="font-semibold text-m">Dr. {invoice.doctorName}</p>
                <p className="text-sm">{invoice.doctorSpecialization}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-300" />

          {/* Items Table */}
          <div>
            {/* <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
              Prescribed Medicines
            </h3> */}
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-center py-2 text-xs font-semibold">
                    Category
                  </th>
                  <th className="text-left py-2 text-xs font-semibold">
                    Product Name
                  </th>
                  <th className="text-center py-2 text-xs font-semibold">
                    Manufacturer
                  </th>
                  <th className="text-center py-2 text-xs font-semibold">
                    Batch No.
                  </th>
                  <th className="text-center py-2 text-xs font-semibold">
                    Exp.
                  </th>
                  <th className="text-right py-2 text-xs font-semibold">Qty</th>
                  <th className="text-right py-2 text-xs font-semibold">
                    Rate
                  </th>
                  <th className="text-right py-2 text-xs font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 text-xs text-center">
                      {item.category}
                    </td>
                    <td className="py-2 text-xs">{item.medicineName}</td>
                    <td className="py-2 text-xs text-center">
                      {item.manufacturer || "-"}
                    </td>
                    <td className="py-2 text-xs text-center font-mono">
                      {item.batchNo || "-"}
                    </td>
                    <td className="py-2 text-xs text-center font-mono">
                      {item.expiry || "-"}
                    </td>
                    <td className="py-2 text-xs text-center">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-xs text-right font-mono">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-2 text-xs text-right font-mono">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-between items-start mt-6">
            <div className="text-sm font-semibold pt-2">
              <div className="flex items-center gap-4">
                <span>Prop./Auth. Sign-</span>
                <img
                  src="/signature.jpeg"
                  alt="Signature"
                  className="h-12 w-32 object-contain"
                />
                 <div className="pr-4 pl-4 text-sm">{amountInWords}</div>
              </div>
             
            </div>
            <div className="w-62 space-y-2">
              {/* <div className="flex justify-between py-2 border-t-2 border-black">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-mono">
                  ₹{invoice.subtotal.toFixed(2)}
                </span>
              </div> */}
              <div className="flex justify-between py-2 text-md font-bold border-t-2 border-black">
                <span>TOTAL:</span>
                <span className="font-mono pl-10">₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-600">
            <p>COUNSULT DOCTORE BEFORE USE</p>
            <p className="mt-1">
              COMPOSITION TAXABLE PERSON NOT ELIGIBLE TO COLLECT TAX ON SUPPLIES
            </p>
          </div>
        </div>
      </div>
    );
  },
);

InvoicePrint.displayName = "InvoicePrint";
