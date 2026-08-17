export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface UserStatusInfo {
  userId: string;
  status: UserStatus;
  rejectionReason?: string;
}
