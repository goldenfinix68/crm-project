import { PhoneOutlined } from "@ant-design/icons";
import {
    AutoComplete,
    Button,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Space,
    Typography,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ICall } from "@telnyx/webrtc";
import { useParams } from "react-router-dom";
import { useGetContact } from "../../../api/query/contactsQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import DialerKeyPad from "./DialerKeyPad";
import { useLoggedInUser } from "../../../api/query/userQuery";
import { useCallContext } from "../../../context/CallContext";
import { useAppContextProvider } from "../../../context/AppContext";
import { mutateGet, mutatePost } from "../../../api/mutation/useSetupMutation";
import _ from "lodash";
import InputMobile from "../../../components/InputMobile";
import { useMutation } from "react-query";

interface CallNotificationData {
    type: string | undefined;
    call: ICall | undefined;
    direction: string | undefined;
}

const DialerTab = () => {
    const [form] = Form.useForm();
    const { user, isLoading: isLogginUserLoading } = useLoggedInUser();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [keyword, setKeyword] = useState<string>("");
    const [contacts, setContacts] = useState<any>();

    const {
        setCallerNumber,
        setDestinationNumber,
        setAgentNumber,
        agentNumber,
        callerNumber,
        destinationNumber,
    } = useCallContext();

    const { data: filteredContacts, refetch: refetchFilteredContacts } =
        mutateGet(
            { keyword },
            "/api/contacts/search-by-number",
            "contact-search-by-number",
            () => {
                setIsSearchLoading(false);
            }
        );

    const inititateCall = useMutation(mutatePost, {
        onSuccess: (res) => {
            message.success("Call Initiated");
        },
    });

    const debouncedSearch = _.debounce((e) => {
        handleSearch(e);
    }, 300);

    const handleSearch = (value) => {
        setKeyword(value);
    };

    useEffect(() => {
        setIsSearchLoading(true);
        refetchFilteredContacts();
    }, [keyword]);

    useEffect(() => {
        if (filteredContacts && filteredContacts.data) {
            setContacts(filteredContacts.data);
            console.log(filteredContacts.data);
        }
    }, [filteredContacts]);

    const handleCall = (values) => {
        console.log(values);
        inititateCall.mutate({
            url: "/api/calls/initiate-roor-call",
            data: values,
        });
    };

    // const handleFormChange = (value: any, allValues: any) => {
    //     setCallerNumber(allValues.callerNumber);
    //     setDestinationNumber(allValues.destinationNumber);
    //     setAgentNumber(allValues.agentNumber);
    // };

    const mobileFormatter = (value) => {
        // Implement mobile formatting logic here
        // For example, format as (XXX) XXX-XXXX
        return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    };

    // Parser function to remove non-numeric characters
    const mobileParser = (value) => value.replace(/\D/g, "");

    useEffect(() => {
        form.setFieldsValue({
            callerNumber: callerNumber,
            destinationNumber: destinationNumber,
            agentNumber: agentNumber,
        });
    }, [callerNumber, destinationNumber, agentNumber]);

    return (
        <Form
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={handleCall}
            // onValuesChange={handleFormChange}
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
                    {user?.mobileNumbers?.map((number) => (
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
                name="agentNumber"
                label="Agent number"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <InputNumber
                    className="w-100"
                    formatter={mobileFormatter}
                    parser={mobileParser}
                />
            </Form.Item>
            <Form.Item
                name="destinationNumber"
                label="Contact"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Select
                    style={{ width: "100%" }}
                    showSearch
                    onSearch={debouncedSearch}
                    loading={isSearchLoading}
                    optionFilterProp="children"
                >
                    {contacts?.map((contact) =>
                        contact?.phoneNumbers?.map((number, index) => (
                            <Select.Option value={number} key={index}>
                                {`${number.replace(
                                    /^(\d{3})(\d{3})(\d{4})$/,
                                    "($1) $2-$3"
                                )} (${contact.fields?.firstName} ${
                                    contact.fields?.lastName
                                })`}
                            </Select.Option>
                        ))
                    )}
                </Select>
            </Form.Item>

            {/* <Form.Item
                name="destinationNumber"
                label="Phone Number"
                rules={[
                    {
                        required: true,
                        message: DEFAULT_REQUIRED_MESSAGE,
                    },
                ]}
            >
                <Select style={{ width: "100%" }} showSearch>
                    {phoneNumbers?.map((value, index) => (
                        <Select.Option
                            value={value.replace(
                                /^(\d{3})(\d{3})(\d{4})$/,
                                "($1) $2-$3"
                            )}
                            key={index}
                        >
                            {value.replace(
                                /^(\d{3})(\d{3})(\d{4})$/,
                                "($1) $2-$3"
                            )}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item> */}

            {/* <DialerKeyPad handleKeyPressed={handleKeyPressed} /> */}

            <Popconfirm
                title="Call"
                description={`Are you sure you want to call this number?`}
                onConfirm={async () => {
                    form.validateFields().then((values) => {
                        form.submit();
                    });
                }}
            >
                <Button
                    type="primary"
                    // htmlType="submit"
                    loading={inititateCall.isLoading}
                    style={{ float: "right" }}
                >
                    Call <PhoneOutlined />
                </Button>
            </Popconfirm>
        </Form>
    );
};

export default DialerTab;
