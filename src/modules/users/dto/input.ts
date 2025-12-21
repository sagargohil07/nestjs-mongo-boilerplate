export interface InputRegisterUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface InputUpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface InputCreateUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
