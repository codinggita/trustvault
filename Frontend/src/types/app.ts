export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  relatedAccountId: string | null;
  accountName: string;
  relatedAccountName: string | null;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'completed' | 'pending';
  createdAt: string;
}
