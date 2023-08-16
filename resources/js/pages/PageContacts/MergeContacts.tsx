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

    const location = useLocation();
    const receivedData = location.state?.data;

    useEffect(() => {
        console.log(" receivedData", receivedData);
    }, [receivedData]);

    useEffect(() => {
        console.log(filter);
        refetch();
    }, [filter]);

    useEffect(() => {
        if (receivedData) {
            // let dataSource = [...contacts];

            // const newdataSource: { [key: string]: any }[] = [];

            // dataSource.forEach((item) => {
            //     const columnName = item.firstName + " " + item.lastName;
            //     const itemData = Object.values(item);

            //     const newItem = {
            //         title: Object.keys(item),
            //         [columnName]: itemData,
            //     };

            //     newdataSource.push(newItem);
            // });
            // // let newdataSource = {
            // //     title: Object.keys(dataSource),
            // //     contacts: { ...dataSource },
            // // };
            // console.log("dataSource", newdataSource);
            // setDataSource(dataSource);
            let final_contact = [
                { title: "Firstname", first_element: "", second_element: "" },
                { title: "Last Name", first_element: "", second_element: "" },
            ];

            let contacts1 = receivedData;
            let contacts2 = receivedData;

            contacts1.forEach((element) => {
                if (element.firstName) {
                    final_contact[0].first_element = element.firstName;
                }
                if (element.lastName) {
                    final_contact[1].first_element = element.lastName;
                }
            });
            contacts2.forEach((element) => {
                if (element.firstName) {
                    final_contact[0].second_element = element.firstName;
                }
                if (element.lastName) {
                    final_contact[1].second_element = element.lastName;
                }
            });

            setTableData(final_contact);
        }
    }, [contacts]);

    const columns: ColumnsType<TContact> = [
        {
            key: "title",
            title: "MASTER RECORD",
            dataIndex: "title",
            fixed: "left",
            width: 700,
        },

        {
            key: "first_element",
            title: "",
            dataIndex: "first_element",
            fixed: "left",
            width: 700,
        },
        {
            key: "second_element",
            title: "",
            dataIndex: "second_element",
            fixed: "left",
            width: 700,
        },
        // {
        //     key: "acres",
        //     title: "Acres",
        //     dataIndex: "acres",
        //     width: 150,
        // },
        // {
        //     title: "Tags",
        //     dataIndex: "tags",
        //     key: "tags",
        //     width: 250,
        // },
        // {
        //     key: "owner",
        //     title: "Owner",
        //     dataIndex: "owner",
        //     width: 200,
        // },
        // {
        //     key: "firstName",
        //     title: "First Name",
        //     dataIndex: "firstName",
        //     width: 200,
        // },
        // {
        //     key: "lastName",
        //     title: "Last Name",
        //     dataIndex: "lastName",
        //     width: 200,
        // },
        // {
        //     key: "title",
        //     title: "Title",
        //     dataIndex: "title",
        //     width: 200,
        //     children: [
        //         {
        //             key: "conatct.firstNsame",
        //             title: "First Name",
        //             dataIndex: "conatcts.firstName",
        //             width: 200,
        //         },
        //     ],
        // },
    ];

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

                        <Table
                            dataSource={tableData}
                            columns={columns}
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MergeContacts;
