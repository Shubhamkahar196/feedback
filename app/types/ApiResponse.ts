import { Message } from "../model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
  token?: string;              // used in sign-in
  user?: {
    _id: string;
    username: string;
    email: string;
    isAcceptingMessage: boolean;
  };
}
