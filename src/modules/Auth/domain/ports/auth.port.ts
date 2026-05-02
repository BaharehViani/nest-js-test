export const AUTH_PORT = "AUTH_PORT";

export abstract class AuthPort {
  abstract findUserByPhone(phoneNumber: string): Promise<any>;
  abstract findUserById(id: string): Promise<any>;
  abstract findSession(phoneNumber: string): Promise<any>;
  abstract deleteSession(phoneNumber: string): Promise<void>;
  abstract createSession(data: {
    phoneNumber: string;
    code: string;
    expiresAt: Date;
  }): Promise<void>;

  abstract createUser(data: any): Promise<any>;
  abstract updateUserPassword(phone: string, password: string): Promise<void>;
}