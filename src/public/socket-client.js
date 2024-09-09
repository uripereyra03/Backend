const socket = io();

// Enviar un mensaje al servidor
socket.emit('mensaje', 'Hola desde el cliente');

// Escuchar mensajes del servidor
socket.on('mensaje', (data) => {
  console.log(data);
});
