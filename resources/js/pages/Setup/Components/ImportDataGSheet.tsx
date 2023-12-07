import React, { useState } from "react";
import {
    Button,
    Typography,
    Card,
    Divider,
    Row,
    Upload,
    message,
    List,
    Table,
    Space,
    Popover,
    Input,
    Modal,
    Select,
    Alert,
    Steps,
    Form,
    Checkbox,
    Menu,
} from "antd";
import {
    CaretDownOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    HistoryOutlined,
    LoadingOutlined,
    UploadOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";
import AddAttributePopoverContent from "../../TextTemplates/components/AddAttributePopoverContent";
import { useArray } from "../../../helpers";
import { useMutation } from "react-query";
import {
    bulkImportGSheet,
    useContactBulkImportCsv,
} from "../../../api/mutation/useContactMutation";
import { useNavigate } from "react-router-dom";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import form from "antd/es/form";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { createFilterMutation } from "../../../api/mutation/useFilterMutation";
import queryClient from "../../../queryClient";
import validateRules from "../../../providers/validateRules";
import CustomLink from "../../../components/CustomLink";

const ImportDataGSheet: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isAddToQueue = Form.useWatch("isAddToQueue", form);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);

    const save = useMutation(bulkImportGSheet, {
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
            ...values,
        });
    };
    return (
        <Space direction="vertical">
            <Card>
                <Typography.Title level={3}>
                    Import from Google Sheet
                </Typography.Title>
                <Typography className="m-b-sm">
                    Now, you have the capability to effortlessly import contacts
                    directly from a Google Sheet. Additionally, you have the
                    flexibility to set the frequency at which our system crawls
                    the spreadsheet, ensuring seamless updates to your account
                    by identifying and adding any new contacts as needed.
                </Typography>
                <Button
                    type="link"
                    className="p-0"
                    onClick={() => setIsInstructionModalOpen(true)}
                >
                    Learn more about how to import using an google sheet.
                </Button>
                <Divider />
                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Typography.Title level={5}>
                        Need help in getting started?
                    </Typography.Title>
                </Row>
                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Typography.Link
                        href="https://docs.google.com/spreadsheets/d/1OOt8l719ev8VilpodHSaEvrKdXjt-edU0uDWT_hUFYw/edit?usp=sharing"
                        target="_blank"
                    >
                        View sample spreadsheet
                    </Typography.Link>
                    <Typography className="m-r-sm m-l-sm">|</Typography>
                    <Typography.Link href="" target="_blank">
                        View import FAQs
                    </Typography.Link>
                </Row>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    form={form}
                    className="p-t-lg"
                >
                    <Form.Item
                        name="gSheedId"
                        label="Google Sheet ID"
                        rules={[
                            {
                                required: true,
                                message: DEFAULT_REQUIRED_MESSAGE,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {isAddToQueue && (
                        <Form.Item
                            name={"interval"}
                            label="Crawl interval"
                            rules={[validateRules.required]}
                            initialValue={"5"}
                        >
                            <Select showSearch>
                                <Select.Option value="5">
                                    5 Minutes
                                </Select.Option>
                                <Select.Option value="10">
                                    10 Minutes
                                </Select.Option>
                                <Select.Option value="15">
                                    15 Minutes
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item name="isAddToQueue" valuePropName="checked">
                        <Checkbox>Add to queue</Checkbox>
                    </Form.Item>

                    <Space style={{ paddingTop: "5px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={save.isLoading}
                        >
                            {!isAddToQueue ? "Crawl" : "Crawl and Save"}
                        </Button>
                    </Space>
                </Form>
            </Card>

            <Modal
                className="modal-activity"
                open={isInstructionModalOpen}
                onCancel={() => {
                    setIsInstructionModalOpen(false);
                }}
                footer={null}
                title={null}
                closable={false}
                width={"500px"}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Instruction
                    </Typography.Title>

                    <Button
                        onClick={() => {
                            setIsInstructionModalOpen(false);
                        }}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <ol className="p-t-xl">
                    <li>
                        Duplicate the "Speedlead sample spreadsheet" sheet
                        {/* <ul>
                            <li>Child instruction 2.1</li>
                            <li>Child instruction 2.2</li>
                        </ul> */}
                    </li>
                    <li>
                        Verify that all required fields are present in the
                        Google Sheet headers.
                    </li>
                    <li>
                        Ensure that each required field has a corresponding
                        value. (If any row fails to satisfy all required fields,
                        the system will ignore it)
                    </li>
                    <li>
                        Share the newly created Google Sheet with the email
                        address:
                        pueblocrawler@pueblocrawler.iam.gserviceaccount.com.
                    </li>
                    <li>
                        Retrieve the unique ID of the new Google Sheet from its
                        URL. To do this:
                        <ol>
                            <li>
                                Open the duplicated Google Sheet in your web
                                browser
                            </li>
                            <li>
                                Copy the random string of characters from the
                                URL in the address bar (ex.{" "}
                                <b>
                                    1MKweHrU_1pa4hZxkJzuCxEP2LiR5Lm3K9VNzlE7YTis
                                </b>
                                ). The URL should look something like this:
                                https://docs.google.com/spreadsheets/d/1MKweHrU_1pa4hZxkJzuCxEP2LiR5Lm3K9VNzlE7YTis/edit#gid=1183934613
                            </li>
                        </ol>
                    </li>
                    <li>
                        Paste the copied Google Sheet ID into the "Google Sheet
                        ID input" field.
                    </li>
                    <li>
                        Set how frequent you want us to crawl the spreadsheet.
                    </li>
                </ol>
            </Modal>

            <Modal
                className="modal-activity"
                open={successModalVisible}
                onCancel={() => {
                    navigate("/contacts");
                    setSuccessModalVisible(false);
                }}
                footer={null}
                title={null}
                closable={false}
                width={"500px"}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Import Success
                    </Typography.Title>

                    <Button
                        onClick={() => {
                            navigate("/contacts");
                            setSuccessModalVisible(false);
                        }}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                {/* <Card className="p-t-md">
                    <Table dataSource={successModalData} pagination={false}>
                        <Table.Column
                            title="Contact Name"
                            dataIndex="contactName"
                            key="contactName"
                        />
                        <Table.Column
                            title="Success"
                            key="deal"
                            render={(text, record: any) => (
                                <CheckCircleOutlined
                                    style={{ color: "green" }}
                                />
                            )}
                        />
                    </Table>
                </Card> */}
            </Modal>
        </Space>
    );
};
export default ImportDataGSheet;
