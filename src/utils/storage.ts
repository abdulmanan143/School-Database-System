import { DatabaseState, Student, Teacher, SchoolClass, FeeRecord } from '../types/database';

export const STORAGE_KEY = 'maktaba_school_database_v1';

export const INITIAL_CLASSES: SchoolClass[] = [
  { class_id: 1, class_name: 'Class 1', section: 'A', teacher_id: 6, monthly_fee: 2500, room_number: 'Room 101' },
  { class_id: 2, class_name: 'Class 2', section: 'A', teacher_id: null, monthly_fee: 2700, room_number: 'Room 102' },
  { class_id: 3, class_name: 'Class 5', section: 'A', teacher_id: 4, monthly_fee: 3200, room_number: 'Room 201' },
  { class_id: 4, class_name: 'Class 5', section: 'B', teacher_id: 5, monthly_fee: 3200, room_number: 'Room 202' },
  { class_id: 5, class_name: 'Class 8', section: 'A', teacher_id: 3, monthly_fee: 3800, room_number: 'Room 301' },
  { class_id: 6, class_name: 'Class 9', section: 'Science', teacher_id: 2, monthly_fee: 4200, room_number: 'Lab Block A' },
  { class_id: 7, class_name: 'Class 10', section: 'Science', teacher_id: 1, monthly_fee: 4500, room_number: 'Lab Block B' },
  { class_id: 8, class_name: 'Class 10', section: 'Arts', teacher_id: null, monthly_fee: 4200, room_number: 'Room 304' },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    teacher_id: 1,
    full_name: 'Muhammad Tariq Khan',
    subject: 'Mathematics',
    phone_number: '0300-8472911',
    salary: 58000,
    qualification: 'M.Sc Applied Mathematics',
    assigned_class_id: 7,
    join_date: '2021-08-15',
  },
  {
    teacher_id: 2,
    full_name: 'Aisha Noor',
    subject: 'English Language & Lit',
    phone_number: '0321-4920188',
    salary: 52000,
    qualification: 'M.A English, B.Ed',
    assigned_class_id: 6,
    join_date: '2022-03-01',
  },
  {
    teacher_id: 3,
    full_name: 'Abdul Rehman Qureshi',
    subject: 'Physics & Chemistry',
    phone_number: '0333-7182904',
    salary: 62000,
    qualification: 'M.Sc Physics, M.Ed',
    assigned_class_id: 5,
    join_date: '2020-01-10',
  },
  {
    teacher_id: 4,
    full_name: 'Fatima Zahra',
    subject: 'Urdu & Islamiyat',
    phone_number: '0345-6619022',
    salary: 49000,
    qualification: 'M.A Urdu Literature',
    assigned_class_id: 3,
    join_date: '2022-09-12',
  },
  {
    teacher_id: 5,
    full_name: 'Kamran Ali Shah',
    subject: 'Computer Science',
    phone_number: '0312-9988344',
    salary: 54000,
    qualification: 'BS Computer Science',
    assigned_class_id: 4,
    join_date: '2023-02-15',
  },
  {
    teacher_id: 6,
    full_name: 'Sana Bilal',
    subject: 'General Science',
    phone_number: '0301-4478192',
    salary: 46000,
    qualification: 'B.Sc Botany, Zoology',
    assigned_class_id: 1,
    join_date: '2023-08-20',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 101,
    full_name: 'Ahmed Hassan',
    roll_number: '10-SCI-01',
    class_id: 7,
    father_name: 'Hassan Mehmood',
    phone_number: '0300-1234567',
    admission_date: '2022-04-05',
    address: 'House 14-B, Satellite Town, Rawalpindi',
    gender: 'Male',
    status: 'Active',
  },
  {
    student_id: 102,
    full_name: 'Zainab Bibi',
    roll_number: '10-SCI-02',
    class_id: 7,
    father_name: 'Muhammad Tariq',
    phone_number: '0321-7654321',
    admission_date: '2022-04-08',
    address: 'Street 4, Muslim Town, Lahore',
    gender: 'Female',
    status: 'Active',
  },
  {
    student_id: 103,
    full_name: 'Bilal Farooq',
    roll_number: '09-SCI-01',
    class_id: 6,
    father_name: 'Farooq Azam',
    phone_number: '0333-5551234',
    admission_date: '2023-03-12',
    address: 'Sector G-9/1, Islamabad',
    gender: 'Male',
    status: 'Active',
  },
  {
    student_id: 104,
    full_name: 'Mariam Khalid',
    roll_number: '08-A-01',
    class_id: 5,
    father_name: 'Khalid Masood',
    phone_number: '0345-9988771',
    admission_date: '2023-04-01',
    address: 'Near Jamia Masjid, Gulberg III',
    gender: 'Female',
    status: 'Active',
  },
  {
    student_id: 105,
    full_name: 'Usman Ali',
    roll_number: '05-A-12',
    class_id: 3,
    father_name: 'Ali Raza',
    phone_number: '0312-3344556',
    admission_date: '2024-03-20',
    address: 'Flat 3, Al-Madina Heights, Commercial Market',
    gender: 'Male',
    status: 'Active',
  },
  {
    student_id: 106,
    full_name: 'Hafsa Noor',
    roll_number: '05-B-08',
    class_id: 4,
    father_name: 'Noor Muhammad',
    phone_number: '0302-8877665',
    admission_date: '2024-04-02',
    address: 'Street 12, Mohalla Eidgah',
    gender: 'Female',
    status: 'Active',
  },
  {
    student_id: 107,
    full_name: 'Hamza Daniyal',
    roll_number: '01-A-04',
    class_id: 1,
    father_name: 'Daniyal Arshad',
    phone_number: '0322-1122334',
    admission_date: '2025-03-15',
    address: 'House 88, Model Town Extension',
    gender: 'Male',
    status: 'Active',
  },
  {
    student_id: 108,
    full_name: 'Fatima Imran',
    roll_number: '02-A-15',
    class_id: 2,
    father_name: 'Imran Sarwar',
    phone_number: '0341-9900112',
    admission_date: '2024-08-10',
    address: 'Main Bazar, Saddar Cantt',
    gender: 'Female',
    status: 'Active',
  },
  {
    student_id: 109,
    full_name: 'Saad Rafique',
    roll_number: '10-ART-03',
    class_id: 8,
    father_name: 'Rafique Ahmed',
    phone_number: '0305-6677889',
    admission_date: '2022-05-11',
    address: 'Near Civil Hospital Road',
    gender: 'Male',
    status: 'Active',
  },
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    fee_id: 501,
    student_id: 101,
    amount_paid: 4500,
    total_amount: 4500,
    payment_date: '2026-10-02',
    month: 'October 2026',
    status: 'Paid',
    receipt_no: 'REC-2026-1001',
    payment_method: 'Cash',
    notes: 'Full tuition fee paid on time',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 502,
    student_id: 102,
    amount_paid: 4500,
    total_amount: 4500,
    payment_date: '2026-10-03',
    month: 'October 2026',
    status: 'Paid',
    receipt_no: 'REC-2026-1002',
    payment_method: 'EasyPaisa',
    notes: 'Transaction ID: 9948210384',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 503,
    student_id: 103,
    amount_paid: 2000,
    total_amount: 4200,
    payment_date: '2026-10-04',
    month: 'October 2026',
    status: 'Partial',
    receipt_no: 'REC-2026-1003',
    payment_method: 'Cash',
    notes: 'Remaining 2200 PKR promised on 15th Oct',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 504,
    student_id: 104,
    amount_paid: 3800,
    total_amount: 3800,
    payment_date: '2026-10-01',
    month: 'October 2026',
    status: 'Paid',
    receipt_no: 'REC-2026-1004',
    payment_method: 'Bank Transfer',
    notes: 'Habib Bank Reference 882194',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 505,
    student_id: 105,
    amount_paid: 0,
    total_amount: 3200,
    payment_date: '2026-10-05',
    month: 'October 2026',
    status: 'Pending',
    receipt_no: 'CHAL-2026-1005',
    payment_method: 'Cash',
    notes: 'Due notice issued to parents',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 506,
    student_id: 106,
    amount_paid: 3200,
    total_amount: 3200,
    payment_date: '2026-09-28',
    month: 'September 2026',
    status: 'Paid',
    receipt_no: 'REC-2026-0988',
    payment_method: 'Cash',
    notes: 'Paid at desk',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 507,
    student_id: 107,
    amount_paid: 2500,
    total_amount: 2500,
    payment_date: '2026-10-02',
    month: 'October 2026',
    status: 'Paid',
    receipt_no: 'REC-2026-1007',
    payment_method: 'JazzCash',
    notes: 'Mobile payment received',
    collected_by: 'M. Akram (Accounts)',
  },
  {
    fee_id: 508,
    student_id: 108,
    amount_paid: 0,
    total_amount: 2700,
    payment_date: '2026-10-05',
    month: 'October 2026',
    status: 'Pending',
    receipt_no: 'CHAL-2026-1008',
    payment_method: 'Cash',
    notes: 'Challan generated, pending payment',
    collected_by: 'M. Akram (Accounts)',
  },
];

export const INITIAL_STATE: DatabaseState = {
  school_name: 'Allama Iqbal Model High School',
  school_tagline: 'Excellence in Character & Modern Academic Education',
  school_phone: '+92 51 4455667 / 0300-8472911',
  school_address: 'Main Boulevard, Education City, Rawalpindi / Islamabad',
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  classes: INITIAL_CLASSES,
  fees: INITIAL_FEES,
  last_backup_date: '2026-10-05',
};

export function loadDatabase(): DatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDatabase(INITIAL_STATE);
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.students || !parsed.teachers || !parsed.classes || !parsed.fees) {
      saveDatabase(INITIAL_STATE);
      return INITIAL_STATE;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load database from localStorage, resetting:', err);
    saveDatabase(INITIAL_STATE);
    return INITIAL_STATE;
  }
}

export function saveDatabase(data: DatabaseState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function exportDatabaseJson(data: DatabaseState): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `school_database_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportStudentsCsv(students: Student[], classes: SchoolClass[]): void {
  const headers = ['Student ID', 'Roll Number', 'Full Name', 'Father Name', 'Class', 'Section', 'Phone Number', 'Admission Date', 'Status', 'Address'];
  const rows = students.map((s) => {
    const cls = classes.find((c) => c.class_id === s.class_id);
    return [
      s.student_id,
      `"${s.roll_number}"`,
      `"${s.full_name}"`,
      `"${s.father_name}"`,
      `"${cls ? cls.class_name : '-'}"`,
      `"${cls ? cls.section : '-'}"`,
      `"${s.phone_number}"`,
      s.admission_date,
      s.status,
      `"${s.address.replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `students_roster_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportFeesCsv(fees: FeeRecord[], students: Student[], classes: SchoolClass[]): void {
  const headers = ['Receipt No', 'Date', 'Month', 'Roll No', 'Student Name', 'Class', 'Amount Paid (PKR)', 'Total Due (PKR)', 'Status', 'Method', 'Notes'];
  const rows = fees.map((f) => {
    const student = students.find((s) => s.student_id === f.student_id);
    const cls = student ? classes.find((c) => c.class_id === student.class_id) : null;
    return [
      `"${f.receipt_no}"`,
      f.payment_date,
      `"${f.month}"`,
      `"${student ? student.roll_number : '-'}"`,
      `"${student ? student.full_name : 'Unknown'}"`,
      `"${cls ? `${cls.class_name} (${cls.section})` : '-'}"`,
      f.amount_paid,
      f.total_amount,
      f.status,
      `"${f.payment_method}"`,
      `"${(f.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `fee_records_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
