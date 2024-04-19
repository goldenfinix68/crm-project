import React, { useEffect, useState } from "react";
import {
    Button,
    Typography,
    Card,
    Divider,
    Row,
    Upload,
    message,
    Table,
    Space,
    Modal,
    Select,
    Alert,
} from "antd";
import {
    CheckCircleOutlined,
    CloseOutlined,
    DollarCircleOutlined,
    LoadingOutlined,
    UploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";
import { useMutation } from "react-query";
import { useContactBulkImportCsv } from "../../../api/mutation/useContactMutation";
import { useNavigate } from "react-router-dom";
import { useCustomFields } from "../../../api/query/customFieldQuery";

const ComponentImportData: React.FC = () => {
    useEffect(() => {
        document.title = "Import Data - SpeedLead";
        return () => {};
    }, []);
    const navigate = useNavigate();
    const { data: contactFields } = useCustomFields("contact");
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any>([]);
    const [keyValues, setKeyValues] = useState<any>([]);
    const [columnMappings, setColumnMappings] = useState<any>({});
    const requiredFields = contactFields?.filter(
        (field) =>
            field.isRequired &&
            !["contactLookup", "userLookup", "contactTypeLookup"].includes(
                field.type
            )
    );
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successModalData, setSuccessModalData] = useState();

    const contactBulkImportCsv = useMutation(useContactBulkImportCsv, {
        onSuccess: (res) => {
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
    const requiredFieldsPresent = requiredFields?.every((requiredField) => {
        // Check if any key in data matches the value of "value" in the field object
        return Object.values(columnMappings).some(
            (value: any) => value == requiredField.id
        );
    });

    const handleSubmit = () => {
        if (requiredFieldsPresent) {
            contactBulkImportCsv.mutate({ csvData, columnMappings });
        } else {
            console.log(requiredFields);
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

    console.log(requiredFields);
    console.log(columnMappings);

    return (
        <>
            {csvData.length ? (
                <Space direction="vertical" className="w-100">
                    <Card title="Map columns from sheet to Speedlead fields ">
                        {isDuplicate && (
                            <Alert
                                description="Same field selected for mapping."
                                type="error"
                            />
                        )}
                        <Alert
                            description="Mobile number must be unique for each contact, and duplicates will be ignored."
                            type="warning"
                        />
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
                                        <Select
                                            showSearch
                                            className="w-100"
                                            value={columnMappings[key] ?? ""}
                                            onChange={(fieldId) => {
                                                handleMappingChange(
                                                    key,
                                                    fieldId
                                                );
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
                                        // <Popover
                                        //     content={
                                        //         <AddAttributePopoverContent
                                        //             handleSelect={(
                                        //                 selectedValue
                                        //             ) => {
                                        //                 handleMappingChange(
                                        //                     key,
                                        //                     selectedValue
                                        //                 );
                                        //             }}
                                        //         />
                                        //     }
                                        //     trigger={"click"}
                                        // >
                                        //     <Input
                                        //         placeholder="-- Select --"
                                        //         readOnly={true}
                                        //         prefix={
                                        //             <InputPrefix
                                        //                 mergeField={
                                        //                     columnMappings[key]
                                        //                         ?.mergeField
                                        //                 }
                                        //             />
                                        //         }
                                        //         value={
                                        //             columnMappings[key]?.label ?? ""
                                        //         }
                                        //     />
                                        // </Popover>
                                    );
                                }}
                            />
                        </Table>

                        <Row className="m-t-xl">
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                disabled={!selectedFile || isDuplicate} // Disable the button if no file is selected
                                loading={contactBulkImportCsv.isLoading}
                            >
                                Import
                            </Button>
                        </Row>
                    </Card>
                </Space>
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
                            title="Success"
                            key="deal"
                            render={(text, record: any) => (
                                <CheckCircleOutlined
                                    style={{ color: "green" }}
                                />
                            )}
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
