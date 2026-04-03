require('dotenv').config();

const { app, initializeCronJobs } = require('./app'); // express nodejs frame work all detail inside in this file
const connectDB = require('./config/db') // database connection file
const http = require('http');
const { Server } = require('socket.io')
const server = http.Server(app);


const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'capacitor://localhost',
    'http://localhost',
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log("⚡️ New User Connected:", socket.id)

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`user Joined chat: ${chatId}`);
    });

    socket.on("sendMessage", (messageData) => {
        const { chatId, content } = messageData;

        io.to(chatId).emit('received message', {
            chatId,
            content,
            senderId: messageData.senderId  // optional, if frontend sends it
        });

    });
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // ✅ 1. Connect DB FIRST
        await connectDB();

        // ✅ 2. Start server
        server.listen(port, async () => {
            console.log(`Server running ${port}`);

            // ✅ 3. Start cron AFTER DB is ready
            await initializeCronJobs();
        });

    } catch (error) {
        console.error("Startup error:", error);
    }
};

startServer();

server.setTimeout(15 * 60 * 1000);