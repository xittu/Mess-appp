export interface Member {
  id: string;
  name: string;
  joinDate: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  desc: string;
}

export interface UtilityExpense {
  id: string;
  name: string;
  amount: number;
}

export interface Deposit {
  id: string; // memberId
  amount: number;
}

export interface DutyAssignment {
  day: string; // e.g., "সোমবার", "মঙ্গলবার"
  memberId: string;
  role: string;
}
