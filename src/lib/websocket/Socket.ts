export enum SocketAction {
  ACT_LISTENING_USER = "ACT_LISTENING_USER",
  ACT_LISTENING_EXCEPTION = "ACT_LISTENING_EXCEPTION",
  ACT_REINITIATE = "ACT_REINITIATE",
}

export interface SocketContextState {
  user: SocketUserPayload;
  exception: SocketExceptionPayload | null;
  reInitiateSocketParameters: () => void;
  sendWebSocketPing: (date: string) => void;
}

export interface SocketUserPayload {
  forceLogout?: boolean;
}

export interface SocketExceptionPayload {
  status: string;
  message: string;
}

export const initSocketUser: SocketUserPayload = {
  forceLogout: false,
};

export const initialSocketMessage: SocketContextState = {
  user: initSocketUser,
  reInitiateSocketParameters: () => {},
  sendWebSocketPing: () => {},
  exception: null,
};

export type SocketDispatchActions =
  | {
      type: SocketAction.ACT_LISTENING_USER;
      value: SocketUserPayload;
    }
  | {
      type: SocketAction.ACT_LISTENING_EXCEPTION;
      value: SocketExceptionPayload | null;
    }
  | { type: SocketAction.ACT_REINITIATE; value: SocketContextState };
