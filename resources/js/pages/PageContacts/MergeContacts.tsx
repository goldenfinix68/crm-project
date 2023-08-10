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

    const handleEdit = (record: TContact) => {
        setTContact(record);
    };

    useEffect(() => {
        console.log(filter);
        refetch();
    }, [filter]);

    // const data = [
    //     { key: 1, columnTitle: "First Name", data: "Data 1" },
    //     { key: 2, columnTitle: "Mobile", data: "Data 2" },
    //     { key: 3, columnTitle: "County Link", data: "Data 2" },
    //     { key: 4, columnTitle: "Acres", data: "Data 2" },
    //     { key: 5, columnTitle: "Phone", data: "Data 2" },
    //     { key: 6, columnTitle: "Owner", data: "Data 2" },
    //     { key: 7, columnTitle: "Email 2", data: "Data 2" },
    //     { key: 8, columnTitle: "Type", data: "Data 2" },
    //     { key: 9, columnTitle: "Mailing Street Address", data: "Data 2" },
    //     { key: 10, columnTitle: "Email Opt Out", data: "Data 2" },
    //     { key: 11, columnTitle: "Mailing City", data: "Data 2" },
    //     { key: 12, columnTitle: "Mailing State", data: "Data 2" },
    //     { key: 13, columnTitle: "Email Opt Out Reason", data: "Data 2" },
    //     { key: 14, columnTitle: "Mailing Zip", data: "Data 2" },
    //     { key: 15, columnTitle: "Mailing County", data: "Data 2" },
    //     { key: 16, columnTitle: "Subdivision", data: "Data 2" },
    //     { key: 17, columnTitle: "APN", data: "Data 2" },
    //     { key: 18, columnTitle: "Google Map Link", data: "Data 2" },
    //     { key: 19, columnTitle: "Road Frontage (ft)", data: "Data 2" },
    //     { key: 20, columnTitle: "Redfin Quick Link", data: "Data 2" },
    //     { key: 21, columnTitle: "Opening Bid", data: "Data 2" },
    //     { key: 22, columnTitle: "Assessed Value", data: "Data 2" },
    //     {
    //         key: 23,
    //         columnTitle: "Assessed vs. Opening Bid Margin (manual)",
    //         data: "Data 2",
    //     },
    //     {
    //         key: 24,
    //         columnTitle: "Assessed vs. Opening Bid Multiple (manual)",
    //         data: "Data 2",
    //     },
    //     { key: 25, columnTitle: "Wetlands Status", data: "Data 2" },
    //     { key: 26, columnTitle: "Legal Description", data: "Data 2" },
    //     { key: 27, columnTitle: "Subdivision", data: "Data 2" },
    //     { key: 28, columnTitle: "Flood Zone", data: "Data 2" },
    //     { key: 29, columnTitle: "Topography", data: "Data 2" },
    //     { key: 30, columnTitle: "Wireless 1", data: "Data 2" },
    //     { key: 31, columnTitle: "Wireless 2", data: "Data 2" },
    //     { key: 32, columnTitle: "Wireless 3", data: "Data 2" },
    //     { key: 33, columnTitle: "Wireless 4", data: "Data 2" },
    //     { key: 34, columnTitle: "Landline 1", data: "Data 2" },
    //     { key: 35, columnTitle: "Landline 2", data: "Data 2" },
    //     { key: 36, columnTitle: "Landline 3", data: "Data 2" },
    //     { key: 37, columnTitle: "Landline 4", data: "Data 2" },
    //     { key: 38, columnTitle: "MarketAreaName", data: "Data 2" },
    //     { key: 39, columnTitle: "Skype", data: "Data 2" },
    //     { key: 40, columnTitle: "LinkedIn", data: "Data 2" },
    //     { key: 41, columnTitle: "Instagram", data: "Data 2" },
    //     { key: 42, columnTitle: "Description", data: "Data 2" },
    //     { key: 43, columnTitle: "Legal Description", data: "Data 2" },
    //     { key: 44, columnTitle: "Address Line 1", data: "Data 2" },
    //     { key: 45, columnTitle: "City", data: "Data 2" },
    //     { key: 46, columnTitle: "County", data: "Data 2" },
    //     { key: 47, columnTitle: "State", data: "Data 2" },
    //     { key: 48, columnTitle: "Last Name", data: "Data 2" },
    //     { key: 49, columnTitle: "Email", data: "Data 2" },
    //     { key: 50, columnTitle: "Job Title", data: "Data 2" },
    //     { key: 51, columnTitle: "Other Phone", data: "Data 2" },
    //     { key: 52, columnTitle: "SMS Opt Out", data: "Data 2" },
    //     { key: 53, columnTitle: "Website", data: "Data 2" },
    //     { key: 54, columnTitle: "Facebook", data: "Data 2" },
    //     { key: 55, columnTitle: "Twitter", data: "Data 2" },
    //     { key: 56, columnTitle: "Address Line 2", data: "Data 2" },
    //     { key: 57, columnTitle: "ZipCode", data: "Data 2" },
    //     { key: 58, columnTitle: "Country", data: "Data 2" },

    //     // Add more data items as needed
    // ];

    // interface TableData {
    //     key: number;
    //     columnTitle: string;
    //     data: string;
    // }

    // interface Props {
    //     data: TableData[];
    // }

    // const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

    // const columns = [
    //     {
    //         title: "MASTER RECORD",
    //         dataIndex: "columnTitle",
    //         key: "columnTitle",
    //         width: 300,
    //     },
    //     {
    //         title: "Data",
    //         dataIndex: "data",
    //         key: "data",
    //         render: (text: string, record: TableData) => (
    //             <Radio
    //                 checked={selectedRowKeys.includes(record.key)}
    //                 onChange={() => handleRadioChange(record.key)}
    //             >
    //                 {text}
    //             </Radio>
    //         ),
    //     },
    //     {
    //         title: "Data",
    //         dataIndex: "data2",
    //         key: "data2",
    //     },
    // ];

    // const handleRadioChange = (key: number) => {
    //     if (selectedRowKeys.includes(key)) {
    //         setSelectedRowKeys([]);
    //     } else {
    //         setSelectedRowKeys([key]);
    //     }
    // };

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
                        {/* <Table
                            // dataSource={data}
                            // columns={columns}
                            pagination={false}
                            bordered
                        /> */}
                        <Table />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MergeContacts;
