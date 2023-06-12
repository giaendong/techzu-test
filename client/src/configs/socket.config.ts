import { io, Socket } from 'socket.io-client';
import { BasicSocketType } from './Types.Socket';

interface ServerToClientEvents {
  comments: ({id, type, userId}: BasicSocketType) => void;
}

interface ClientToServerEvents {
  comments: ({id, type, userId}: BasicSocketType) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.REACT_APP_API_HOST || 'http://localhost:3001' );

export default socket;