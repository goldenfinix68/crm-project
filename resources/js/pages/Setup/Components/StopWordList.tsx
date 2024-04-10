import React, { useEffect } from "react";
import {
    Button,
    Typography,
    Card,
    Divider,
    Row,
    message,
    Space,
    Select,
    Form,
    Col,
    Input,
} from "antd";
import { useMutation } from "react-query";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import queryClient from "../../../queryClient";
import { useAppContextProvider } from "../../../context/AppContext";
import { userSettings } from "../../../api/mutation/useUserMutation";
import { useCustomFields } from "../../../api/query/customFieldQuery";

const StopWordList: React.FC = () => {
    useEffect(() => {
        document.title = "Stop Word List - SpeedLead";
        return () => {};
    }, []);
    const [form] = Form.useForm();
    const { loggedInUser } = useAppContextProvider();

    const settings =
        loggedInUser?.role == "mainUser"
            ? loggedInUser.settings
            : loggedInUser?.main_user?.settings;

    const save = useMutation(userSettings, {
        onSuccess: () => {
            queryClient.invalidateQueries("user");
            message.success("Successfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });
    const onFinish = async (values: any) => {
        await save.mutate({
            ...settings,
            stopWordList: values.stopWordList,
        });
    };

    useEffect(() => {
        if (settings?.roorMapping) {
            form.setFieldsValue({ stopWordList: settings.stopWordList });
        }
    }, [settings]);

    return (
        <Card className="w-100">
            <Typography.Title level={3}>Stop Word List</Typography.Title>
            <Typography className="m-b-sm">
                Our message filtering system includes a "Stop Word List" feature
                that automatically suppresses messages containing specific
                words. Admins can customize this list to maintain a conducive
                communication environment tailored to their community's needs.
                This intuitive tool ensures discussions stay focused and
                respectful, enhancing overall communication quality.
            </Typography>
            <Divider />
            <Form
                name="basic"
                layout="vertical"
                labelWrap
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >
                <Form.Item name="stopWordList">
                    <Input.TextArea rows={5} placeholder={"Stop\nSpam"} />
                </Form.Item>

                <Space style={{ paddingTop: "5px" }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={save.isLoading}
                    >
                        Save
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};
export default StopWordList;
