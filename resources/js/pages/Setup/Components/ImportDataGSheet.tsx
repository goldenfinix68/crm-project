import React, { useEffect, useState } from "react";
import {
    Button,
    Typography,
    Card,
    Divider,
    Row,
    message,
    Space,
    Input,
    Modal,
    Select,
    Form,
    Checkbox,
    Tooltip,
    Alert,
    Table,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { bulkImportGSheet } from "../../../api/mutation/useContactMutation";
import { useNavigate } from "react-router-dom";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import queryClient from "../../../queryClient";
import validateRules from "../../../providers/validateRules";
import { gSheetCrawl } from "../../../api/query/importDataQuery";
import { mutatePost } from "../../../api/mutation/useSetupMutation";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import { ENDPOINTS } from "../../../endpoints";

const ImportDataGSheet: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const isAddToQueue = Form.useWatch("isAddToQueue", form);
    const [columnNames, setColumnNames] = useState<any>(undefined);
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
    const { data: crawl, isLoading } = gSheetCrawl();
    const gSheedId = Form.useWatch("gSheedId", form);
    const gSheetName = Form.useWatch("gSheetName", form);
    const [columnMappings, setColumnMappings] = useState<any>({});
    const [formValues, setFormValues] = useState<any>(null);

    const { data: contactFields } = useCustomFields("contact");

    const requiredFields = contactFields?.filter(
        (field) =>
            field.isRequired &&
            !["contactLookup", "userLookup", "contactTypeLookup"].includes(
                field.type
            )
    );

    const save = useMutation(bulkImportGSheet, {
        onSuccess: () => {
            queryClient.invalidateQueries("gSheetCrawlResults");
            navigate("/setup/data-administration/import-file-gsheet/history");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const getColumnNames = useMutation(mutatePost, {
        onSuccess: (res) => {
            if (res.result) {
                const headers = res.data;
                setColumnNames(Object.entries(headers));
            } else {
                message.error(res.message);
            }
        },
    });

    const handleSubmit = async () => {
        const requiredFieldsPresent = requiredFields?.every((requiredField) => {
            // Check if any key in data matches the value of "value" in the field object
            return Object.values(columnMappings).some(
                (value: any) => value == requiredField.id
            );
        });
        console.log(columnMappings);

        form.setFieldsValue(formValues);

        if (requiredFieldsPresent) {
            save.mutate({
                ...formValues,
                columnMappings,
            });
        } else {
            message.error(
                requiredFields?.map((item) => item.label).join(", ") +
                    ` required.`
            );
        }
    };

    const handleMappingChange = (csvColumnName: string, fieldId: string) => {
        // Update the columnMappings object when the user selects a mapping
        setColumnMappings({
            ...columnMappings,
            [csvColumnName]: fieldId,
        });
    };
    const isDuplicate =
        Object.values(columnMappings).filter((value, index, self) => {
            return self.indexOf(value) !== index;
        }).length > 0;

    useEffect(() => {
        if (crawl?.id) {
            form.setFieldValue("gSheedId", crawl.gSheetId);
            form.setFieldValue("interval", crawl.interval);
            form.setFieldValue("isAddToQueue", true);
        }
    }, [crawl]);
    console.log({ columnMappings });

    return (
        <Space direction="vertical" className="w-100">
            {columnNames?.length ? (
                <Card
                    title="Map columns from sheet to Speedlead fields"
                    className="w-100"
                >
                    {isDuplicate && (
                        <Alert
                            description="Same field selected for mapping."
                            type="error"
                        />
                    )}
                    <Table dataSource={columnNames} pagination={false}>
                        <Table.Column
                            title="File Columns"
                            // dataIndex="column1"
                            key="column1"
                            render={([key, value]) => (
                                <Space direction="vertical">
                                    <Typography.Text>{key}</Typography.Text>
                                    <Typography.Text
                                        style={{ fontSize: "9px" }}
                                    >
                                        {String(value)}
                                    </Typography.Text>
                                </Space>
                            )}
                        />
                        <Table.Column
                            title="Speedlead Fields"
                            key="column2"
                            render={([key, value]) => {
                                return (
                                    <Select
                                        showSearch
                                        className="w-100"
                                        value={columnMappings[key] ?? ""}
                                        onChange={(fieldId) => {
                                            handleMappingChange(key, fieldId);
                                        }}
                                        allowClear
                                        optionFilterProp="children"
                                    >
                                        {contactFields
                                            ?.filter(
                                                (field) =>
                                                    ![
                                                        "contactLookup",
                                                        "userLookup",
                                                        "contactTypeLookup",
                                                    ].includes(field.type)
                                            )
                                            ?.map((field, index) => (
                                                <Select.Option
                                                    value={field.id}
                                                    key={index}
                                                >
                                                    {field.label}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                );
                            }}
                        />
                    </Table>

                    <Space className="p-t-lg">
                        <Button
                            type="primary"
                            // htmlType="submit"
                            onClick={() => {
                                // form.submit();
                                handleSubmit();
                            }}
                            disabled={isDuplicate}
                            loading={getColumnNames.isLoading || save.isLoading}
                        >
                            {!isAddToQueue ? "Crawl" : "Crawl and Save"}
                        </Button>
                    </Space>
                </Card>
            ) : (
                <Card>
                    <Typography.Title level={3}>
                        Import from Google Sheet
                    </Typography.Title>
                    <Typography className="m-b-sm">
                        Now, you have the capability to effortlessly import
                        contacts directly from a Google Sheet. Additionally, you
                        have the flexibility to set the frequency at which our
                        system crawls the spreadsheet, ensuring seamless updates
                        to your account by identifying and adding any new
                        contacts as needed.
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
                    <Form layout="vertical" form={form} className="p-t-lg">
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
                        <Form.Item
                            name="gSheetName"
                            label="Sheet Name"
                            rules={[
                                {
                                    required: true,
                                    message: DEFAULT_REQUIRED_MESSAGE,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Tooltip title="Get this in Roor Campaign -> Autoresponder -> Get posting Instruction.">
                            <Form.Item
                                name="roorAutoresponderId"
                                label="Roor Autoresponder ID"
                            >
                                <Input />
                            </Form.Item>
                        </Tooltip>
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
                            <Checkbox>Recurring crawl queue</Checkbox>
                        </Form.Item>

                        <Space style={{ paddingTop: "5px" }}>
                            <Button
                                type="primary"
                                // htmlType="submit"
                                onClick={() => {
                                    form.validateFields().then((values) => {
                                        setFormValues(values);
                                        getColumnNames.mutate({
                                            url: "/api/googlesheet/get-column-names",
                                            data: { gSheedId, gSheetName },
                                        });
                                    });
                                }}
                                disabled={isDuplicate}
                                loading={
                                    getColumnNames.isLoading || save.isLoading
                                }
                            >
                                Next
                            </Button>
                        </Space>
                    </Form>
                </Card>
            )}

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
        </Space>
    );
};
export default ImportDataGSheet;
