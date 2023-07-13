import React, { useEffect } from "react";
import "./Dialer.css";
import $ from "jquery";
import { socketio } from "../../providers/socketio";
import { Button } from "antd";
const Dialer = () => {
    useEffect(() => {
        socketio.on("message", (message) => {
            console.log(message);
        });
        socketio.emit("123123");

        return () => {};
    }, []);

    const handleCall = () => {};

    return (
        <div className="container">
            <Button onClick={(e) => handleCall()}>Call</Button>
        </div>
    );
};

export default Dialer;
