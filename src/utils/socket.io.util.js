import { Server } from 'socket.io';
import controllers from '../controllers';

const { mensajes } = controllers;

const io = new Server();
const chat = io.of('/chat');

chat.on('connection', (socket) => {
  socket.on('mensaje_usuario', (data) => {
    const { email, mensaje } = data;
    mensajes.guardar({
      email,
      tipo: 'usuario',
      mensaje,
    });
    chat.emit('mensaje_usuario', data);
  });

  socket.on('mensaje_sistema', (data) => {
    const { email, mensaje } = data;
    mensajes.guardar({
      email,
      tipo: 'sistema',
      mensaje,
    });
    chat.emit('mensaje_sistema', data);
  });
});

export default io;