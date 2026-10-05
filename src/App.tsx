import { useState, useEffect } from 'react';
import { DatabaseState, Student, Teacher, SchoolClass, FeeRecord, UserRole } from './types/database';
import { loadDatabase, saveDatabase } from './utils/storage';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import ClassesView from './components/ClassesView';
import TeachersView from './components/TeachersView';
import FeesView from './components/FeesView';
import FeeReceiptModal from './components/FeeReceiptModal';
import BackupModal from './components/BackupModal';
import SchoolCrest from './components/SchoolCrest';

export default function App() {
  const [database, setDatabase] = useState<DatabaseState>(() => loadDatabase());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isQuickFeeModalOpen, setIsQuickFeeModalOpen] = useState<boolean>(false);
  const [activeReceiptFee, setActiveReceiptFee] = useState<FeeRecord | null>(null);

  // Sync to localStorage whenever database state changes
  useEffect(() => {
    saveDatabase(database);
  }, [database]);

  // Handlers for Students
  const handleAddStudent = (newStudentData: Omit<Student, 'student_id'>) => {
    const nextId = database.students.length > 0 
      ? Math.max(...database.students.map((s) => s.student_id)) + 1 
      : 101;
    const newStudent: Student = {
      ...newStudentData,
      student_id: nextId,
    };
    setDatabase((prev) => ({
      ...prev,
      students: [newStudent, ...prev.students],
    }));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setDatabase((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.student_id === updatedStudent.student_id ? updatedStudent : s)),
    }));
  };

  const handleDeleteStudent = (studentId: number) => {
    setDatabase((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.student_id !== studentId),
      // Clean up orphaned fees
      fees: prev.fees.filter((f) => f.student_id !== studentId),
    }));
  };

  // Handlers for Teachers
  const handleAddTeacher = (newTeacherData: Omit<Teacher, 'teacher_id'>) => {
    const nextId = database.teachers.length > 0 
      ? Math.max(...database.teachers.map((t) => t.teacher_id)) + 1 
      : 1;
    const newTeacher: Teacher = {
      ...newTeacherData,
      teacher_id: nextId,
    };
    setDatabase((prev) => ({
      ...prev,
      teachers: [newTeacher, ...prev.teachers],
    }));
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setDatabase((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => (t.teacher_id === updatedTeacher.teacher_id ? updatedTeacher : t)),
    }));
  };

  const handleDeleteTeacher = (teacherId: number) => {
    setDatabase((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.teacher_id !== teacherId),
      classes: prev.classes.map((c) => (c.teacher_id === teacherId ? { ...c, teacher_id: null } : c)),
    }));
  };

  // Handlers for Classes
  const handleAddClass = (newClassData: Omit<SchoolClass, 'class_id'>) => {
    const nextId = database.classes.length > 0 
      ? Math.max(...database.classes.map((c) => c.class_id)) + 1 
      : 1;
    const newClass: SchoolClass = {
      ...newClassData,
      class_id: nextId,
    };
    setDatabase((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
  };

  const handleUpdateClass = (updatedClass: SchoolClass) => {
    setDatabase((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.class_id === updatedClass.class_id ? updatedClass : c)),
    }));
  };

  const handleDeleteClass = (classId: number) => {
    setDatabase((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.class_id !== classId),
    }));
  };

  // Handlers for Fees
  const handleAddFee = (feeData: Omit<FeeRecord, 'fee_id'>): FeeRecord => {
    const nextId = database.fees.length > 0 
      ? Math.max(...database.fees.map((f) => f.fee_id)) + 1 
      : 501;
    const newFee: FeeRecord = {
      ...feeData,
      fee_id: nextId,
    };
    setDatabase((prev) => ({
      ...prev,
      fees: [newFee, ...prev.fees],
    }));
    return newFee;
  };

  const handleUpdateFee = (updatedFee: FeeRecord) => {
    setDatabase((prev) => ({
      ...prev,
      fees: prev.fees.map((f) => (f.fee_id === updatedFee.fee_id ? updatedFee : f)),
    }));
  };

  const handleDeleteFee = (feeId: number) => {
    setDatabase((prev) => ({
      ...prev,
      fees: prev.fees.filter((f) => f.fee_id !== feeId),
    }));
  };

  // Helper for receipt modal
  const selectedReceiptStudent = activeReceiptFee
    ? database.students.find((s) => s.student_id === activeReceiptFee.student_id)
    : undefined;
  const selectedReceiptClass = selectedReceiptStudent
    ? database.classes.find((c) => c.class_id === selectedReceiptStudent.class_id)
    : undefined;

  const pendingFeesCount = database.fees.filter(
    (f) => f.status === 'Pending' || f.status === 'Partial'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenQuickFee={() => {
          setActiveTab('fees');
          setIsQuickFeeModalOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Navigation Sub-Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        counts={{
          students: database.students.length,
          teachers: database.teachers.length,
          classes: database.classes.length,
          pendingFees: pendingFeesCount,
        }}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            data={database}
            currentRole={currentRole}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectStudent={(st) => {
              setActiveTab('students');
              setSearchQuery(st.roll_number);
            }}
            onSelectFeeReceipt={(fee) => setActiveReceiptFee(fee)}
            onOpenAddStudent={() => setActiveTab('students')}
            onOpenQuickFee={() => {
              setActiveTab('fees');
              setIsQuickFeeModalOpen(true);
            }}
            onOpenAddTeacher={() => setActiveTab('teachers')}
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            students={database.students}
            classes={database.classes}
            fees={database.fees}
            currentRole={currentRole}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectFeeReceipt={(fee) => setActiveReceiptFee(fee)}
          />
        )}

        {activeTab === 'classes' && (
          <ClassesView
            classes={database.classes}
            teachers={database.teachers}
            students={database.students}
            currentRole={currentRole}
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
            onViewStudent={(st) => {
              setActiveTab('students');
              setSearchQuery(st.roll_number);
            }}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersView
            teachers={database.teachers}
            classes={database.classes}
            currentRole={currentRole}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {activeTab === 'fees' && (
          <FeesView
            fees={database.fees}
            students={database.students}
            classes={database.classes}
            currentRole={currentRole}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddFee={handleAddFee}
            onUpdateFee={handleUpdateFee}
            onDeleteFee={handleDeleteFee}
            onPrintReceipt={(fee) => setActiveReceiptFee(fee)}
            isQuickFeeModalOpen={isQuickFeeModalOpen}
            setIsQuickFeeModalOpen={setIsQuickFeeModalOpen}
          />
        )}
      </main>

      {/* School Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SchoolCrest size={20} className="text-amber-600" />
            <span className="font-semibold text-slate-800">{database.school_name}</span>
            <span aria-hidden="true">·</span>
            <span>{database.school_address}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>System Status: <span className="font-semibold text-emerald-700">Digital Register Online</span></span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Printable Official Fee Receipt Modal */}
      {activeReceiptFee && (
        <FeeReceiptModal
          fee={activeReceiptFee}
          student={selectedReceiptStudent}
          schoolClass={selectedReceiptClass}
          schoolInfo={{
            school_name: database.school_name,
            school_tagline: database.school_tagline,
            school_phone: database.school_phone,
            school_address: database.school_address,
          }}
          onClose={() => setActiveReceiptFee(null)}
        />
      )}

      {/* Backup & Database Security Modal */}
      {isBackupModalOpen && (
        <BackupModal
          data={database}
          onUpdateDatabase={(newData) => setDatabase(newData)}
          onClose={() => setIsBackupModalOpen(false)}
        />
      )}
    </div>
  );
}
