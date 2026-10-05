import { useState } from 'react';
import { DatabaseState } from '../types/database';
import { exportDatabaseJson, exportStudentsCsv, exportFeesCsv, saveDatabase, INITIAL_STATE } from '../utils/storage';
import { X, Download, Upload, RefreshCw, FileSpreadsheet, ShieldCheck, AlertTriangle } from 'lucide-react';

interface BackupModalProps {
  data: DatabaseState;
  onUpdateDatabase: (newData: DatabaseState) => void;
  onClose: () => void;
}

export default function BackupModal({ data, onUpdateDatabase, onClose }: BackupModalProps) {
  const [importError, setImportError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleJsonBackup = () => {
    exportDatabaseJson(data);
    setSuccessMsg('Database JSON backup downloaded successfully!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleStudentsCsv = () => {
    exportStudentsCsv(data.students, data.classes);
    setSuccessMsg('Students list CSV exported successfully!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleFeesCsv = () => {
    exportFeesCsv(data.fees, data.students, data.classes);
    setSuccessMsg('Fee records CSV exported successfully!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.students || !parsed.teachers || !parsed.classes || !parsed.fees) {
          throw new Error('Invalid backup file structure. Missing core tables.');
        }
        saveDatabase(parsed);
        onUpdateDatabase(parsed);
        setSuccessMsg(`Database restored successfully (${parsed.students.length} students, ${parsed.fees.length} fee records).`);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1500);
      } catch (err: unknown) {
        const error = err as Error;
        setImportError(error.message || 'Failed to read file. Please ensure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (window.confirm('Are you sure you want to reset the database to demo sample data? This will overwrite recent changes.')) {
      saveDatabase(INITIAL_STATE);
      onUpdateDatabase(INITIAL_STATE);
      setSuccessMsg('Database has been reset to original demo data.');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Database Backup & Security (Record Mehfooz)
              </h2>
              <p className="text-xs text-slate-500">
                Create offline daily backups, restore records, or export spreadsheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800 flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0 text-rose-600" />
              <span>{importError}</span>
            </div>
          )}

          {/* Quick Stats of Current Database */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Students</span>
              <span className="text-sm font-bold font-mono text-slate-900">{data.students.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Teachers</span>
              <span className="text-sm font-bold font-mono text-slate-900">{data.teachers.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Classes</span>
              <span className="text-sm font-bold font-mono text-slate-900">{data.classes.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Fee Slips</span>
              <span className="text-sm font-bold font-mono text-slate-900">{data.fees.length}</span>
            </div>
          </div>

          {/* Backup Action 1: JSON Full Backup */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Full Database Backup (Kamil Backup)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Save all 4 tables (Students, Teachers, Classes, Fees) into a single secure file.
                </p>
              </div>
              <button
                onClick={handleJsonBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Backup Action 2: Restore from Backup */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">
              Restore Database from File (Backup Se Wapis Lana)
            </h3>
            <p className="text-[11px] text-slate-500">
              Select a previously saved JSON backup file to restore records.
            </p>
            <div className="pt-1">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                <Upload size={14} />
                <span>Select Backup JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileImport}
                />
              </label>
            </div>
          </div>

          {/* Backup Action 3: Spreadsheet Exports */}
          <div className="border border-slate-200 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900">
              Export to Excel / Spreadsheets (CSV)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleStudentsCsv}
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <FileSpreadsheet size={14} className="text-emerald-600" />
                <span>Students Roster CSV</span>
              </button>
              <button
                onClick={handleFeesCsv}
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <FileSpreadsheet size={14} className="text-blue-600" />
                <span>Fee Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Danger zone / Reset */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
            <span className="text-slate-500">Need fresh test records?</span>
            <button
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
