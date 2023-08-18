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

            console.log(" title", result);
            generateCol(result);
        }
    }, [receivedData]);

    useEffect(() => {
        console.log(filter);
        refetch();
    }, [filter]);

    // useEffect(() => {
    //     if (receivedData) {
    //         // let dataSource = [...contacts];

    //         // const newdataSource: { [key: string]: any }[] = [];

    //         // dataSource.forEach((item) => {
    //         //     const columnName = item.firstName + " " + item.lastName;
    //         //     const itemData = Object.values(item);

    //         //     const newItem = {
    //         //         title: Object.keys(item),
    //         //         [columnName]: itemData,
    //         //     };

    //         //     newdataSource.push(newItem);
    //         // });
    //         // // let newdataSource = {
    //         // //     title: Object.keys(dataSource),
    //         // //     contacts: { ...dataSource },
    //         // // };
    //         // console.log("dataSource", newdataSource);
    //         // setDataSource(dataSource);
    //         let final_contact = [
    //             { title: "Firstname", first_element: "", second_element: "" },
    //             { title: "Last Name", first_element: "", second_element: "" },
    //         ];

    //         let contacts1 = receivedData;
    //         let contacts2 = receivedData;

    //         contacts1.forEach((element) => {
    //             if (element.firstName) {
    //                 final_contact[0].first_element = element.firstName;
    //             }
    //             if (element.lastName) {
    //                 final_contact[1].first_element = element.lastName;
    //             }
    //         });
    //         contacts2.forEach((element) => {
    //             if (element.firstName) {
    //                 final_contact[0].second_element = element.firstName;
    //             }
    //             if (element.lastName) {
    //                 final_contact[1].second_element = element.lastName;
    //             }
    //         });

    //         console.log("final contact", final_contact);

    //         setTableData(final_contact);
    //     }
    // }, [contacts]);

    const [tableColumns, setTableColumns] = useState<ColumnsType<TContact>>([]);
    const [selectedKey, setSelectedKey] = useState<string>("");

    const generateCol = (data: any) => {
        let columns: ColumnsType<TContact> = [];

        console.log("data sdas", data);

        if (data.length > 0) {
            const keys = Object.keys(data[0]);

            keys.forEach((key) => {
                columns.push({
                    key: key,
                    title: key,
                    dataIndex: key,
                    fixed: "left",
                    width: 700,
                    render: (text: string, record: TContact) => {
                        if (key == "title") {
                            return <span>{text}</span>;
                        } else {
                            return <Radio>{text}</Radio>;
                        }

                        // Customize the rendering logic here
                    },
                });
            });
        }

        setTableColumns(columns);
    };

    useEffect(() => {
        console.log("tableColumns", tableColumns);
    }, [tableColumns]);

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
                            columns={tableColumns}
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MergeContacts;
