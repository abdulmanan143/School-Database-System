import { DatabaseState, Student, FeeRecord, SchoolClass, UserRole } from '../types/database';
import { Users, GraduationCap, BookOpen, CreditCard, AlertCircle, ArrowUpRight, Plus, Eye } from 'lucide-react';

interface DashboardViewProps {
  data: DatabaseState;
  currentRole: UserRole;
  onNavigate: (tab: string) => void;
  onSelectStudent: (student: Student) => void;
  onSelectFeeReceipt: (fee: FeeRecord) => void;
  onOpenAddStudent: () => void;
  onOpenQuickFee: () => void;
  onOpenAddTeacher: () => void;
}

export default function DashboardView({
  data,
  currentRole,
  onNavigate,
  onSelectStudent,
  onSelectFeeReceipt,
  onOpenAddStudent,
  onOpenQuickFee,
  onOpenAddTeacher,
}: DashboardViewProps) {
  const { students, teachers, classes, fees } = data;

  // Financial calculations
  const totalCollected = fees.reduce((sum, f) => sum + (f.amount_paid || 0), 0);
  const totalBilled = fees.reduce((sum, f) => sum + (f.total_amount || 0), 0);
  const pendingDues = Math.max(0, totalBilled - totalCollected);
  const pendingCount = fees.filter((f) => f.status === 'Pending' || f.status === 'Partial').length;

  // Recent fee slips
  const recentFees = [...fees].sort((a, b) => b.fee_id - a.fee_id).slice(0, 5);
  // Recent student admissions
  const recentStudents = [...students].sort((a, b) => b.student_id - a.student_id).slice(0, 5);

  const getClassInfo = (classId: number): SchoolClass | undefined => {
    return classes.find((c) => c.class_id === classId);
  };

  const getStudent = (studentId: number): Student | undefined => {
    return students.find((s) => s.student_id === studentId);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>School Dashboard</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{currentRole} Mode</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">October 2026</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {data.school_name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Digital Register & Record System (ڈیجیٹل اسکول ریکارڈ سسٹم)
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentRole !== 'teacher' && (
            <>
              <button
                onClick={onOpenAddStudent}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Naya Student</span>
              </button>
              <button
                onClick={onOpenQuickFee}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <CreditCard size={14} />
                <span>+ Deposit Fee (Rasid)</span>
              </button>
            </>
          )}
          {currentRole === 'admin' && (
            <button
              onClick={onOpenAddTeacher}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Add Teacher</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Students (طلباء)</span>
            <Users size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {students.length}
            </span>
            <span className="text-[11px] text-slate-500">enrolled</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Across {classes.length} classes & sections</span>
          </div>
        </div>

        {/* Metric 2: Teachers */}
        <div
          onClick={() => onNavigate('teachers')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Teaching Faculty (اساتذہ)</span>
            <GraduationCap size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {teachers.length}
            </span>
            <span className="text-[11px] text-slate-500">teachers</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <span>All major subjects covered</span>
          </div>
        </div>

        {/* Metric 3: Fee Collected */}
        <div
          onClick={() => onNavigate('fees')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fee Collected (وصول شدہ)</span>
            <CreditCard size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              PKR {totalCollected.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <span>From {fees.filter((f) => f.amount_paid > 0).length} payment receipts</span>
          </div>
        </div>

        {/* Metric 4: Pending Fee Dues */}
        <div
          onClick={() => onNavigate('fees')}
          className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Dues (واجب الادا)</span>
            <AlertCircle size={16} className="text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              PKR {pendingDues.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
            <span>{pendingCount} students have pending dues</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Fee Slips & Recent Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Recent Fee Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Fee Receipts (فیس کی رسیدیں)</h2>
              <p className="text-[11px] text-slate-500">Latest payment entries and vouchers generated</p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentFees.map((fee) => {
              const student = getStudent(fee.student_id);
              const cls = student ? getClassInfo(student.class_id) : undefined;
              return (
                <div
                  key={fee.fee_id}
                  className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        fee.status === 'Paid'
                          ? 'bg-emerald-500'
                          : fee.status === 'Partial'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{student?.full_name || 'Student'}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          ({student?.roll_number})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {cls ? `${cls.class_name} (${cls.section})` : '-'} · {fee.month}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        PKR {fee.amount_paid.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {fee.payment_method} · {fee.status}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectFeeReceipt(fee)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-md transition-colors cursor-pointer"
                      title="View & Print Official Receipt"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Student Admissions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Student Register (طلباء کا ریکارڈ)</h2>
              <p className="text-[11px] text-slate-500">Registered students with roll numbers and class</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentStudents.map((st) => {
              const cls = getClassInfo(st.class_id);
              return (
                <div
                  key={st.student_id}
                  onClick={() => onSelectStudent(st)}
                  className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-700 text-xs shrink-0">
                      {st.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {st.full_name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        S/o {st.father_name} · Contact: {st.phone_number}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                      {cls ? `${cls.class_name} (${cls.section})` : '-'}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                      Roll: {st.roll_number}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Classes Overview Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Class Structure & Fee Schedule (جماعتوں کی فیس لسٹ)</h2>
            <p className="text-[11px] text-slate-500">Monthly fees and assigned class incharge teachers</p>
          </div>
          <button
            onClick={() => onNavigate('classes')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Manage Classes</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {classes.map((c) => {
            const enrolled = students.filter((s) => s.class_id === c.class_id).length;
            const teacher = teachers.find((t) => t.teacher_id === c.teacher_id);
            return (
              <div
                key={c.class_id}
                onClick={() => onNavigate('classes')}
                className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-slate-50/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    {c.class_name} <span className="font-normal text-slate-500">({c.section})</span>
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-700 tabular-nums">
                    {enrolled} std
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 flex justify-between">
                  <span>Fee:</span>
                  <span className="font-mono font-semibold text-slate-900">PKR {c.monthly_fee.toLocaleString()}</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 truncate" title={teacher ? teacher.full_name : 'No Incharge'}>
                  Incharge: {teacher ? teacher.full_name.split(' ')[0] : 'Not Assigned'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
