import io from "socket.io-client";
export const socketio = io.connect(
    `${window.location.origin}:${
        window.location.protocol === "https:" ? "4001" : "4001"
    }`
);
