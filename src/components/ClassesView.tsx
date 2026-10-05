import { useState } from 'react';
import { SchoolClass, Teacher, Student, UserRole } from '../types/database';
import { Plus, Edit2, Trash2, Users, GraduationCap, DollarSign, BookOpen } from 'lucide-react';

interface ClassesViewProps {
  classes: SchoolClass[];
  teachers: Teacher[];
  students: Student[];
  currentRole: UserRole;
  onAddClass: (newClass: Omit<SchoolClass, 'class_id'>) => void;
  onUpdateClass: (updatedClass: SchoolClass) => void;
  onDeleteClass: (classId: number) => void;
  onViewStudent: (student: Student) => void;
}

export default function ClassesView({
  classes,
  teachers,
  students,
  currentRole,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onViewStudent,
}: ClassesViewProps) {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(classes[0]?.class_id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const [formData, setFormData] = useState({
    class_name: '',
    section: 'A',
    teacher_id: null as number | null,
    monthly_fee: 3000,
    room_number: '',
  });

  const resetForm = () => {
    setFormData({
      class_name: '',
      section: 'A',
      teacher_id: null,
      monthly_fee: 3000,
      room_number: '',
    });
    setEditingClass(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (c: SchoolClass, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass(c);
    setFormData({
      class_name: c.class_name,
      section: c.section,
      teacher_id: c.teacher_id,
      monthly_fee: c.monthly_fee,
      room_number: c.room_number || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class_name.trim()) {
      alert('Please enter a class name (e.g. Class 7)');
      return;
    }

    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        class_name: formData.class_name.trim(),
        section: formData.section.trim(),
        teacher_id: formData.teacher_id ? Number(formData.teacher_id) : null,
        monthly_fee: Number(formData.monthly_fee) || 0,
        room_number: formData.room_number.trim(),
      });
    } else {
      onAddClass({
        class_name: formData.class_name.trim(),
        section: formData.section.trim(),
        teacher_id: formData.teacher_id ? Number(formData.teacher_id) : null,
        monthly_fee: Number(formData.monthly_fee) || 0,
        room_number: formData.room_number.trim(),
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (classId: number, className: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const enrolled = students.filter((s) => s.class_id === classId).length;
    if (enrolled > 0) {
      alert(`Cannot delete this class because ${enrolled} students are currently assigned to it. Please reassign the students first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${className}?`)) {
      onDeleteClass(classId);
      if (selectedClassId === classId) {
        setSelectedClassId(classes.find((c) => c.class_id !== classId)?.class_id || null);
      }
    }
  };

  const selectedClass = classes.find((c) => c.class_id === selectedClassId) || classes[0];
  const enrolledStudents = selectedClass
    ? students.filter((s) => s.class_id === selectedClass.class_id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Class & Section Management (جماعتوں کا نظام)</span>
            <span aria-hidden="true">·</span>
            <span>Total Classes: {classes.length}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Classes, Sections & Monthly Fee Structure
          </h1>
          <p className="text-xs text-slate-600">
            Define grade levels, assign class incharge teachers, and set monthly tuition fees
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ Add New Class (نئی جماعت بنائیں)</span>
          </button>
        )}
      </div>

      {/* Main split view: Classes List & Selected Class Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: All Classes Grid/Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Configured Classes ({classes.length})
          </h2>

          <div className="space-y-2.5">
            {classes.map((c) => {
              const count = students.filter((s) => s.class_id === c.class_id).length;
              const incharge = teachers.find((t) => t.teacher_id === c.teacher_id);
              const isSelected = selectedClass?.class_id === c.class_id;

              return (
                <div
                  key={c.class_id}
                  onClick={() => setSelectedClassId(c.class_id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-slate-900 shadow-xs ring-1 ring-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {c.class_name}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 font-medium text-slate-700 rounded text-xs">
                          Section {c.section}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {c.room_number ? `${c.room_number} · ` : ''}Monthly Fee: <strong className="font-mono text-slate-900 font-semibold">PKR {c.monthly_fee.toLocaleString()}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {currentRole === 'admin' && (
                        <>
                          <button
                            onClick={(e) => openEditModal(c, e)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Edit Class / Fee"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(c.class_id, `${c.class_name} (${c.section})`, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Class"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <GraduationCap size={13} className="text-slate-400" />
                      <span className="text-[11px] truncate max-w-[160px]">
                        {incharge ? incharge.full_name : 'No Incharge Assigned'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-900 font-mono font-semibold text-[11px]">
                      <Users size={12} className="text-slate-400" />
                      <span>{count} students</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Class Details & Students Roster (7 cols) */}
        <div className="lg:col-span-7">
          {selectedClass ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedClass.class_name} - Section {selectedClass.section}
                    </h2>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
                      PKR {selectedClass.monthly_fee.toLocaleString()} / month
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Class Incharge Teacher:{' '}
                    <strong className="text-slate-800">
                      {teachers.find((t) => t.teacher_id === selectedClass.teacher_id)?.full_name || 'Not assigned yet'}
                    </strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Enrolled Students</span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {enrolledStudents.length}
                  </span>
                </div>
              </div>

              {/* Enrolled Students Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2">
                  Class Student Roster (اس جماعت کے طلباء کی فہرست)
                </h3>

                {enrolledStudents.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                    No students currently enrolled in this class section.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="py-2.5 px-3">Roll No</th>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Father Name</th>
                          <th className="py-2.5 px-3">Parent Contact</th>
                          <th className="py-2.5 px-3 text-right">Profile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enrolledStudents.map((st) => (
                          <tr key={st.student_id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-mono font-bold text-slate-900">
                              {st.roll_number}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-900">
                              {st.full_name}
                            </td>
                            <td className="py-2 px-3 text-slate-600">{st.father_name}</td>
                            <td className="py-2 px-3 font-mono text-slate-600">{st.phone_number}</td>
                            <td className="py-2 px-3 text-right">
                              <button
                                onClick={() => onViewStudent(st)}
                                className="text-slate-700 hover:text-slate-900 font-medium underline text-xs cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-xs text-slate-500">
              Select a class to view its details and enrolled students.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {editingClass ? 'Edit Class & Fee Structure' : 'Create New Class & Section'}
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name (جماعت کا نام) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  placeholder="e.g. Class 6, Class 7, Matric"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Section (سیکشن) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g. A, B, Science, Arts"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Tuition Fee (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={formData.monthly_fee}
                    onChange={(e) => setFormData({ ...formData, monthly_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Incharge Teacher (کلاس انچارج استاد)
                </label>
                <select
                  value={formData.teacher_id || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teacher_id: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  <option value="">No Incharge Assigned</option>
                  {teachers.map((t) => (
                    <option key={t.teacher_id} value={t.teacher_id}>
                      {t.full_name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Room Number (کمرہ جماعت)
                </label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  placeholder="e.g. Room 204 or Science Lab 1"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
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
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
