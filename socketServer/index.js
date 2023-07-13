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
        "/home/speedlead/ssl/keys/b7c2d_303a5_692274b99764598589137252b9489dcb.key"
    );
    var cert = fs.readFileSync(
        "/home/speedlead/ssl/certs/speedlead_click_b7c2d_303a5_1720289275_2858492ae59161565d3c8f5ffed9f0fe.crt"
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
