const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/export interface Expense \{\n  id: string;\n  created_at: string;/g, 'export interface Expense {\n  id: string;\n  date: string;');
code = code.replace(/export interface Deposit \{\n  id: string; \/\/ unique\n  memberId: string;\n  amount: number;\n  created_at: string;/g, 'export interface Deposit {\n  id: string; // unique\n  memberId: string;\n  amount: number;\n  date: string;');
code = code.replace(/export interface Attendance \{\n  id: string;\n  user_id: string;\n  user_name: string;\n  created_at: string;/g, 'export interface Attendance {\n  id: string;\n  user_id: string;\n  user_name: string;\n  date: string;');

fs.writeFileSync('src/types.ts', code);
