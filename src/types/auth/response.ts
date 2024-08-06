import { User } from "@/types/auth/user";
import { Alert } from "@/types/alert";
import { Timeout } from "@/types/auth/timeout";

export interface LoginResponse {
  message: Alert;
  data: DataUser;
}

export interface DataUser {
  user: User;
  accessToken: string;
  refreshToken: string;
  timeout?: Timeout;
}
