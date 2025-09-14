export interface Member {
  id: number;
  name: string;
  totalAmount: number;
  studentId?: string;
}

export interface ReimbursementRecord {
  id: string;
  date: string;
  totalAmount: number;
}
