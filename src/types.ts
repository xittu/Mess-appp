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
  memberId?: string; // Optional ID of the member who went to bazaar
}

export interface UtilityExpense {
  id: string;
  name: string;
  amount: number;
}

export interface Deposit {
  id: string; // unique
  memberId: string;
  amount: number;
  date: string;
}

export interface DutyAssignment {
  day: string; // e.g., "সোমবার", "মঙ্গলবার"
  memberId: string;
  role: string;
}

export interface BazaarItem {
  id: string;
  name: string;
  isChecked: boolean;
}
