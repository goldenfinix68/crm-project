import React, { useContext, useEffect } from "react";
import "./Dialer.css";
import $ from "jquery";
import { socketio } from "../../providers/socketio";
import { Button } from "antd";
import { TelnyxRTCProvider, TelnyxRTCContext } from "@telnyx/react-client";
import {
    useNotification,
    Audio,
    useCallbacks,
    useTelnyxRTC,
} from "@telnyx/react-client";

const Dialer = () => {
    const credential = {
        login_token:
            "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0ZWxueXhfdGVsZXBob255IiwiZXhwIjoxNjg5MzQ4NzQ4LCJpYXQiOjE2ODkyNjIzNDgsImlzcyI6InRlbG55eF90ZWxlcGhvbnkiLCJqdGkiOiI0M2JjM2MyMi02NjI1LTQxNzgtOGI4NS0xZWVjZGJmYzE2OTIiLCJuYmYiOjE2ODkyNjIzNDcsInN1YiI6ImZkOGM5MjdiLWY2OTYtNDM2MS04MmRlLTVkZDg3NTI2ZTNiYSIsInRlbF90b2tlbiI6IlQ5RTNCYnQ4UTlqWTl5OE1td1Z0cHV1UDEzSFJwVXhVS3g2dDVNUXJwUlV0UlJCVkRRdE1MR1pfMWxNYzdvLUV6WlladFY0bS1lNFcxV1N0ck8wRjBKVkMxempxdU1QdW96T19UTkRHdVRQU1FTUUxiMjJjYXNfVWY3clhpVWRFbkl5bDk1UHd0el9VV25YY0VkdDRZZTNZIiwidHlwIjoiYWNjZXNzIn0.d_sQRBR6Xefnc6LdLpp3UcxIrHWCG4vRUIgaANDfRWExVRNnl29K0aDb3AtVBsePpRBdkBWPVxklQlsdKh-iFw",
    };

    return (
        <TelnyxRTCProvider credential={credential}>
            <Phone />
        </TelnyxRTCProvider>
    );
};

export default Dialer;

function Phone() {
    const notification = useNotification();
    const activeCall = notification && notification.call;

    const client = useContext(TelnyxRTCContext);

    client?.on("telnyx.ready", () => {
        // console.log("client ready");
        // client?.newCall({
        //     destinationNumber: "+1702-472-0013",
        //     callerNumber: "+16062221172",
        // });
    });
    useCallbacks({
        onReady: () => console.log("client ready"),
        onError: () => console.log("client registration error"),
        onSocketError: () => console.log("client socket error"),
        onSocketClose: () => console.log("client disconnected"),
        onNotification: (x) => console.log("received notification:", x),
    });

    return (
        <div>
            {activeCall &&
                activeCall.state === "ringing" &&
                "You have an incoming call."}

            <Audio stream={activeCall && activeCall.remoteStream} />
        </div>
    );
}
