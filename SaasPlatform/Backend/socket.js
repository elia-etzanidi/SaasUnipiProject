const { Server } = require('socket.io');

let io;
let onlineUsers = [];

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Vite/React frontend URL
            methods: ["GET", "POST", "PUT"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Connect user to socket
        socket.on('addUser', (userId) => {
            if (!onlineUsers.some(u => u.userId === userId)) {
                onlineUsers.push({ userId, socketId: socket.id });
            }
            console.log('Online Users:', onlineUsers);
        });

        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
        });
    });

    return io;
};

const getIO = () => io;
const getOnlineUsers = () => onlineUsers;

module.exports = { initSocket, getIO, getOnlineUsers };