import React, { useState, useEffect, PropsWithChildren } from "react";
import socketIOClient from "socket.io-client";
import { SERVER_URL } from "../../constant/env";

export interface SocketInterface {
  curSocket: any;
}

export const SocketContext = React.createContext<SocketInterface>({
  curSocket: null,
});

export const SocketContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [curSocket, setCurSocket] = useState<any>(null);

  useEffect(() => {
    const socket = socketIOClient(SERVER_URL);
    setCurSocket(socket);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        curSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
