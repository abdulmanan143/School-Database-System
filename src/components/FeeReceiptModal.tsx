import { FeeRecord, Student, SchoolClass, DatabaseState } from '../types/database';
import SchoolCrest from './SchoolCrest';
import { Printer, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface FeeReceiptModalProps {
  fee: FeeRecord;
  student?: Student;
  schoolClass?: SchoolClass;
  schoolInfo: Pick<DatabaseState, 'school_name' | 'school_tagline' | 'school_phone' | 'school_address'>;
  onClose: () => void;
}

function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num < 20) return `${a[num]} Rupees Only`;
  if (num < 100) return `${b[Math.floor(num / 10)]} ${a[num % 10]}`.trim() + ' Rupees Only';
  if (num < 1000) {
    const rem = num % 100;
    return `${a[Math.floor(num / 100)]} Hundred ${rem > 0 ? (rem < 20 ? a[rem] : `${b[Math.floor(rem / 10)]} ${a[rem % 10]}`) : ''}`.trim() + ' Rupees Only';
  }
  if (num < 100000) {
    const thousands = Math.floor(num / 1000);
    const rem = num % 1000;
    const thStr = thousands < 20 ? a[thousands] : `${b[Math.floor(thousands / 10)]} ${a[thousands % 10]}`.trim();
    let remStr = '';
    if (rem > 0) {
      if (rem >= 100) {
        const h = Math.floor(rem / 100);
        const r2 = rem % 100;
        remStr = `${a[h]} Hundred ${r2 > 0 ? (r2 < 20 ? a[r2] : `${b[Math.floor(r2 / 10)]} ${a[r2 % 10]}`) : ''}`;
      } else {
        remStr = rem < 20 ? a[rem] : `${b[Math.floor(rem / 10)]} ${a[rem % 10]}`;
      }
    }
    return `${thStr} Thousand ${remStr}`.trim() + ' Rupees Only';
  }
  return `${num.toLocaleString()} PKR Only`;
}

export default function FeeReceiptModal({
  fee,
  student,
  schoolClass,
  schoolInfo,
  onClose,
}: FeeReceiptModalProps) {
  const remaining = Math.max(0, fee.total_amount - fee.amount_paid);

  const handlePrint = () => {
    window.print();
  };

  const renderVoucherSlip = (copyType: 'SCHOOL RECORD COPY' | 'STUDENT / PARENT COPY') => (
    <div className="border border-slate-300 p-5 bg-white relative flex flex-col justify-between text-xs text-slate-800">
      {/* Watermark in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <SchoolCrest size={220} className="text-slate-900" />
      </div>

      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-300 gap-3">
          <div className="flex items-center gap-2.5">
            <SchoolCrest size={36} className="text-slate-900 shrink-0" />
            <div>
              <h3 className="font-bold text-sm tracking-tight text-slate-900 uppercase">
                {schoolInfo.school_name}
              </h3>
              <p className="text-[10px] text-slate-500">{schoolInfo.school_address}</p>
              <p className="text-[10px] text-slate-500 font-mono">Tel: {schoolInfo.school_phone}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block px-2 py-0.5 border border-slate-400 font-mono font-semibold text-[9px] uppercase tracking-wider text-slate-700 bg-slate-50">
              {copyType}
            </span>
            <p className="font-mono text-[11px] font-bold text-slate-900 mt-1">{fee.receipt_no}</p>
          </div>
        </div>

        {/* Student & Date Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 py-3 border-b border-slate-200">
          <div>
            <span className="text-slate-500 text-[10px] block">Student Name / Talib-e-Ilm:</span>
            <span className="font-semibold text-slate-900">{student?.full_name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Roll Number:</span>
            <span className="font-mono font-semibold text-slate-900">{student?.roll_number || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Father / Guardian Name:</span>
            <span className="font-medium text-slate-800">{student?.father_name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Class & Section:</span>
            <span className="font-medium text-slate-800">
              {schoolClass ? `${schoolClass.class_name} (${schoolClass.section})` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Fee Month / Mahina:</span>
            <span className="font-semibold text-slate-900">{fee.month}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Payment Date / Tareekh:</span>
            <span className="font-mono text-slate-800">{fee.payment_date}</span>
          </div>
        </div>

        {/* Breakdown Table */}
        <table className="w-full mt-3 text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300 text-[10px] font-semibold text-slate-600 bg-slate-50">
              <th className="py-1 px-1.5">Description</th>
              <th className="py-1 px-1.5 text-right">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-1.5 px-1.5">Monthly Tuition Fee ({fee.month})</td>
              <td className="py-1.5 px-1.5 text-right font-mono tabular-nums">
                PKR {fee.total_amount.toLocaleString()}
              </td>
            </tr>
            {fee.notes && (
              <tr>
                <td className="py-1 px-1.5 text-[10px] text-slate-500 italic">
                  Note: {fee.notes}
                </td>
                <td className="py-1 px-1.5 text-right font-mono text-[10px] text-slate-500">-</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-300 bg-slate-50 font-semibold text-slate-900">
              <td className="py-1.5 px-1.5">Total Dues (Kul Wajibat):</td>
              <td className="py-1.5 px-1.5 text-right font-mono tabular-nums">
                PKR {fee.total_amount.toLocaleString()}
              </td>
            </tr>
            <tr className="border-t border-slate-200 font-bold text-slate-950">
              <td className="py-1.5 px-1.5 text-emerald-800">Amount Paid (Ada Shuda):</td>
              <td className="py-1.5 px-1.5 text-right font-mono tabular-nums text-emerald-800">
                PKR {fee.amount_paid.toLocaleString()}
              </td>
            </tr>
            {remaining > 0 && (
              <tr className="border-t border-slate-200 text-rose-700 font-semibold">
                <td className="py-1.5 px-1.5">Remaining Balance (Baqaya):</td>
                <td className="py-1.5 px-1.5 text-right font-mono tabular-nums">
                  PKR {remaining.toLocaleString()}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        {/* Amount in words */}
        <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 text-[10px]">
          <span className="font-semibold text-slate-600">Amount in Words: </span>
          <span className="font-medium text-slate-900 italic">{numberToWords(fee.amount_paid)}</span>
        </div>

        {/* Payment mode & status */}
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600">
          <div>
            <span>Payment Mode: </span>
            <span className="font-semibold text-slate-900">{fee.payment_method}</span>
          </div>
          <div>
            <span>Status: </span>
            <span
              className={`font-semibold ${
                fee.status === 'Paid'
                  ? 'text-emerald-700'
                  : fee.status === 'Partial'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {fee.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Signature lines */}
      <div className="mt-6 pt-4 border-t border-dashed border-slate-300 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="h-6 border-b border-slate-400"></div>
          <span className="text-[9px] text-slate-500 mt-1 block">Accountant / Clerk Signature</span>
        </div>
        <div>
          <div className="h-6 border-b border-slate-400"></div>
          <span className="text-[9px] text-slate-500 mt-1 block">Principal Stamp & Date</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-4">
        {/* Modal Controls (Hidden in print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Official Fee Receipt / Challan Voucher
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              ({fee.receipt_no})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Receipt / Challan</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 bg-slate-100 print:p-0 print:bg-white" id="printable-receipt">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {renderVoucherSlip('SCHOOL RECORD COPY')}
            {renderVoucherSlip('STUDENT / PARENT COPY')}
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3 print:hidden">
            * Both copies are rendered side by side for simultaneous printing on a single page.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="print:hidden flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500">
          <span>Fee Record ID: #{fee.fee_id} · Collected By: {fee.collected_by || 'School Accounts'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
