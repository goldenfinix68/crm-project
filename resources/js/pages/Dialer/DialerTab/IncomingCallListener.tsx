import { Button, Modal, Space, Tabs, TabsProps } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Audio } from "@telnyx/react-client";
import DialerTab from "./DialerTab";
import { useCallContext } from "../../../context/CallContext";
import RecentTab from "./RecentTab";

const IncomingCallListener = () => {
    const [telnyxClient, setTelnyxClient] = useState<any>(null);
    const [currentCall, setCurrentCall] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isOnHold, setIsOnHold] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const [callFrom, setCallFrom] = useState("");

    const { isModalOpen, setIsModalOpen, callerNumber, destinationNumber } =
        useCallContext();

    const handleNotification = (notification) => {
        // console.log(notification);
        switch (notification.type) {
            case "callUpdate":
                handleCallUpdate(notification.call);
                break;
            case "userMediaError":
                console.log(
                    "Permission denied or invalid audio/video params on `getUserMedia`"
                );
                break;
        }
    };
    const handleCallUpdate = (call) => {
        switch (call.state) {
            case "new": // Setup the UI
                console.log("New");
                break;
            case "trying": // You are trying to call someone and he's ringing now
                console.log("Trying");
                setCurrentCall(call);
                setIsModalOpen(true);
                setIsloading(false);
                setIsRinging(true);
                setCallFrom("outgoing");
                break;
            case "recovering": // Call is recovering from a previous session
                // Handle recovering logic...
                break;
            case "ringing": // Someone is calling you
                // Used to avoid alert blocking audio play, delay audio play first.
                setCurrentCall(call);
                setIsModalOpen(true);
                setIsloading(false);
                setIsRinging(true);
                setCallFrom("incoming");
                break;
            case "active": // Call has become active
                console.log("Call has become active");
                setCurrentCall(call);
                setIsRinging(false);
                setCallFrom("");
                break;
            case "hangup": // Call is over
                console.log("Call is over");
                clearFields();
                break;
            case "destroy": // Call has been destroyed
                clearFields();
                console.log("Call has been destroyed");
                break;
        }
    };
    const clearFields = () => {
        setCurrentCall(null);
        setIsModalOpen(false);
        setIsloading(false);
        setIsRinging(false);
        setCallFrom("");
    };

    const toggleMute = () => {
        if (currentCall) {
            if (isMuted) {
                currentCall.unmuteMicrophone();
            } else {
                currentCall.muteMicrophone();
            }
            setIsMuted(!isMuted);
        }
    };

    const toggleHold = () => {
        if (currentCall) {
            if (isOnHold) {
                currentCall.resume();
            } else {
                currentCall.hold();
            }
            setIsOnHold(!isOnHold);
        }
    };
    const makeCall = () => {
        const params = {
            callerNumber: callerNumber,
            destinationNumber: destinationNumber, // required!
            audio: true,
        };
        setIsloading(true);
        telnyxClient?.newCall(params);
    };
    useEffect(() => {
        // Load the Telnyx WebRTC SDK script
        const telnyxScript = document.createElement("script");
        telnyxScript.src = "https://unpkg.com/@telnyx/webrtc";
        telnyxScript.type = "text/javascript";
        document.body.appendChild(telnyxScript);

        telnyxScript.onload = () => {
            // Initialize Telnyx
            const TelnyxWebRTC = (window as any).TelnyxWebRTC;
            const client = new TelnyxWebRTC.TelnyxRTC({
                env: "production",
                login: (window as any).TELNYX_USERNAME,
                password: (window as any).TELNYX_PASSWORD,
                // ringtoneFile: "/sounds/incoming_call.mp3",
                // iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
                // ringbackFile: "/sounds/calling_ringing.mp3",
            });
            client.enableMicrophone();

            client.on("telnyx.ready", function () {
                console.log("connected");
            });

            // Update UI on socket close
            client.on("telnyx.socket.close", function () {
                console.log("closed");
                client.disconnect();
            });

            // Handle error...
            client.on("telnyx.error", function (error) {
                console.error("telnyx error:", error);
                client.disconnect();
            });
            client.on("telnyx.notification", handleNotification);

            client.connect();

            setTelnyxClient(client);
        };

        return () => {
            // Cleanup: remove script when the component unmounts
            document.body.removeChild(telnyxScript);
        };
    }, []);

    const modalTitle = () => {
        if (currentCall?.state == "ringing?") {
            return `Incoming Call`;
        } else if (currentCall?.state == "active") {
            return `Active Call`;
        } else {
            return "Make a Call";
        }
    };

    const dialerTabs: TabsProps["items"] = [
        {
            key: "1",
            label: <b>DIALER</b>,
            children: (
                <DialerTab
                    handleFinish={() => makeCall()}
                    isCallBtnLoading={isLoading}
                />
            ),
        },
        {
            key: "3",
            label: <b>RECENT</b>,
            children: <RecentTab />,
        },
    ];
    return (
        <>
            <Audio stream={currentCall && currentCall.remoteStream} />
            {isRinging && callFrom && (
                <audio autoPlay>
                    <source
                        src={
                            callFrom == "outgoing"
                                ? "/sounds/calling_ringing.mp3"
                                : "/sounds/incoming_call.mp3"
                        }
                        type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                </audio>
            )}
            <Modal
                open={isModalOpen}
                footer={null}
                onCancel={() => {
                    setIsModalOpen(false);
                }}
                // onOk={() => {
                //     currentCall.answer();
                // }}
                // okText="Answer"
                // cancelText="Reject"
            >
                {currentCall?.state == "ringing" ? (
                    <>
                        <p>
                            {`Pick up the call from ${currentCall?.options?.remoteCallerName}?`}
                        </p>
                        <Space
                            style={{
                                position: "absolute",
                                bottom: "16px",
                                right: "16px",
                            }}
                        >
                            <Button
                                type="default"
                                onClick={() => {
                                    currentCall.hangup();
                                    clearFields();
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    currentCall.answer();
                                }}
                            >
                                Answer
                            </Button>
                        </Space>
                    </>
                ) : currentCall?.state == "active" ? (
                    <Space direction="vertical">
                        <p>
                            {`Active call with ${currentCall?.options?.remoteCallerName}?`}
                        </p>
                        <Space
                            style={{
                                position: "absolute",
                                bottom: "16px",
                                right: "16px",
                            }}
                        >
                            <Button type="default" onClick={toggleMute}>
                                {isMuted ? "Unmute" : "Mute"}
                            </Button>
                            <Button
                                type="default"
                                onClick={() => {
                                    currentCall.hangup();
                                    clearFields();
                                }}
                            >
                                Hang Up
                            </Button>
                            <Button type="default" onClick={toggleHold}>
                                {isOnHold ? "Resume Call" : "Hold Call"}
                            </Button>
                        </Space>
                    </Space>
                ) : currentCall?.state == "trying" ? (
                    <Space direction="vertical">
                        <p>
                            {`Calling ${currentCall?.options?.remoteCallerName}?`}
                        </p>
                        <Space
                            style={{
                                position: "absolute",
                                bottom: "16px",
                                right: "16px",
                            }}
                        >
                            <Button
                                type="default"
                                onClick={() => {
                                    currentCall.hangup();
                                    clearFields();
                                }}
                            >
                                Hang Up
                            </Button>
                        </Space>
                    </Space>
                ) : (
                    <>
                        <Tabs
                            className="dialerComponent"
                            defaultActiveKey="1"
                            items={dialerTabs}
                        />
                    </>
                )}
            </Modal>
        </>
    );
};

export default IncomingCallListener;
