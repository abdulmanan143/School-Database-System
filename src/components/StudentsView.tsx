import { useState, useMemo } from 'react';
import { Student, SchoolClass, FeeRecord, UserRole } from '../types/database';
import { Search, Plus, Trash2, Edit2, Phone, MapPin, Calendar, Eye, FileSpreadsheet, ArrowUpDown } from 'lucide-react';
import { exportStudentsCsv } from '../utils/storage';

interface StudentsViewProps {
  students: Student[];
  classes: SchoolClass[];
  fees: FeeRecord[];
  currentRole: UserRole;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddStudent: (newStudent: Omit<Student, 'student_id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: number) => void;
  onSelectFeeReceipt: (fee: FeeRecord) => void;
  onSelectStudentDetail?: (student: Student) => void;
}

export default function StudentsView({
  students,
  classes,
  fees,
  currentRole,
  searchQuery,
  setSearchQuery,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectFeeReceipt,
}: StudentsViewProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    roll_number: '',
    class_id: classes[0]?.class_id || 1,
    father_name: '',
    phone_number: '',
    admission_date: new Date().toISOString().split('T')[0],
    address: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    status: 'Active' as 'Active' | 'Inactive' | 'Graduated',
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      roll_number: '',
      class_id: classes[0]?.class_id || 1,
      father_name: '',
      phone_number: '',
      admission_date: new Date().toISOString().split('T')[0],
      address: '',
      gender: 'Male',
      status: 'Active',
    });
    setEditingStudent(null);
  };

  const openAddModal = () => {
    resetForm();
    // Auto-generate suggested roll number based on class
    const nextNum = students.length + 1;
    setFormData((prev) => ({
      ...prev,
      roll_number: `R-${nextNum.toString().padStart(3, '0')}`,
    }));
    setIsAddModalOpen(true);
  };

  const openEditModal = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name,
      roll_number: student.roll_number,
      class_id: student.class_id,
      father_name: student.father_name,
      phone_number: student.phone_number,
      admission_date: student.admission_date,
      address: student.address,
      gender: student.gender,
      status: student.status,
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.roll_number.trim()) {
      alert('Please provide student full name and roll number.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
        class_id: Number(formData.class_id),
      });
    } else {
      onAddStudent({
        ...formData,
        class_id: Number(formData.class_id),
      });
    }
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDelete = (studentId: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete student "${name}" (ID #${studentId})?`)) {
      onDeleteStudent(studentId);
      if (viewingStudent?.student_id === studentId) {
        setViewingStudent(null);
      }
    }
  };

  // Filter students based on search query and selected class
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.father_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone_number.includes(searchQuery);

      const matchesClass =
        selectedClassId === 'all' || s.class_id === Number(selectedClassId);

      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClassId]);

  const getClassObj = (classId: number) => {
    return classes.find((c) => c.class_id === classId);
  };

  const getStudentFees = (studentId: number) => {
    return fees.filter((f) => f.student_id === studentId);
  };

  return (
    <div className="space-y-6">
      {/* Top action & filtering bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Student Management (طالب علم رجسٹریشن)</span>
            <span aria-hidden="true">·</span>
            <span>Total: {students.length}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Student Register & Profiles
          </h1>
          <p className="text-xs text-slate-600">
            Manage student admissions, contact records, parent info, and enrolled classes
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportStudentsCsv(students, classes)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            title="Download CSV Roster"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            <span>Export Roster (CSV)</span>
          </button>

          {currentRole !== 'teacher' && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Add Student (نیا داخلہ)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 flex-1 max-w-md relative">
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Roll No, Father Name, Phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="class-filter" className="text-xs text-slate-500 whitespace-nowrap font-medium">Filter Class:</label>
          <select
            id="class-filter"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Classes ({students.length})</option>
            {classes.map((c) => {
              const count = students.filter((s) => s.class_id === c.class_id).length;
              return (
                <option key={c.class_id} value={c.class_id}>
                  {c.class_name} ({c.section}) - {count} students
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name (نام)</th>
                <th className="py-3 px-4">Father Name (والد کا نام)</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Admission Date</th>
                <th className="py-3 px-4 text-center">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const cls = getClassObj(st.class_id);
                  const stFees = getStudentFees(st.student_id);
                  const hasPending = stFees.some((f) => f.status === 'Pending' || f.status === 'Partial');
                  const hasPaid = stFees.some((f) => f.status === 'Paid');

                  return (
                    <tr
                      key={st.student_id}
                      onClick={() => setViewingStudent(st)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {st.roll_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {st.full_name}
                        </div>
                        <div className="text-[11px] text-slate-400">ID: #{st.student_id}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {st.father_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px]">
                          {cls ? `${cls.class_name} (${cls.section})` : 'Class Not Set'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {st.phone_number}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {st.admission_date}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasPending ? (
                          <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-semibold">
                            Pending Dues
                          </span>
                        ) : hasPaid ? (
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold">
                            Up to date
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                            No Record
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingStudent(st);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-colors"
                            title="View Full Profile & Fees"
                          >
                            <Eye size={14} />
                          </button>
                          {currentRole !== 'teacher' && (
                            <>
                              <button
                                onClick={(e) => openEditModal(st, e)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-colors"
                                title="Edit Student Record"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(st.student_id, st.full_name, e)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete Student"
                              >
                                <Trash2 size={14} />
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

      {/* Student Profile Drawer / View Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-amber-400">
                  {viewingStudent.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold">{viewingStudent.full_name}</h2>
                  <p className="text-xs text-slate-300 font-mono">
                    Roll No: {viewingStudent.roll_number} · ID #{viewingStudent.student_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Personal & Academic Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Father / Guardian:</span>
                  <span className="font-semibold text-slate-900">{viewingStudent.father_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Class & Section:</span>
                  <span className="font-semibold text-slate-900">
                    {getClassObj(viewingStudent.class_id)?.class_name} ({getClassObj(viewingStudent.class_id)?.section})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contact Phone:</span>
                  <span className="font-mono font-semibold text-slate-900">{viewingStudent.phone_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Admission Date:</span>
                  <span className="font-mono text-slate-800">{viewingStudent.admission_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Monthly Tuition:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    PKR {getClassObj(viewingStudent.class_id)?.monthly_fee.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Residential Address:</span>
                  <span className="text-slate-800 truncate block" title={viewingStudent.address}>
                    {viewingStudent.address || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Fee History for this student */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Fee Payment History (فیس کا ریکارڈ)</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {getStudentFees(viewingStudent.student_id).length} slips recorded
                  </span>
                </h3>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px]">
                        <th className="py-2 px-3">Receipt #</th>
                        <th className="py-2 px-3">Month</th>
                        <th className="py-2 px-3">Paid Date</th>
                        <th className="py-2 px-3 text-right">Amount (PKR)</th>
                        <th className="py-2 px-3 text-center">Status</th>
                        <th className="py-2 px-3 text-right">View Slip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getStudentFees(viewingStudent.student_id).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-slate-400 text-xs">
                            No payment slips generated yet for this student.
                          </td>
                        </tr>
                      ) : (
                        getStudentFees(viewingStudent.student_id).map((f) => (
                          <tr key={f.fee_id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                              {f.receipt_no}
                            </td>
                            <td className="py-2 px-3 text-slate-700">{f.month}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{f.payment_date}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                              PKR {f.amount_paid.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  f.status === 'Paid'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : f.status === 'Partial'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {f.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                onClick={() => {
                                  onSelectFeeReceipt(f);
                                }}
                                className="text-slate-700 hover:text-slate-950 font-medium underline text-[11px] cursor-pointer"
                              >
                                Print Slip
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {currentRole !== 'teacher' && (
                    <button
                      onClick={(e) => openEditModal(viewingStudent, e)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Edit Student Details
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {editingStudent ? 'Edit Student Details (طالب علم کی تفصیل بدلیں)' : 'Add New Student (نیا داخلہ رجسٹر کریں)'}
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in all required fields for official school record
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name (پورا نام) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Ahmed Ali Khan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Roll Number (رول نمبر) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    placeholder="e.g. 10-SCI-05 or R-105"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Father / Guardian Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Father / Guardian Name (والد کا نام) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.father_name}
                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Class Assignment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class & Section (جماعت) *
                  </label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.class_id} value={c.class_id}>
                        {c.class_name} ({c.section}) - Fee: PKR {c.monthly_fee.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parent Phone Number (رابطہ نمبر) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="e.g. 0300-1234567"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Admission Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admission Date (داخلہ کی تاریخ) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.admission_date}
                    onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender (جنس)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="Male">Male (لڑکا)</option>
                    <option value="Female">Female (لڑکی)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enrollment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Graduated' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="Active">Active (جاری ہے)</option>
                    <option value="Inactive">Inactive / Left</option>
                    <option value="Graduated">Graduated (فارغ التحصیل)</option>
                  </select>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Home / Residential Address (مکمل رہائشی پتہ)
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House No. 12, Street 4, Satellite Town..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  {editingStudent ? 'Save Changes (محفوظ کریں)' : 'Save Student (ریکارڈ درج کریں)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
