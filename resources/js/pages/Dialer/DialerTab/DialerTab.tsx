import { CloseOutlined, PhoneOutlined } from "@ant-design/icons";
import { Button, Col, Input, InputNumber, Row, Select } from "antd";
import { MaskedInput } from "antd-mask-input";
import React, { useContext, useEffect, useState } from "react";
import {
    useNotification,
    Audio,
    useCallbacks,
    useTelnyxRTC,
} from "@telnyx/react-client";
import { TelnyxRTCProvider, TelnyxRTCContext } from "@telnyx/react-client";
import { ICall, INotification } from "@telnyx/webrtc";
interface DialerData {
    callerNumber: string | undefined;
    destinationNumber: string | undefined;
}

interface CallNotificationData {
    type: string | undefined;
    call: ICall | undefined;
    direction: string | undefined;
}

const DialerTab = () => {
    const [dialerData, setDialerData] = useState<DialerData>({
        callerNumber: "+16062221172",
        destinationNumber: "",
    });

    const [callNotification, setCallNotification] =
        useState<CallNotificationData>();

    useEffect(() => {
        console.log(callNotification);

        return () => {};
    }, [callNotification]);

    const client = useContext(TelnyxRTCContext);

    // client?.on("telnyx.ready", () => {
    //     // console.log("client ready");
    // });
    useCallbacks({
        onReady: () => console.log("client ready"),
        onError: () => console.log("client registration error"),
        onSocketError: () => console.log("client socket error"),
        onSocketClose: () => console.log("client disconnected"),
        onNotification: (x) => {
            setCallNotification({
                type: x.type,
                call: x.call,
                direction: x.displayDirection,
            });
            console.log("received notification:", x);
        },
    });

    const handleCall = () => {
        client?.newCall({
            callerNumber: "+16062221172",
            destinationNumber: `${dialerData.destinationNumber
                ?.replace(/ /g, "")
                .replace(/-/g, "")}`,
        });
    };
    // type callUpdate
    // call -> state trying
    // state early
    // state destroy

    // call -> direction outbound
    // call -> direction inbound

    return (
        <>
            <Phone />
            <div style={{ padding: "0px 20px" }} className="dialerTab">
                <div>
                    <span style={{ color: "red" }}>*</span>From
                    <Select
                        style={{ width: "100%" }}
                        value={dialerData.callerNumber}
                    >
                        <Select.Option value="+1 606-222-1172">
                            +1 606-222-1172
                        </Select.Option>
                    </Select>
                </div>
                <div style={{ marginTop: 15 }}>
                    <span style={{ color: "red" }}>*</span>To
                    {/* <InputNumber
                    style={{ width: "100%" }}
                    // prefix="+1"
                    value={dialerData.to}
                    onChange={(e) => setDialerData({ ...dialerData, to: e })}
                /> */}
                    <MaskedInput
                        mask="+1 000-000-0000"
                        value={dialerData.destinationNumber}
                        onChange={(e) =>
                            setDialerData({
                                ...dialerData,
                                destinationNumber: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <div
                        style={{
                            textAlign: "center",
                            padding: 30,
                            width: 300,
                            margin: "auto",
                        }}
                    >
                        <div className="dialerNumberContainer">
                            <div
                                className="dialerNumberContent"
                                style={{ paddingTop: 15 }}
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}1`,
                                    })
                                }
                            >
                                <span className="dialerNumber">1</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}2`,
                                    })
                                }
                            >
                                <span className="dialerNumber">2</span>
                                <span className="dialerNumberChars">A B C</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}3`,
                                    })
                                }
                            >
                                <span className="dialerNumber">3</span>
                                <span className="dialerNumberChars">D E F</span>
                            </div>
                            <div className="break"></div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}4`,
                                    })
                                }
                            >
                                <span className="dialerNumber">4</span>
                                <span className="dialerNumberChars">G H I</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}5`,
                                    })
                                }
                            >
                                <span className="dialerNumber">5</span>
                                <span className="dialerNumberChars">J K L</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}6`,
                                    })
                                }
                            >
                                <span className="dialerNumber">6</span>
                                <span className="dialerNumberChars">M N O</span>
                            </div>
                            <div className="break"></div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}7`,
                                    })
                                }
                            >
                                <span className="dialerNumber">7</span>
                                <span className="dialerNumberChars">
                                    P Q R S
                                </span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}8`,
                                    })
                                }
                            >
                                <span className="dialerNumber">8</span>
                                <span className="dialerNumberChars">T U V</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}9`,
                                    })
                                }
                            >
                                <span className="dialerNumber">9</span>
                                <span className="dialerNumberChars">
                                    W X Y Z
                                </span>
                            </div>
                            <div className="break"></div>
                            <div
                                className="dialerNumberContent"
                                style={{ paddingTop: 15 }}
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}*`,
                                    })
                                }
                            >
                                <span className="dialerNumber">*</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}0`,
                                    })
                                }
                            >
                                <span className="dialerNumber">0</span>
                                <span className="dialerNumberChars">+</span>
                            </div>
                            <div
                                className="dialerNumberContent"
                                style={{ paddingTop: 15 }}
                                onClick={(e) =>
                                    setDialerData({
                                        ...dialerData,
                                        destinationNumber: `${dialerData.destinationNumber}#`,
                                    })
                                }
                            >
                                <span className="dialerNumber">#</span>
                            </div>
                        </div>

                        <div style={{ paddingTop: 30 }}>
                            <Button
                                style={{ width: "100%" }}
                                className="dialerTabCallIcon"
                                type="primary"
                                onClick={(e) => handleCall()}
                            >
                                Call <PhoneOutlined />
                            </Button>
                            {callNotification &&
                                callNotification.type == "callUpdate" &&
                                callNotification?.clientState == "early" && (
                                    <Button
                                        style={{ width: "100%" }}
                                        className="dialerTabCallIcon"
                                        type="primary"
                                        onClick={(e) => handleCall()}
                                        danger
                                    >
                                        End Call <CloseOutlined />
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DialerTab;

function Phone() {
    const notification = useNotification();
    const activeCall = notification && notification.call;

    return (
        <div>
            {activeCall &&
                activeCall.state === "ringing" &&
                "You have an incoming call."}

            <Audio stream={activeCall && activeCall.remoteStream} />
        </div>
    );
}
