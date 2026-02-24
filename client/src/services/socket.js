import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_SOCKET_API

export const socket = io(URL, {
    withCredentials: true,
    autoConnect: false
});

//  connect manually after login

export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();

        socket.on("connect", () => {
            console.log("Frontend connected", socket.id)
        })
        socket.emit("setup", userId);

        socket.on('connected', () => {
            console.log('server confirmed connection')
        })
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
}