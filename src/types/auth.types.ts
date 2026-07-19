export type UserStatus = 'pending' | 'active' | 'rejected';

export interface UserStatusInfo {
  userId: string;
  status: UserStatus;
  rejectionReason?: string;
}
