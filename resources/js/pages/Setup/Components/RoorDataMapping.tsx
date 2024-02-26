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
} from "antd";
import { useMutation } from "react-query";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import queryClient from "../../../queryClient";
import { useAppContextProvider } from "../../../context/AppContext";
import { userSettings } from "../../../api/mutation/useUserMutation";

const RoorDataMapping: React.FC = () => {
    const [form] = Form.useForm();
    const { contactFields, loggedInUser } = useAppContextProvider();

    const settings =
        loggedInUser?.role == "mainUser"
            ? loggedInUser.settings
            : loggedInUser?.main_user?.settings;

    const save = useMutation(userSettings, {
        onSuccess: () => {
            queryClient.invalidateQueries("contacts");
            queryClient.invalidateQueries("filteredContacts");
            message.success("Crawl is queued.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });
    const onFinish = async (values: any) => {
        await save.mutate({
            ...settings,
            roorMapping: values,
        });
    };

    useEffect(() => {
        if (settings?.roorMapping) {
            form.setFieldsValue(settings.roorMapping);
        }
    }, [settings]);

    const ContactFieldSelect = ({
        label,
        name,
        rules,
    }: {
        label: string;
        name: string;
        rules?: any[];
    }) => (
        <Col span={12}>
            <Form.Item label={label} name={name} rules={rules ?? undefined}>
                <Select showSearch className="w-100" allowClear>
                    {contactFields?.map((field, index) => (
                        <Select.Option value={field.fieldName} key={index}>
                            {field.label}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    );
    return (
        <Space direction="vertical">
            <Card>
                <Typography.Title level={3}>Roor data mapping</Typography.Title>
                <Typography className="m-b-sm">
                    Now, you can sync contacts to your Roor's autoresponder
                    list. Please map the data from Speelead to Roor's fields.
                </Typography>
                <Button
                    type="link"
                    className="p-0"
                    onClick={() => console.log(true)}
                >
                    Learn more about how to import contacts into Roor.
                </Button>
                <Divider />
                <Form
                    name="basic"
                    layout="vertical"
                    labelWrap
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Row gutter={24}>
                        <ContactFieldSelect
                            label="First Name"
                            name="first_name"
                        />
                        <ContactFieldSelect
                            label="Last Name"
                            name="last_name"
                        />
                        <ContactFieldSelect
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: DEFAULT_REQUIRED_MESSAGE,
                                },
                            ]}
                        />
                        <ContactFieldSelect label="Phone2" name="phone2" />
                        <ContactFieldSelect label="Phone3" name="phone3" />
                        <ContactFieldSelect label="Phone4" name="phone4" />
                        <ContactFieldSelect label="Address" name="address" />
                        <ContactFieldSelect label="Address2" name="address2" />
                        <ContactFieldSelect label="City" name="city" />
                        <ContactFieldSelect label="State" name="state" />
                        <ContactFieldSelect label="Notes" name="notes" />
                        <ContactFieldSelect label="Email" name="email" />
                    </Row>

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
        </Space>
    );
};
export default RoorDataMapping;
