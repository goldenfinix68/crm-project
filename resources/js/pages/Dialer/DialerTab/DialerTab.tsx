import { CloseOutlined, PhoneOutlined } from "@ant-design/icons";
import {
    AutoComplete,
    Button,
    Form,
    Input,
    Select,
    Space,
    Typography,
} from "antd";
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
import { TContact, TUser } from "../../../entities";
import { useParams } from "react-router-dom";
import { useGetContact } from "../../../api/query/contactsQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import DialerKeyPad from "./DialerKeyPad";
interface DialerData {
    callerNumber: string | undefined;
    destinationNumber: string | undefined;
}

interface CallNotificationData {
    type: string | undefined;
    call: ICall | undefined;
    direction: string | undefined;
}

const DialerTab = ({
    user,
    contacts,
}: {
    user: TUser;
    contacts?: Array<TContact>;
}) => {
    const { contactId } = useParams();
    const { contact, isLoading } = useGetContact(contactId ?? "");
    const [form] = Form.useForm();
    const destinationNumber = Form.useWatch("destinationNumber", form);
    console.log(destinationNumber);
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

    const handleCall = (value) => {
        client?.newCall({
            callerNumber: `${value.callerNumber
                ?.replace(/ /g, "")
                .replace(/-/g, "")}`,
            destinationNumber: `${value.destinationNumber
                ?.replace(/ /g, "")
                .replace(/-/g, "")}`,
        });
    };

    const handleKeyPressed = (e) => {
        const currentValue = form.getFieldValue("destinationNumber");
        form.setFieldValue("destinationNumber", `${currentValue ?? ""}${e}`);
        console.log(`${currentValue}${e}`);
    };
    // type callUpdate
    // call -> state trying
    // state early
    // state destroy

    // call -> direction outbound
    // call -> direction inbound

    const filteredOptions = contacts?.filter((contact) =>
        contact?.mobile?.includes(
            destinationNumber ? destinationNumber.replace(/[-\s+_]/g, "") : ""
        )
    );

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <Form
            form={form}
            initialValues={{
                callerNumber: user.numbers?.length ? user.numbers[0] : "",
                destinationNumber: contact ? contact.mobile : "",
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={handleCall}
        >
            <Phone />
            <Space
                style={{ padding: "0px 20px", width: "100%" }}
                className="dialerTab"
                direction="vertical"
            >
                <Form.Item
                    name="callerNumber"
                    label="From"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Select style={{ width: "100%" }}>
                        {user.numbers?.map((number, index) => (
                            <Select.Option value={number} key={index}>
                                {number}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="destinationNumber"
                    label="To"
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <AutoComplete
                        options={filteredOptions?.map((option) => ({
                            value: option.mobile,
                            label: (
                                <Space direction="vertical">
                                    <Typography.Text strong>
                                        {`${option.firstName} ${option.lastName}`}
                                    </Typography.Text>
                                    <Typography.Text>
                                        {option.mobile}
                                    </Typography.Text>
                                </Space>
                            ),
                        }))}
                        style={{ width: "100%" }}
                        value={destinationNumber}
                    >
                        <Input
                            // mask="+1 000-000-0000"
                            value={destinationNumber}
                        />
                    </AutoComplete>
                </Form.Item>

                <DialerKeyPad handleKeyPressed={handleKeyPressed} />
                <Button
                    style={{ width: "100%" }}
                    className="dialerTabCallIcon"
                    type="primary"
                    htmlType="submit"
                >
                    Call <PhoneOutlined />
                </Button>
            </Space>
        </Form>
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
