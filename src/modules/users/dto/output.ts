export interface OutputUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface OutputUserList {
  users: OutputUser[];
  total: number;
}
