const socket = io();

const urlSearch = new URLSearchParams(window.location.search)

const username = urlSearch.get("username")
const room = urlSearch.get("select_room")

const usernameDiv = document.getElementById("username")

usernameDiv.innerHTML = ` Olá, ${username} - Você está na sala ${room}`

socket.emit("select_room", {
    username,
    room,
}, messages => {
    messages.forEach(message => {
        createMessage(message)
    })
})

document
    .querySelector(".message_input")
    .addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const message = event.target.value

            const data = {
                room,
                message,
                username
            }

            socket.emit("message", data)

            event.target.value = ""
        }
    })

socket.on("message", (data) => {
    createMessage(data)
})

function createMessage(data) {
    const messageDiv = document.getElementById("messages")

    messageDiv.innerHTML += `
    <div class="new_message">
        <label class="content" for="form-label">
            <strong> ${data.username}: <span> ${data.text}  </span></strong>
            <p class="date">${dayjs(data.createdAt).format("DD/MM HH:mm")}</p>
        </label>
    </div>
    `
}