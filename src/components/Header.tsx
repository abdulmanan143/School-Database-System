import { UserRole } from '../types/database';
import SchoolCrest from './SchoolCrest';
import { Shield, CreditCard, GraduationCap, Database, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenBackup: () => void;
  onOpenQuickFee: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  onOpenBackup,
  onOpenQuickFee,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: typeof Shield }> = {
    admin: { title: 'Principal / Admin', subtitle: 'Full Access (Mukammal Ikhtiyar)', icon: Shield },
    accountant: { title: 'Accountant / Clerk', subtitle: 'Fee & Dues Focus', icon: CreditCard },
    teacher: { title: 'Teacher View', subtitle: 'Classes & Rosters', icon: GraduationCap },
  };

  const CurrentRoleIcon = roleLabels[currentRole].icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
            >
              <SchoolCrest size={28} className="text-amber-600 transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                  Maktaba School Database
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  اسکول مینجمنٹ ڈیٹا بیس سسٹم
                </span>
              </div>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative mx-2">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, roll #, teacher..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors py-1 cursor-pointer ${
                activeTab === 'dashboard' ? 'text-slate-950 border-b-2 border-slate-900' : ''
              }`}
            >
              Overview (Khulasa)
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`hover:text-slate-900 transition-colors py-1 cursor-pointer ${
                activeTab === 'students' ? 'text-slate-950 border-b-2 border-slate-900' : ''
              }`}
            >
              Students (Talib-e-Ilm)
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`hover:text-slate-900 transition-colors py-1 cursor-pointer ${
                activeTab === 'classes' ? 'text-slate-950 border-b-2 border-slate-900' : ''
              }`}
            >
              Classes (Jamaten)
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`hover:text-slate-900 transition-colors py-1 cursor-pointer ${
                activeTab === 'teachers' ? 'text-slate-950 border-b-2 border-slate-900' : ''
              }`}
            >
              Teachers (Asateza)
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`hover:text-slate-900 transition-colors py-1 cursor-pointer ${
                activeTab === 'fees' ? 'text-slate-950 border-b-2 border-slate-900' : ''
              }`}
            >
              Fee Management (Fees)
            </button>
          </nav>

          {/* Zone 3: Actions & Role Mode */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Role Switcher Pill */}
            <div className="relative inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <label htmlFor="role-select" className="sr-only">Switch Role</label>
              <CurrentRoleIcon size={13} className="ml-2 mr-1 text-slate-500 shrink-0" />
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-semibold text-slate-800 pr-2 py-1 rounded focus:outline-none cursor-pointer"
                title="Switch User Role to test different permission perspectives"
              >
                <option value="admin">Principal (Admin)</option>
                <option value="accountant">Clerk (Accounts)</option>
                <option value="teacher">Teacher (Class View)</option>
              </select>
            </div>

            {/* Quick Fee Collection Button (Accountant/Admin) */}
            {currentRole !== 'teacher' && (
              <button
                onClick={onOpenQuickFee}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <CreditCard size={14} />
                <span>+ Collect Fee</span>
              </button>
            )}

            {/* Backup & Database Tools */}
            <button
              onClick={onOpenBackup}
              title="Daily Backup & Restore Database"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Database size={14} className="text-slate-500" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
