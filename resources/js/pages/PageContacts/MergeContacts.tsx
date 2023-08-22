import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Popconfirm,
    Space,
    Upload,
    Row,
    Card,
    Divider,
    Radio,
    Table,
    Checkbox,
    Col,
    Select,
    Tag,
    Avatar,
    Tabs,
    Typography,
    Menu,
    Dropdown,
    Input,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CaretDownOutlined,
    EditOutlined,
    CloseOutlined,
    SaveOutlined,
    ExportOutlined,
    CopyOutlined,
    MailOutlined,
    MobileOutlined,
    UnorderedListOutlined,
    EyeOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps, ColumnGroupType } from "antd/es/table";
import ContactsComponentsAddContacts from "./Components/ContactsComponentsAddContacts";
import ContactsComponentsFilter from "./Components/ContactsComponentsFilter";
import ContactsComponentsManageColumn from "./Components/ContactsComponentsManageColumn";
import { useContactsAll } from "../../api/query/contactsQuery";
import { useMutation, useQuery } from "react-query";
import { TContact } from "../../entities";
import { deleteContactMutation } from "../../api/mutation/useContactMutation";
import queryClient from "../../queryClient";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ContactsComponentsTableEditableCell from "./Components/ContactsComponentsTableEditableCell";
import ContactsComponentsTableEditableCellTags from "./Components/ContactsComponentsTableEditableCellTags";
import ContactsComponentsTableEditableCellName from "./Components/ContactsComponentsTableEditableCellName";
import ContactsComponentsUpdate from "./Components/ContactsComponentsUpdate";
import { ColumnType } from "antd/lib/table";
import { ColumnProps } from "antd/es/table";
import { useLocation } from "react-router-dom";

interface DataType {
    key: React.Key;
    name: string;
    email: string;
    mobile: string;
    countryLink: string;
    acres: string;
    tags: string[];
    owner: string;
    avatar: any;
}

const { Option } = Select;
const { TabPane } = Tabs;

const handleTabChange = (key) => {
    // Handle tab change event
    console.log("Selected tab:", key);
};
const { Search } = Input;
const onSearch = (value: string) => console.log(value);

// const menu = (

// );

const MergeContacts = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [isTContact, setTContact] = useState<TContact | null>(null);
    const { contacts, isLoading, refetch } = useContactsAll(filter);
    const [isModalOpen, setisModalOpen] = useState(false);
    const [isModalManageColumnOpen, setIsModalManageColumnOpen] =
        useState(false);
    const [open, setOpen] = useState(false);
    const [isTitle, setTitle] = useState("");

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [currentActiveCell, setCurrentActiveCell] = useState("");
    const [currentBtnActive, setCurrentBtnActive] = useState("");
    const [currentActiveType, setCurrentActiveType] = useState("");

    const [hideHeader, setHideHeader] = useState(true);

    const [isModalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isDataSource, setDataSource] = useState<any>();

    const handleEdit = (record: TContact) => {
        setTContact(record);
    };

    const [tableData, setTableData] = useState<any>([]);
    const [tableDataKeys, setTableDataKeys] = useState<any>([]);

    const location = useLocation();
    const receivedData = location.state?.data;

    useEffect(() => {
        if (receivedData.length > 0) {
            const title = Object.keys(receivedData[0]);

            let new_data = {};

            new_data = { title: title };

            receivedData.forEach((item, index) => {
                let temp_array = Object.values(item);
                let key_element = "contact_" + index;

                new_data = { ...new_data, [key_element]: temp_array };
            });

            const keys = Object.keys(new_data);
            const result: Object[] = [];

            for (let i = 0; i < title.length; i++) {
                let newObj = {};

                keys.forEach((key) => {
                    const dataForKey = new_data[key];
                    if (Array.isArray(dataForKey) && dataForKey.length > i) {
                        newObj = { ...newObj, [key]: dataForKey[i] };
                    }
                });
                result.push(newObj);
            }
            setTableData(result);

            let keysData = Object.keys(result[0]);
            setTableDataKeys(keysData);
            // console.log(" title", result);
            // generateCol(result);
        }
    }, [receivedData]);

    useEffect(() => {
        console.log(filter);
        refetch();
    }, [filter]);

    // const [allVariable, setAllVariables] = useState<{ [key: string]: any }>({});
    const [allVariable, setAllVariables] = useState({});
    const [tableColumns, setTableColumns] = useState<ColumnsType<TContact>>([]);
    const [selectedKey, setSelectedKey] = useState<string>("");

    useEffect(() => {
        if (allVariable) {
            console.log("allVariable", allVariable);
        }
    }, [allVariable]);

    const handleOnchangeRadio = (record: any, key: React.Key) => {
        setAllVariables((prevAllVariables) => ({
            ...prevAllVariables,
            [record["title"]]: record[key],
        }));
    };

    const handleCheckedRadio = (record: any, key: React.Key) => {
        console.log("allVariable", allVariable);
        if (Object.keys(allVariable).length) {
            return allVariable[record["title"]] === record[key] ? true : false;
        }
    };

    const generateCol = (data: any) => {
        let columns: ColumnsType<TContact> = [];
        console.log("onChange", data);
        if (data.length > 0) {
            const keys = Object.keys(data[0]);

            keys.forEach((key) => {
                columns.push({
                    key: key,
                    title: key,
                    dataIndex: key,
                    fixed: "left",
                    width: 700,
                    render: (text: string, record) => {
                        if (key == "title") {
                            return <span>{text}</span>;
                        } else {
                            return (
                                <Radio
                                    key={key}
                                    checked={handleCheckedRadio(record, key)}
                                    // onChange={(e) => {
                                    //     // console.log("radio-0", record[key]);
                                    //     // console.log("radio-1", record["title"]);
                                    //     console.log("onChange", record);
                                    //     handleOnchangeRadio(record, key);
                                    //     // console.log(
                                    //     //     "record[key]:",
                                    //     //     record[key]
                                    //     // );
                                    //     // console.log(
                                    //     //     "record['title']:",
                                    //     //     record["title"]
                                    //     // );

                                    //     // let data = {
                                    //     //     ...allVariable,
                                    //     //     [record["title"]]: record[key],
                                    //     // };

                                    //     // setAllVariables(data);
                                    // }}
                                    onChange={() => {
                                        console.log("onChange1", record[key]);
                                        console.log("onChange2", allVariable);

                                        handleOnchangeRadio(record, key);
                                    }}
                                >
                                    {text}
                                </Radio>
                            );
                        }

                        // Customize the rendering logic here
                    },
                });
            });
        }

        setTableColumns(columns);
    };

    useEffect(() => {
        console.log("tableData", tableDataKeys);
    }, [tableData]);

    return (
        <>
            <Row>
                <Col lg={16} md={16} offset={4}>
                    <Card>
                        <Typography.Title level={4}>
                            Merge Contacts
                        </Typography.Title>
                        <Typography.Title level={5}>
                            Merge Details
                        </Typography.Title>

                        <Table dataSource={tableData} pagination={false}>
                            {tableDataKeys.length > 0 &&
                                tableDataKeys.map(
                                    (item: any, key: React.Key) => {
                                        return (
                                            <Table.Column
                                                key={key}
                                                dataIndex={item}
                                                title={item}
                                                render={(text, record) => {
                                                    if (item === "title") {
                                                        return (
                                                            <span>{text}</span>
                                                        );
                                                    } else {
                                                        return (
                                                            <Radio
                                                                key={key}
                                                                checked={handleCheckedRadio(
                                                                    record,
                                                                    item
                                                                )}
                                                                onChange={() => {
                                                                    handleOnchangeRadio(
                                                                        record,
                                                                        item
                                                                    );
                                                                }}
                                                            >
                                                                {text}
                                                            </Radio>
                                                        );
                                                    }
                                                }}
                                            />
                                        );
                                    }
                                )}
                        </Table>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MergeContacts;
