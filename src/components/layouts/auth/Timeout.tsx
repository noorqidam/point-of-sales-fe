import * as React from "react";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useDebounce, useInterval } from "react-use";

import { usePosToast } from "@/hooks/usePosToast/usePosToast";

import { Cursor } from "@/types/auth/timeout";
import { useLogOut } from "@/hooks/useLogOut";

export interface TimeoutSessionProps {
  children: React.ReactNode;
}

const TimeoutSession: React.FC<TimeoutSessionProps> = ({ children }) => {
  const { errorToast } = usePosToast();
  const firstCursor: Cursor = {
    x: 0,
    y: 0,
  };
  const [cursor, setCursor] = React.useState<Cursor>({ ...firstCursor });
  const [cursorTrigger, setCursorTrigger] = React.useState<Cursor>({
    ...firstCursor,
  });

  const { data: session } = useSession();
  const timeout = (session?.timeout?.total_in_minute ?? 60) * 60 * 1000;

  const { handleLogoutAndRedirect } = useLogOut();

  React.useEffect(() => {
    const temp: NodeJS.Timeout = setTimeout(() => {
      errorToast({
        title: "Keluar otomatis",
        description:
          "Aplikasi tidak mendeteksi adanya aktifitas. Anda dikeluarkan secara otomatis",
      });

      setTimeout(() => handleLogoutAndRedirect(), 1750);
    }, timeout);

    return () => clearTimeout(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTrigger]);

  useDebounce(
    () => {
      localStorage.setItem("CURSOR_EVENT_TIMEOUT", JSON.stringify(cursor));
    },
    1000,
    [cursor]
  );

  useInterval(() => {
    const temp = localStorage.getItem("CURSOR_EVENT_TIMEOUT");
    if (temp !== null) {
      const tempCursor: Cursor = JSON.parse(temp);
      if (
        tempCursor.x !== cursorTrigger.x &&
        tempCursor.y !== cursorTrigger.y
      ) {
        setCursorTrigger(tempCursor);
      }
    }
  }, 2500);

  return (
    <Box
      onPointerMove={(e) =>
        setCursor({
          x: e.clientX,
          y: e.clientY,
        })
      }
    >
      {children}
    </Box>
  );
};

export default TimeoutSession;
