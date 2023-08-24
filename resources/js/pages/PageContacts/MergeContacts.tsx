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
    // const title = "Master Record";

    const mergeData = [
        "firstName",
        "lastName",
        "mobile",
        "countryLink",
        "acres",
        "phone",
        "owner",
        "email2",
        "type",
        "mailingStreetAddress",
        "emailOptOut",
        "mailingCity",
        "mailingState",
        "emailOptOutReason",
        "mailingZip",
        "mailingCountry",
        "subdivision",
        "APN",
        "gMapLink",
        "roadFrontage",
        "redfinLink",
        "openingBid",
        "assessedValue",
        "assessedVsOpeningMargin",
        "assessedVsOpeningMultiple",
        "wetlandsStatus",
        "legalDescription",
        "legalSubdivision",
        "floodzone",
        "topography",
        "wireless1",
        "wireless2",
        "wireless3",
        "wireless4",
        "landline1",
        "landline2",
        "landline3",
        "landline4",
        "marketAreaName",
        "hoa/poa?",
        "skype",
        "linkedIn",
        "instagram",
        "detailsDescription",
        "tags",
        "detailsLegalDescription",
        "addressLine1",
        "city",
        "county",
        "state",
        "email",
        "jobTitle",
        "otherPhone",
        "smsOptOut",
        "website",
        "facebook",
        "twitter",
        "addressLine2",
        "zipCode",
        "country",
    ];

    const Title = [
        "First Name",
        "Last Name",
        "Mobile",
        "Country Link",
        "Acres",
        "Phone",
        "Owner",
        "Email 2",
        "Type",
        "Mailing Street Address",
        "Email Opt Out",
        "Mailing City",
        "Mailing State",
        "Email Opt Out Reason",
        "Mailing Zip",
        "Mailing Country",
        "Subdivision",
        "APN",
        "Google Map Link",
        "Road Frontage",
        "Redfin Quick Link",
        "Opening Bid",
        "Assessed Value",
        "Assessed vs. Opening Bid Margin (manual)",
        "Assessed vs. Opening Bid Multiple (manual)",
        "Wetlands Status",
        "Legal Description",
        "Legal Subdivision",
        "Flood Zone",
        "Topography",
        "Wireless 1",
        "Wireless 2",
        "Wireless 3",
        "Wireless 4",
        "Landline 1",
        "Landline 2",
        "Landline 3",
        "Landline 4",
        "MarketAreaName",
        "HOA/ POA?",
        "Skype",
        "LinkedIn",
        "Instagram",
        "Details Description",
        "Tags",
        "Details Legal Description",
        "Address Line 1",
        "City",
        "County",
        "State",
        "Email",
        "Job Title",
        "Other Phone",
        "SMS Opt Out",
        "Website",
        "Facebook",
        "Twitter",
        "Address Line 2",
        "ZipCode",
        "Country",
    ];

    useEffect(() => {
        if (receivedData.length > 0) {
            const mappeddata = receivedData.map((item) => {
                const dataToArray = Object.entries(item);
                const filteredData = dataToArray.filter(([key, value]) => {
                    return mergeData.includes(key);
                });

                const filteredDataObject = Object.fromEntries(filteredData);

                return filteredDataObject;
            });

            const dataToArray = Object.entries(receivedData[0]);
            const filteredData = dataToArray.filter(([key, value]) => {
                return mergeData.includes(key);
            });

            // const title = Object.keys(mappeddata[0]);

            // console.log("asdasda", mappeddata);
            let new_data = {};

            new_data = { title: Title };

            let keysWithTitle: any = [["title", "Master Record"]];

            mappeddata.forEach((item, index) => {
                let temp_array = Object.values(item);
                let key_element = "contact_" + index;

                keysWithTitle.push([
                    key_element,
                    item.firstName + " " + item.lastName,
                ]);

                new_data = { ...new_data, [key_element]: temp_array };
            });

            const keys = Object.keys(new_data);
            const result: Object[] = [];

            for (let i = 0; i < Title.length; i++) {
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

            // let keysData = Object.keys(result[0]);
            setTableDataKeys(keysWithTitle);
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
        console.log(allVariable);
    }, [allVariable]);
    const handleOnchangeRadio = (record: any, key: React.Key) => {
        setAllVariables((prevAllVariables) => ({
            ...prevAllVariables,
            [record["title"]]: record[key],
        }));
    };

    const handleCheckedRadio = (record: any, key: React.Key) => {
        if (Object.keys(allVariable).length) {
            return allVariable[record["title"]] === record[key] ? true : false;
        }
    };

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
                                                dataIndex={item[0]}
                                                title={item[1]}
                                                render={(text, record) => {
                                                    if (item[0] === "title") {
                                                        return (
                                                            <span>{text}</span>
                                                        );
                                                    } else {
                                                        return (
                                                            <Radio
                                                                key={key}
                                                                checked={handleCheckedRadio(
                                                                    record,
                                                                    item[0]
                                                                )}
                                                                onChange={() => {
                                                                    handleOnchangeRadio(
                                                                        record,
                                                                        item[0]
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
                        <Typography.Title level={5} className="m-t-lg">
                            Please note the following.
                        </Typography.Title>
                        <ul>
                            <li>
                                The attachments, activities and notes will be
                                transferred to the master Contact.
                            </li>
                            <li>The action can't be reverted.</li>
                        </ul>
                        <Button type="primary" className="m-r-sm">
                            I Understand, Merge Now
                        </Button>
                        <Button>Cancel</Button>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MergeContacts;
