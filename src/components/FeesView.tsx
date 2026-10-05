import { useState, useMemo } from 'react';
import { FeeRecord, Student, SchoolClass, UserRole, PaymentMethod, PaymentStatus } from '../types/database';
import { Plus, Search, Printer, Trash2, Edit2, FileSpreadsheet, CheckCircle2, Clock, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { exportFeesCsv } from '../utils/storage';

interface FeesViewProps {
  fees: FeeRecord[];
  students: Student[];
  classes: SchoolClass[];
  currentRole: UserRole;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddFee: (fee: Omit<FeeRecord, 'fee_id'>) => FeeRecord;
  onUpdateFee: (fee: FeeRecord) => void;
  onDeleteFee: (feeId: number) => void;
  onPrintReceipt: (fee: FeeRecord) => void;
  isQuickFeeModalOpen?: boolean;
  setIsQuickFeeModalOpen?: (isOpen: boolean) => void;
}

export default function FeesView({
  fees,
  students,
  classes,
  currentRole,
  searchQuery,
  setSearchQuery,
  onAddFee,
  onUpdateFee,
  onDeleteFee,
  onPrintReceipt,
  isQuickFeeModalOpen = false,
  setIsQuickFeeModalOpen,
}: FeesViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(isQuickFeeModalOpen);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);

  // Form state for fee deposit
  const [formData, setFormData] = useState({
    student_id: students[0]?.student_id || 101,
    amount_paid: 4500,
    total_amount: 4500,
    payment_date: new Date().toISOString().split('T')[0],
    month: 'October 2026',
    status: 'Paid' as PaymentStatus,
    payment_method: 'Cash' as PaymentMethod,
    receipt_no: '',
    notes: '',
  });

  // When student is selected in modal, auto-update the class fee
  const handleStudentSelect = (studentId: number) => {
    const student = students.find((s) => s.student_id === studentId);
    const cls = student ? classes.find((c) => c.class_id === student.class_id) : null;
    const fee = cls ? cls.monthly_fee : 3500;

    setFormData((prev) => ({
      ...prev,
      student_id: studentId,
      total_amount: fee,
      amount_paid: fee,
      status: 'Paid',
    }));
  };

  const openDepositModal = () => {
    const initialStudent = students[0];
    const initialClass = initialStudent ? classes.find((c) => c.class_id === initialStudent.class_id) : null;
    const initialFee = initialClass ? initialClass.monthly_fee : 3500;
    const nextSlipNum = 1000 + fees.length + 1;

    setFormData({
      student_id: initialStudent?.student_id || 101,
      total_amount: initialFee,
      amount_paid: initialFee,
      payment_date: new Date().toISOString().split('T')[0],
      month: 'October 2026',
      status: 'Paid',
      payment_method: 'Cash',
      receipt_no: `REC-2026-${nextSlipNum}`,
      notes: 'Monthly tuition fee deposit',
    });
    setEditingFee(null);
    setIsDepositModalOpen(true);
  };

  const openEditModal = (fee: FeeRecord) => {
    setEditingFee(fee);
    setFormData({
      student_id: fee.student_id,
      amount_paid: fee.amount_paid,
      total_amount: fee.total_amount,
      payment_date: fee.payment_date,
      month: fee.month,
      status: fee.status,
      payment_method: fee.payment_method,
      receipt_no: fee.receipt_no,
      notes: fee.notes || '',
    });
    setIsDepositModalOpen(true);
  };

  const handlePaidChange = (paidVal: number) => {
    const total = formData.total_amount;
    let newStatus: PaymentStatus = 'Paid';
    if (paidVal <= 0) {
      newStatus = 'Pending';
    } else if (paidVal < total) {
      newStatus = 'Partial';
    } else {
      newStatus = 'Paid';
    }

    setFormData((prev) => ({
      ...prev,
      amount_paid: paidVal,
      status: newStatus,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receipt_no.trim()) {
      alert('Please enter a receipt number');
      return;
    }

    if (editingFee) {
      const updated: FeeRecord = {
        ...editingFee,
        ...formData,
        student_id: Number(formData.student_id),
        amount_paid: Number(formData.amount_paid) || 0,
        total_amount: Number(formData.total_amount) || 0,
      };
      onUpdateFee(updated);
      setIsDepositModalOpen(false);
      if (setIsQuickFeeModalOpen) setIsQuickFeeModalOpen(false);
    } else {
      const created = onAddFee({
        ...formData,
        student_id: Number(formData.student_id),
        amount_paid: Number(formData.amount_paid) || 0,
        total_amount: Number(formData.total_amount) || 0,
        collected_by: currentRole === 'accountant' ? 'Clerk (Accounts)' : 'Administration',
      });
      setIsDepositModalOpen(false);
      if (setIsQuickFeeModalOpen) setIsQuickFeeModalOpen(false);

      // Offer instant preview/print receipt
      onPrintReceipt(created);
    }
  };

  const handleDelete = (feeId: number, receiptNo: string) => {
    if (window.confirm(`Are you sure you want to delete fee slip "${receiptNo}"?`)) {
      onDeleteFee(feeId);
    }
  };

  // Unique months for filter
  const months = useMemo(() => {
    const set = new Set(fees.map((f) => f.month));
    return Array.from(set);
  }, [fees]);

  // Filtered fee records
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const student = students.find((s) => s.student_id === f.student_id);
      const studentName = student ? student.full_name.toLowerCase() : '';
      const rollNumber = student ? student.roll_number.toLowerCase() : '';
      const receipt = f.receipt_no.toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        receipt.includes(q) || studentName.includes(q) || rollNumber.includes(q);

      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesMonth = monthFilter === 'all' || f.month === monthFilter;
      const matchesClass =
        classFilter === 'all' || (student && student.class_id === Number(classFilter));

      return matchesSearch && matchesStatus && matchesMonth && matchesClass;
    });
  }, [fees, students, searchQuery, statusFilter, monthFilter, classFilter]);

  // Aggregate stats
  const totalCollected = filteredFees.reduce((sum, f) => sum + (f.amount_paid || 0), 0);
  const totalBilled = filteredFees.reduce((sum, f) => sum + (f.total_amount || 0), 0);
  const pendingAmount = Math.max(0, totalBilled - totalCollected);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Fee Management System (فیس کی وصولی اور ریکارڈ)</span>
            <span aria-hidden="true">·</span>
            <span>Total Records: {fees.length}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Fee Collection, Dues & Receipts
          </h1>
          <p className="text-xs text-slate-600">
            Record student monthly fee payments, track pending balances, and generate printable fee receipts
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportFeesCsv(fees, students, classes)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            title="Download CSV Ledger"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            <span>Export Fee Ledger (CSV)</span>
          </button>

          {currentRole !== 'teacher' && (
            <button
              onClick={openDepositModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Record Fee Payment (فیس جمع کریں)</span>
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Financial Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs font-medium text-slate-500 block">Total Collected (وصول شدہ رقم)</span>
          <div className="mt-1 font-mono text-xl font-bold text-emerald-700 tabular-nums">
            PKR {totalCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">In current filter selection</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs font-medium text-slate-500 block">Total Billed / Scheduled</span>
          <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
            PKR {totalBilled.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Cumulative monthly dues</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs font-medium text-slate-500 block">Outstanding Pending (بقایا رقم)</span>
          <div className="mt-1 font-mono text-xl font-bold text-rose-700 tabular-nums">
            PKR {pendingAmount.toLocaleString()}
          </div>
          <span className="text-[10px] text-rose-600 font-medium mt-1 block">Requires collection follow-up</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm relative">
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Receipt #, Student Name, Roll #..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="fees-status-filter" className="text-xs text-slate-500 font-medium">Status:</label>
            <select
              id="fees-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid (ادا شدہ)</option>
              <option value="Pending">Pending (واجب الادا)</option>
              <option value="Partial">Partial (جزوی)</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="fees-month-filter" className="text-xs text-slate-500 font-medium">Month:</label>
            <select
              id="fees-month-filter"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="fees-class-filter" className="text-xs text-slate-500 font-medium">Class:</label>
            <select
              id="fees-class-filter"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.class_id} value={c.class_id}>
                  {c.class_name} ({c.section})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fee Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Total Due</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 text-xs">
                    No fee payment slips found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => {
                  const student = students.find((s) => s.student_id === fee.student_id);
                  const cls = student ? classes.find((c) => c.class_id === student.class_id) : null;
                  const balance = Math.max(0, fee.total_amount - fee.amount_paid);

                  return (
                    <tr key={fee.fee_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {fee.receipt_no}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {fee.payment_date}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {fee.month}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {student?.full_name || 'Unknown Student'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {student?.roll_number}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {cls ? `${cls.class_name} (${cls.section})` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        PKR {fee.amount_paid.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                        PKR {fee.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                        {fee.payment_method}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                            fee.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : fee.status === 'Partial'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {fee.status}
                        </span>
                        {balance > 0 && (
                          <span className="block text-[9px] font-mono text-rose-600 mt-0.5">
                            Due: PKR {balance}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onPrintReceipt(fee)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-xs transition-colors cursor-pointer"
                            title="Generate and Print Official Challan / Slip"
                          >
                            <Printer size={13} />
                            <span>Receipt</span>
                          </button>
                          {currentRole !== 'teacher' && (
                            <>
                              <button
                                onClick={() => openEditModal(fee)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                                title="Edit Fee Record"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(fee.fee_id, fee.receipt_no)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                                title="Delete Entry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Fee Payment Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {editingFee ? 'Edit Fee Entry' : 'Record Student Fee Payment (فیس جمع کریں)'}
                </h2>
                <p className="text-xs text-slate-500">
                  Generate official payment receipt and update student ledger
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDepositModalOpen(false);
                  if (setIsQuickFeeModalOpen) setIsQuickFeeModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student (طالب علم منتخب کریں) *
                </label>
                <select
                  value={formData.student_id}
                  onChange={(e) => handleStudentSelect(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  {students.map((st) => {
                    const cls = classes.find((c) => c.class_id === st.class_id);
                    return (
                      <option key={st.student_id} value={st.student_id}>
                        {st.full_name} ({st.roll_number}) - {cls ? `${cls.class_name} (${cls.section})` : ''} - S/o {st.father_name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Fee Month */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fee Month (ماہ) *
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="October 2026">October 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="November 2026">November 2026</option>
                    <option value="December 2026">December 2026</option>
                    <option value="Annual Exam Fee">Annual Exam Fee</option>
                  </select>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Payment (تاریخ) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Total Monthly Due */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Due Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50}
                    value={formData.total_amount}
                    onChange={(e) => {
                      const newTotal = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        total_amount: newTotal,
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Amount Paid Now */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Paid (ادا کردہ رقم) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50}
                    value={formData.amount_paid}
                    onChange={(e) => handlePaidChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method (طریقہ ادائیگی) *
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="Cash">Cash (نقد رقم)</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Bank Transfer">Bank Transfer / Online</option>
                    <option value="Cheque">Bank Cheque</option>
                  </select>
                </div>

                {/* Receipt Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Receipt / Slip # (رسید نمبر) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.receipt_no}
                    onChange={(e) => setFormData({ ...formData, receipt_no: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Status Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-600">Calculated Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    formData.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : formData.status === 'Partial'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {formData.status} {formData.amount_paid < formData.total_amount ? `(Remaining: PKR ${formData.total_amount - formData.amount_paid})` : ''}
                </span>
              </div>

              {/* Notes / Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Transaction Remarks (خصوصی نوٹ یا ریفرنس)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Paid in full / Slip given to guardian"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsDepositModalOpen(false);
                    if (setIsQuickFeeModalOpen) setIsQuickFeeModalOpen(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  {editingFee ? 'Update Receipt' : 'Save & Generate Receipt (رسید بنائیں)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
