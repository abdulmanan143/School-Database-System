import { useState } from 'react';
import { Teacher, SchoolClass, UserRole } from '../types/database';
import { Plus, Edit2, Trash2, Search, GraduationCap, Phone, DollarSign, Award, BookOpen } from 'lucide-react';

interface TeachersViewProps {
  teachers: Teacher[];
  classes: SchoolClass[];
  currentRole: UserRole;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddTeacher: (teacher: Omit<Teacher, 'teacher_id'>) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: number) => void;
}

export default function TeachersView({
  teachers,
  classes,
  currentRole,
  searchQuery,
  setSearchQuery,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}: TeachersViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    subject: '',
    phone_number: '',
    salary: 50000,
    qualification: '',
    assigned_class_id: null as number | null,
    join_date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      subject: '',
      phone_number: '',
      salary: 50000,
      qualification: '',
      assigned_class_id: null,
      join_date: new Date().toISOString().split('T')[0],
    });
    setEditingTeacher(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      full_name: teacher.full_name,
      subject: teacher.subject,
      phone_number: teacher.phone_number,
      salary: teacher.salary,
      qualification: teacher.qualification,
      assigned_class_id: teacher.assigned_class_id || null,
      join_date: teacher.join_date,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.subject.trim()) {
      alert('Please fill in teacher full name and teaching subject.');
      return;
    }

    if (editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        ...formData,
        salary: Number(formData.salary) || 0,
        assigned_class_id: formData.assigned_class_id ? Number(formData.assigned_class_id) : null,
      });
    } else {
      onAddTeacher({
        ...formData,
        salary: Number(formData.salary) || 0,
        assigned_class_id: formData.assigned_class_id ? Number(formData.assigned_class_id) : null,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (teacherId: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete teacher "${name}"?`)) {
      onDeleteTeacher(teacherId);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.full_name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.phone_number.includes(q) ||
      t.qualification.toLowerCase().includes(q)
    );
  });

  const totalPayroll = teachers.reduce((sum, t) => sum + (t.salary || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Teacher Management (اساتذہ کا ریکارڈ)</span>
            <span aria-hidden="true">·</span>
            <span>Total Faculty: {teachers.length}</span>
            {currentRole === 'admin' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono">Payroll: PKR {totalPayroll.toLocaleString()}/mo</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Teaching Faculty & Class Incharges
          </h1>
          <p className="text-xs text-slate-600">
            Teacher profiles, subject assignments, salary packages, and class responsibility
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ Add Teacher Profile (نیا استاد شامل کریں)</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 border border-slate-200 rounded-xl max-w-md relative">
        <Search size={15} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teacher by name, subject, or contact..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => {
          const assignedClass = classes.find((c) => c.teacher_id === t.teacher_id || c.class_id === t.assigned_class_id);

          return (
            <div
              key={t.teacher_id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shrink-0">
                      {t.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {t.full_name}
                      </h3>
                      <p className="text-xs text-amber-700 font-medium">{t.subject}</p>
                    </div>
                  </div>

                  {currentRole === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                        title="Edit Teacher"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.teacher_id, t.full_name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Delete Teacher"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Details List */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Award size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{t.qualification || 'Degree recorded'}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span>{t.phone_number}</span>
                  </div>
                  {currentRole === 'admin' && (
                    <div className="flex items-center justify-between font-mono bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-500 font-sans text-[11px]">Monthly Salary:</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        PKR {t.salary.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Incharge Banner */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Incharge Role:</span>
                {assignedClass ? (
                  <span className="font-semibold text-slate-900 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                    {assignedClass.class_name} ({assignedClass.section})
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Subject Specialist</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {editingTeacher ? 'Edit Teacher Profile' : 'Add New Teacher Profile'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teacher Full Name (استاد کا پورا نام) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Muhammad Tariq"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teaching Subject (مضمون) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Mathematics, Physics, Urdu"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone (موبائل نمبر) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="e.g. 0300-8472911"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Salary (ماہانہ تنخواہ PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Qualification */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Qualification (تعلیمی قابلیت)
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. M.Sc Mathematics, B.Ed, M.Phil"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Assign Class Incharge */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign Class Incharge (کلاس انچارج مقرر کریں)
                  </label>
                  <select
                    value={formData.assigned_class_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assigned_class_id: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="">No Incharge Assignment</option>
                    {classes.map((c) => (
                      <option key={c.class_id} value={c.class_id}>
                        {c.class_name} ({c.section})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
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
                  {editingTeacher ? 'Update Teacher' : 'Save Teacher Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
