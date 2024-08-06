import { posAPIURL } from "@/lib/constants";
import { atom } from "jotai";
import { io, Socket } from "socket.io-client";

const socketIO = io(posAPIURL, {
  transports: ["websocket"],
});

export const socketAtom = atom<null | Socket>(socketIO);
