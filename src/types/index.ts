export type SubscriptionStatus = 'free' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export interface UploadRecord {
  id: string;
  user_id: string;
  original_url: string;
  result_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_name: string;
  file_size: number;
  created_at: string;
  expires_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'usage' | 'purchase' | 'bonus';
  description: string;
  created_at: string;
}
