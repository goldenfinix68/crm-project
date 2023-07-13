require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("file-system");

app.use(cors());

if (process.env.APP_ENV == "local") {
    const server = http.createServer(app);
    // console.log(process.env.APP_URL);
    const io = new Server(server, {
        // cors: {
        // 	origin: process.env.APP_URL,
        // 	methods: ["GET", "POST"],
        // },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            console.log("room", data);
            socket.join(data);
        });

        socket.on("send_message", (data) => {
            console.log(data.room);
            //socket.broadcast.emit("receive_message", data);
            socket.to(data.room).emit("receive_message", data);
        });

        socket.on("disconnect", (reason) => {
            console.log(reason);
        });
    });

    server.listen(4001, () => {
        console.log("SERVER IS RUNNING PORT: 4001");
    });
} else {
    // var privkey = fs.readFileSync(
    //     "/Users/joshuasaubon/.config/valet/Certificates/crm-jesse.test.key"
    // );
    // var cert = fs.readFileSync(
    //     "/Users/joshuasaubon/.config/valet/Certificates/crm-jesse.test.crt"
    // );
    var privkey = fs.readFileSync(
        "/home/speedlead/ssl/keys/c2ce6_3801f_1523fb6681fb2427cacd32511fe96f88.key"
    );
    var cert = fs.readFileSync(
        "/home/speedlead/ssl/certs/speedlead_click_c2ce6_3801f_1696839859_1f43da0a6b4dcd97380497b6486fbb76.crt"
    );
    const server = https.createServer(
        {
            key: privkey,
            cert: cert,
            // ca: ca,
        },
        app
    );
    const io = new Server(server, {
        cors: {
            origin: "*",
            // methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            console.log("room", data);
            socket.join(data);
        });

        socket.onAny((data) => {
            console.log("onAny", data);
            // socket.broadcast.emit("receive_message", data);
            // socket.to(data.room).emit("receive_message", data);
        });
    });

    server.listen(4001, () => {
        console.log("SERVER IS RUNNING : HTTPS 4001");
    });

    server
        .on("clientError", (err, socket) => {
            console.log("clientError", err);
        })
        .on("error", (err) => {
            console.log("serverError", err);
        });
}
