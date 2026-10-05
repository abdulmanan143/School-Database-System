export type UserRole = 'admin' | 'accountant' | 'teacher';

export type PaymentStatus = 'Paid' | 'Pending' | 'Partial';

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Cheque';

export interface Student {
  student_id: number;
  full_name: string;
  roll_number: string;
  class_id: number;
  father_name: string;
  phone_number: string;
  admission_date: string; // YYYY-MM-DD
  address: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'Active' | 'Inactive' | 'Graduated';
}

export interface Teacher {
  teacher_id: number;
  full_name: string;
  subject: string;
  phone_number: string;
  salary: number;
  qualification: string;
  assigned_class_id?: number | null; // class they are incharge of
  join_date: string;
}

export interface SchoolClass {
  class_id: number;
  class_name: string; // e.g. "Class 5"
  section: string;    // e.g. "A"
  teacher_id: number | null; // Class Incharge teacher
  monthly_fee: number; // e.g. 3500
  room_number?: string;
}

export interface FeeRecord {
  fee_id: number;
  student_id: number;
  amount_paid: number;
  total_amount: number;
  payment_date: string; // YYYY-MM-DD
  month: string;        // e.g. "October 2026"
  status: PaymentStatus;
  receipt_no: string;   // e.g. "REC-2026-104"
  payment_method: PaymentMethod;
  notes?: string;
  collected_by?: string;
}

export interface DatabaseState {
  school_name: string;
  school_tagline: string;
  school_phone: string;
  school_address: string;
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  fees: FeeRecord[];
  last_backup_date?: string;
}
