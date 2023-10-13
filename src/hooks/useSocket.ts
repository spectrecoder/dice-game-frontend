import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const useSocket = () => {
  const { curSocket } = useContext(SocketContext);
  return curSocket;
};

export default useSocket;
