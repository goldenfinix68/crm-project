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
import { mergeContactMutation } from "../../api/mutation/useContactMutation";
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
        "typeId",
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

    const titleEq = {
        firstName: "First Name",
        lastName: "Last Name",
        mobile: "Mobile",
        countryLink: "Country Link",
        acres: "Acres",
        phone: "Phone",
        owner: "Owner",
        email2: "Email 2",
        typeId: "Type",
        mailingStreetAddress: "Mailing Street Address",
        emailOptOut: "Email Opt Out",
        mailingCity: "Mailing City",
        mailingState: "Mailing State",
        emailOptOutReason: "Email Opt Out Reason",
        mailingZip: "Mailing Zip",
        mailingCountry: "Mailing Country",
        subdivision: "Subdivision",
        APN: "APN",
        gMapLink: "Google Map Link",
        roadFrontage: "Road Frontage",
        redfinLink: "Redfin Quick Link",
        openingBid: "Opening Bid",
        assessedValue: "Assessed Value",
        assessedVsOpeningMargin: "Assessed vs. Opening Bid Margin (manual)",
        assessedVsOpeningMultiple: "Assessed vs. Opening Bid Multiple (manual)",
        wetlandsStatus: "Wetlands Status",
        legalDescription: "Legal Description",
        legalSubdivision: "Legal Subdivision",
        floodzone: "Flood Zone",
        topography: "Topography",
        wireless1: "Wireless 1",
        wireless2: "Wireless 2",
        wireless3: "Wireless 3",
        wireless4: "Wireless 4",
        landline1: "Landline 1",
        landline2: "Landline 2",
        landline3: "Landline 3",
        landline4: "Landline 4",
        marketAreaName: "MarketAreaName",
        "hoa/poa": "HOA/ POA?",
        skype: "Skype",
        linkedIn: "LinkedIn",
        instagram: "Instagram",
        detailsDescription: "Details Description",
        tags: "Tags",
        detailsLegalDescription: "Details Legal Description",
        addressLine1: "Address Line 1",
        city: "City",
        county: "County",
        state: "State",
        email: "Email",
        jobTitle: "Job Title",
        otherPhone: "Other Phone",
        smsOptOut: "SMS Opt Out",
        website: "Website",
        facebook: "Facebook",
        twitter: "Twitter",
        addressLine2: "Address Line 2",
        zipCode: "ZipCode",
        country: "Country",
    };

    const keyWithBoolean = ["emailOptOut", "floodzone", "smsOptOut"];

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
            const id = receivedData.map((item) => item.id);
            setSelectedID(id);

            const dataToArray = Object.entries(receivedData[0]);
            const filteredData = dataToArray.filter(([key, value]) => {
                return mergeData.includes(key);
            });

            const title = Object.keys(mappeddata[0]);

            // console.log("asdasda", mappeddata);
            let new_data = {};

            new_data = { title: title };

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
    const [selectedID, setSelectedID] = useState();

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

    const mergeContact = useMutation(mergeContactMutation, {
        onSuccess: () => {
            console.log("success");
            navigate(`/contacts`);
            queryClient.invalidateQueries("contacts");
        },
    });

    const handleMerge = () => {
        let data = {
            data: allVariable,
            id: selectedID,
        };
        mergeContact.mutate(data);
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
                                                            <span>
                                                                {titleEq[text]}
                                                            </span>
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
                                                                    console.log(
                                                                        "asdadasd",
                                                                        record &&
                                                                            record[
                                                                                "title"
                                                                            ]
                                                                    );
                                                                    handleOnchangeRadio(
                                                                        record,
                                                                        item[0]
                                                                    );
                                                                }}
                                                            >
                                                                {keyWithBoolean.includes(
                                                                    record &&
                                                                        record[
                                                                            "title"
                                                                        ]
                                                                )
                                                                    ? text == 1
                                                                        ? "Yes"
                                                                        : "No"
                                                                    : text}
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
                        <Button
                            type="primary"
                            className="m-r-sm"
                            onClick={() => {
                                handleMerge();
                            }}
                        >
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
