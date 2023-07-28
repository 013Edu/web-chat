
import { io } from "./http"

interface RoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface Message {
    room: string;
    username: string;
    text: string;
    createdAt: Date;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", (socket => {

    socket.on("select_room", ((data, callBack) => {

        socket.join(data.room)

        const userInRoom = users.find(user => user.username === data.username && user.room === data.room);

        if (userInRoom) {
            userInRoom.socket_id = socket.id
        } else {
            users.push({
                username: data.username,
                room: data.room,
                socket_id: socket.id
            })
        }
        const messagesRoom = getMessagesRoom(data.room)
        callBack(messagesRoom)
    }))

    socket.on("message", (data) => {
        const message: Message = {
            room: data.room,
            text: data.message,
            username: data.username,
            createdAt: new Date()
        }

        messages.push(message);

        io.to(data.room).emit("message", message);
    })
}))

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room)
    return messagesRoom;
}