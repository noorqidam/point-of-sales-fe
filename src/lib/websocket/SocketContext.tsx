import * as React from "react";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import {
  initialSocketMessage,
  SocketAction,
  SocketContextState,
  SocketDispatchActions,
  SocketUserPayload,
} from "@/lib/websocket/Socket";

import { socketAtom } from "@/store/socket";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";

const SocketContext =
  React.createContext<SocketContextState>(initialSocketMessage);

const socketReducer = (
  sockets: SocketContextState,
  action: SocketDispatchActions
): SocketContextState => {
  switch (action.type) {
    case SocketAction.ACT_LISTENING_USER: {
      return {
        ...sockets,
        user: action.value,
      };
    }
    case SocketAction.ACT_LISTENING_EXCEPTION: {
      return {
        ...sockets,
        exception: action.value,
      };
    }
    case SocketAction.ACT_REINITIATE: {
      return {
        ...initialSocketMessage,
      };
    }
    default:
      return sockets;
  }
};

export interface SocketProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProps> = ({ children }) => {
  const [socket] = useAtom(socketAtom);

  const { errorToast } = usePosToast();

  const { data: session } = useSession();

  const [socketState, dispatchSocketState] = React.useReducer(
    socketReducer,
    initialSocketMessage
  );

  const nameEventSocket = React.useMemo(
    () =>
      session
        ? [
            {
              name: "user-channel" + session?.user.id,
              action: SocketAction.ACT_LISTENING_USER,
            },
            {
              name: "exception",
              action: SocketAction.ACT_LISTENING_EXCEPTION,
            },
          ]
        : [],
    [session]
  );

  const socketDisconnect = React.useCallback(() => {
    console.log("DISCONNECT SOCKET");
    socket?.disconnect();

    nameEventSocket.forEach((it) => {
      socket?.off(it.name);
    });
  }, [nameEventSocket, socket]);

  const token = session?.accessToken ?? "";

  const socketReconnect = React.useCallback(() => {
    if (!socket) {
      console.log("NO SOCKET, CANNOT RECONNECT");
      return null;
    }

    if (token) {
      socket.io.opts.query = {
        token: token,
      };
      socket?.connect();

      for (const it of nameEventSocket) {
        if (socket?.hasListeners(it.name)) {
          continue;
        }
        // eslint-disable-next-line no-console
        console.log("Listening WebSocket event: " + it.name);

        socket?.on(it.name, (...parameters) => {
          switch (it.action) {
            case SocketAction.ACT_LISTENING_USER: {
              dispatchSocketState({
                type: SocketAction.ACT_LISTENING_USER,
                value: parameters[0] as SocketUserPayload,
              });

              break;
            }
          }
        });
      }
    } else {
      socketDisconnect();
    }
  }, [nameEventSocket, socket, socketDisconnect, token]);

  React.useEffect(() => {
    if (socketState.exception) {
      errorToast({
        description: "Socket error: " + socketState?.exception?.message,
        onCloseComplete: () => {
          dispatchSocketState({
            type: SocketAction.ACT_LISTENING_EXCEPTION,
            value: null,
          });
        },
      });
    }
  }, [errorToast, socketState.exception]);

  React.useEffect(() => {
    socketReconnect();

    socket?.on("disconnect", () => {
      setTimeout(() => socketReconnect(), 1000);
    });

    socket?.on("connect_error", () => {
      setTimeout(() => socketReconnect(), 1000);
    });

    return () => {
      socket?.off("disconnect");
      socket?.off("connect_error");
      socketDisconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const sendWebSocketPing = (date: string) => {
    if (!socket) {
      return;
    }

    if (socket?.connected) {
      socket?.emit("ping", date);
    }
  };

  const reInitiateSocketParameters = () => {
    dispatchSocketState({
      type: SocketAction.ACT_REINITIATE,
      value: initialSocketMessage,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        ...socketState,
        sendWebSocketPing,
        reInitiateSocketParameters,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
