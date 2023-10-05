import { PhoneOutlined } from "@ant-design/icons";
import {
    AutoComplete,
    Button,
    Form,
    Input,
    Select,
    Space,
    Typography,
} from "antd";
import React, { useEffect } from "react";
import { ICall } from "@telnyx/webrtc";
import { useParams } from "react-router-dom";
import { useGetContact } from "../../../api/query/contactsQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import DialerKeyPad from "./DialerKeyPad";
import { useLoggedInUser } from "../../../api/query/userQuery";
import { useCallContext } from "../../../context/CallContext";
import { useAppContextProvider } from "../../../context/AppContext";

interface CallNotificationData {
    type: string | undefined;
    call: ICall | undefined;
    direction: string | undefined;
}

const DialerTab = ({
    handleFinish,
    isCallBtnLoading,
}: {
    handleFinish: () => void;
    isCallBtnLoading: boolean;
}) => {
    const { contactId } = useParams();
    const { user, isLoading: isLogginUserLoading } = useLoggedInUser();
    const { contacts, isContactsLoading } = useAppContextProvider();

    const [form] = Form.useForm();

    const {
        setCallerNumber,
        setDestinationNumber,
        callerNumber,
        destinationNumber,
    } = useCallContext();

    const handleCall = (value) => {
        const data = {
            callerNumber: `${value.callerNumber
                ?.replace(/ /g, "")
                .replace(/-/g, "")}`,
            destinationNumber: `${value.destinationNumber
                ?.replace(/ /g, "")
                .replace(/-/g, "")}`,
        };
        handleFinish();
    };

    const handleFormChange = (value: any, allValues: any) => {
        setCallerNumber(allValues.callerNumber);
        setDestinationNumber(allValues.destinationNumber);
    };

    const handleKeyPressed = (e) => {
        const currentValue = form.getFieldValue("destinationNumber");
        form.setFieldValue("destinationNumber", `${currentValue ?? ""}${e}`);
        console.log(`${currentValue}${e}`);
    };
    const filteredOptions = contacts?.filter((contact) =>
        contact?.mobile?.includes(
            destinationNumber ? destinationNumber.replace(/[-\s+_]/g, "") : ""
        )
    );
    useEffect(() => {
        form.setFieldsValue({
            callerNumber: callerNumber,
            destinationNumber: destinationNumber,
        });
    }, [callerNumber, destinationNumber]);

    if (isContactsLoading || isLogginUserLoading) {
        return <LoadingComponent />;
    }

    return (
        <Form
            form={form}
            // initialValues={{
            //     callerNumber: user.numbers?.length ? user.numbers[0] : "",
            //     destinationNumber: contact ? contact.mobile : "",
            // }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={handleCall}
            onValuesChange={handleFormChange}
        >
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
                    <Select style={{ width: "100%" }} value={callerNumber}>
                        {user?.numbers?.map((number) => (
                            <Select.Option
                                value={number.mobileNumber}
                                key={number.id}
                            >
                                {number.mobileNumber}
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
                                <Space>
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

                <Space
                    style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "16px",
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isCallBtnLoading}
                    >
                        Call <PhoneOutlined />
                    </Button>
                </Space>

                {/* {call && call.state !== "destroy" ? (
                    <Button
                        style={{ width: "100%", backgroundColor: "red" }}
                        className="dialerTabCallIcon"
                        type="primary"
                        onClick={() => call.hangup()}
                    >
                        Hangup <PhoneOutlined />
                    </Button>
                ) : (
                    <Button
                        style={{ width: "100%" }}
                        className="dialerTabCallIcon"
                        type="primary"
                        htmlType="submit"
                    >
                        Call <PhoneOutlined />
                    </Button>
                )} */}
            </Space>
        </Form>
    );
};

export default DialerTab;
