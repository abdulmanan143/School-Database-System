import { LayoutDashboard, Users, BookOpen, GraduationCap, Receipt, Database } from 'lucide-react';
import { UserRole } from '../types/database';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  onOpenBackup: () => void;
  counts: {
    students: number;
    teachers: number;
    classes: number;
    pendingFees: number;
  };
}

export default function NavigationTabs({
  activeTab,
  setActiveTab,
  currentRole,
  onOpenBackup,
  counts,
}: NavigationTabsProps) {
  const tabs = [
    { id: 'dashboard', label: 'Overview', urdu: 'خلاصہ', icon: LayoutDashboard },
    { id: 'students', label: 'Students', urdu: 'طلباء', count: counts.students, icon: Users },
    { id: 'classes', label: 'Classes', urdu: 'جماعتیں', count: counts.classes, icon: BookOpen },
    { id: 'teachers', label: 'Teachers', urdu: 'اساتذہ', count: counts.teachers, icon: GraduationCap },
    { id: 'fees', label: 'Fee Records', urdu: 'فیس رجسٹر', badgeCount: counts.pendingFees, icon: Receipt },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2 gap-2 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    ({tab.urdu})
                  </span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                      }`}
                      title={`${tab.badgeCount} pending fee records`}
                    >
                      {tab.badgeCount} due
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <span className="text-[11px]">Role: <strong className="text-slate-800 capitalize">{currentRole}</strong></span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenBackup}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Database size={12} />
              <span>Backup Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
