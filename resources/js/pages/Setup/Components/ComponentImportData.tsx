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
} from "antd";
import {
    CaretDownOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    DollarCircleOutlined,
    LoadingOutlined,
    UploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";
import AddAttributePopoverContent from "../../TextTemplates/components/AddAttributePopoverContent";
import { useArray } from "../../../helpers";
import { useMutation } from "react-query";
import { useContactBulkImportCsv } from "../../../api/mutation/useContactMutation";
import { useNavigate } from "react-router-dom";

const ComponentImportData: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any>([]);
    const [keyValues, setKeyValues] = useState<any>([]);
    const [columnMappings, setColumnMappings] = useState<any>({});
    const requiredFields = ["firstName", "lastName"];
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successModalData, setSuccessModalData] = useState();

    const contactBulkImportCsv = useMutation(useContactBulkImportCsv, {
        onSuccess: (res) => {
            console.log(res);
            setSuccessModalVisible(true);
            setSuccessModalData(res.result);
            // navigate("/contacts"); // Redirect to the users list page after successful submission
        },
    });

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <UploadOutlined />}
            <div style={{ marginTop: 8 }}>
                Drag and drop or choose a file We support .csv, .xls, and .xlsx
                files.
            </div>
        </div>
    );

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
    };

    const handleNext = () => {
        if (selectedFile) {
            setLoading(true); // Show loading indicator

            const file = selectedFile;

            Papa.parse(file, {
                header: true, // Treat the first row as headers
                complete: function (results) {
                    // Access the headers in the 'data' property of the result
                    const headers = results.data[0];
                    setCsvData(results.data);
                    setKeyValues(Object.entries(headers));

                    // Log the headers to the console or use them as needed
                    console.log(results.data);

                    // You can also send the headers to your state or perform further processing
                    // this.setState({ csvHeaders: headers });
                },
                error: function (error) {
                    console.error("CSV parsing error:", error.message);
                },
            });
            // uploadFile(selectedFile);
        }
    };
    const requiredFieldsPresent = requiredFields.every((fieldName) => {
        // Check if any key in data matches the value of "value" in the field object
        return Object.values(columnMappings).some(
            (field: any) => field.value === fieldName
        );
    });

    const handleSubmit = () => {
        if (requiredFieldsPresent) {
            contactBulkImportCsv.mutate({ csvData, columnMappings });
        } else {
            message.error("Contact first and last name is required");
        }
    };
    const handleMappingChange = (
        csvColumnName: string,
        databaseField: string
    ) => {
        // Update the columnMappings object when the user selects a mapping
        setColumnMappings({
            ...columnMappings,
            [csvColumnName]: databaseField,
        });
    };

    return (
        <>
            {csvData.length ? (
                <Card title="Map columns with Speedlead fields ">
                    <Table dataSource={keyValues} pagination={false}>
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
                                    <Popover
                                        content={
                                            <AddAttributePopoverContent
                                                handleSelect={(
                                                    selectedValue
                                                ) => {
                                                    handleMappingChange(
                                                        key,
                                                        selectedValue
                                                    );
                                                }}
                                            />
                                        }
                                        trigger={"click"}
                                    >
                                        <Input
                                            placeholder="-- Select --"
                                            readOnly={true}
                                            prefix={
                                                <InputPrefix
                                                    mergeField={
                                                        columnMappings[key]
                                                            ?.mergeField
                                                    }
                                                />
                                            }
                                            value={
                                                columnMappings[key]?.label ?? ""
                                            }
                                        />
                                    </Popover>
                                );
                            }}
                        />
                    </Table>

                    <Row className="m-t-xl">
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            disabled={!selectedFile} // Disable the button if no file is selected
                            loading={contactBulkImportCsv.isLoading}
                        >
                            Import
                        </Button>
                    </Row>
                </Card>
            ) : (
                <Card>
                    <Typography.Title level={3}>
                        Import using file
                    </Typography.Title>
                    <Typography className="m-b-sm">
                        You can import contacts, companies, deals, activities,
                        and notes separately or using a single file by grouping
                        records together.
                    </Typography>
                    <Typography.Link href="" target="_blank">
                        Learn more about how to import using an individual or
                        grouped file.
                    </Typography.Link>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Typography.Title level={5}>
                            Need help in getting started?
                        </Typography.Title>
                    </Row>
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Typography.Link
                            href="/files/importsamplefile.csv"
                            target="_blank"
                        >
                            Download sample spreadsheet
                        </Typography.Link>
                        <Typography className="m-r-sm m-l-sm">|</Typography>
                        <Typography.Link href="" target="_blank">
                            View import FAQs
                        </Typography.Link>
                    </Row>
                    <Row>
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader upload m-t-lg"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                const allowedTypes = [
                                    "application/vnd.ms-excel",
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    "text/csv",
                                ];

                                if (allowedTypes.includes(file.type)) {
                                    handleFileChange(file);
                                    return false; // Prevent the default upload behavior
                                } else {
                                    message.error(
                                        "Only CSV or Excel files are allowed!"
                                    );
                                    return false; // Prevent the upload
                                }
                            }}
                        >
                            {selectedFile ? (
                                <div>{selectedFile.name}</div>
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Row>
                    <Row className="m-t-xl">
                        <Button
                            type="primary"
                            onClick={handleNext}
                            disabled={!selectedFile} // Disable the button if no file is selected
                        >
                            Next
                        </Button>
                    </Row>
                </Card>
            )}

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
                <Card className="p-t-md">
                    <Table dataSource={successModalData} pagination={false}>
                        <Table.Column
                            title="Contact Name"
                            dataIndex="contactName"
                            key="contactName"
                        />
                        <Table.Column
                            title="Create Contact"
                            key="deal"
                            render={(text, record: any) =>
                                record.isContactSuccess ? (
                                    <CheckCircleOutlined
                                        style={{ color: "green" }}
                                    />
                                ) : (
                                    <CloseCircleOutlined
                                        style={{ color: "red" }}
                                    />
                                )
                            }
                        />
                        <Table.Column
                            title="Create Deal"
                            key="deal"
                            render={(text, record: any) =>
                                record.isDealSuccess ? (
                                    <CheckCircleOutlined
                                        style={{ color: "green" }}
                                    />
                                ) : (
                                    <CloseCircleOutlined
                                        style={{ color: "red" }}
                                    />
                                )
                            }
                        />
                        <Table.Column
                            title="Create Activity"
                            key="activity"
                            render={(text, record: any) =>
                                record.isActivitySuccess ? (
                                    <CheckCircleOutlined
                                        style={{ color: "green" }}
                                    />
                                ) : (
                                    <CloseCircleOutlined
                                        style={{ color: "red" }}
                                    />
                                )
                            }
                        />
                    </Table>
                </Card>
            </Modal>
        </>
    );
};

const InputPrefix = ({ mergeField }) => {
    if (mergeField?.includes("contact.")) {
        return <UserOutlined />;
    }
    if (mergeField?.includes("deal.")) {
        return <DollarCircleOutlined />;
    }
    if (mergeField?.includes("activity.")) {
        return <CheckCircleOutlined />;
    }
    return <></>;
};

export default ComponentImportData;
