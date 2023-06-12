import { Server } from 'socket.io';
const { CLIENT_URL } = process.env;
export let io = null;
export let ioSocket = null;

export function socketConnect(server) {
  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });
  
  io.on('connection', (socket) => {
    console.log("User connected: ", socket.id);
    ioSocket = socket;
  });
}