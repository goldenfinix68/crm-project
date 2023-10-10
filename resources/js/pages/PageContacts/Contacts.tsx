import React, { useEffect, useState } from "react";
import {
    Button,
    Popconfirm,
    Space,
    Row,
    Card,
    Table,
    Col,
    Select,
    Tabs,
    Typography,
    Menu,
    Dropdown,
    Input,
    notification,
} from "antd";
import {
    CheckCircleOutlined,
    FunnelPlotOutlined,
    TableOutlined,
    PlusCircleOutlined,
    LockOutlined,
    CaretDownOutlined,
    CloseOutlined,
    SaveOutlined,
    ExportOutlined,
    CopyOutlined,
    MailOutlined,
    MobileOutlined,
    UnorderedListOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import ContactsComponentsAddContacts from "./Components/ContactsComponentsAddContacts";
import ContactsComponentsManageColumn from "./Components/ContactsComponentsManageColumn";
import { useContactsTableColumn } from "../../api/query/contactsQuery";
import { useUserFavorites } from "../../api/query/userQuery";

import { useMutation } from "react-query";
import { TContact } from "../../entities";
import { deleteContactMutation } from "../../api/mutation/useContactMutation";
import queryClient from "../../queryClient";
import { useNavigate } from "react-router";
import ContactsComponentsTableEditableCell from "./Components/ContactsComponentsTableEditableCell";
import ContactsComponentsTableEditableCellTags from "./Components/ContactsComponentsTableEditableCellTags";
import ContactsComponentsTableEditableCellName from "./Components/ContactsComponentsTableEditableCellName";
import ContactsComponentsUpdate from "./Components/ContactsComponentsUpdate";
import Papa from "papaparse";
import {
    useContactAddFavorite,
    useContactDeleteFavorite,
} from "../../api/mutation/useContactMutation";
import ContactsComponentsAddtoList from "./Components/ContactsComponentsAddtoList";
import SendToManyModal from "../../components/SentToManyModal";
import HeaderMenu from "./Components/HeaderMenu";
import { useAppContextProvider } from "../../context/AppContext";
import { CONTACT_COLUMNS, CONTACT_LIST_ACTION } from "../../constants";
import Filter from "../Deal/components/Filter";

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

interface ListItem {
    id: string;
    title: string;
    key: string;
}

const { Option } = Select;
const { TabPane } = Tabs;

const handleTabChange = (key) => {
    // Handle tab change event
    console.log("Selected tab:", key);
};
const { Search } = Input;

// const menu = (

// );

const Contacts = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [isTContact, setTContact] = useState<TContact | null>(null);

    const { contacts, refetchContacts } = useAppContextProvider();
    const { favorites, isLoadingFavorites, refetchFavorites } =
        useUserFavorites();
    const { contactsTable, isLoadingContactsTable, refetchContactsTable } =
        useContactsTableColumn();
    const [isModalOpen, setisModalOpen] = useState(false);
    const [isModalManageColumnOpen, setIsModalManageColumnOpen] =
        useState(false);
    const [open, setOpen] = useState(true);
    const [isTitle, setTitle] = useState("");

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [currentActiveCell, setCurrentActiveCell] = useState("");
    const [currentBtnActive, setCurrentBtnActive] = useState("");
    const [currentActiveType, setCurrentActiveType] = useState("");

    const [isModalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isModalOpenAddList, setisModalOpenAddlist] = useState(false);

    const [isSendToManyModalOpen, setIsSendToManyModalOpen] = useState(false);

    const [listData, setListData] = useState<ListItem[]>([]);

    const initialColumns = [
        { id: "50", title: "Name", key: "name" },
        { id: "51", title: "Email", key: "email" },
        { id: "2", title: "Mobile", key: "mobile" },
        { id: "3", title: "Country Link", key: "countryLink" },
        { id: "4", title: "Acres", key: "acres" },
        { id: "44", title: "Tags", key: "tags" },
        { id: "6", title: "Owner", key: "owner" },
        { id: "0", title: "First Name", key: "firstName" },
        { id: "1", title: "Last Name", key: "lastName" },
    ];

    const resetFields = () => {
        setListData(initialColumns);
    };

    const cancelFields = () => {
        console.log(";asdasdsads", columnData);
        setListData(columnData);
    };

    useEffect(() => {
        if (listData.length > 0) {
            console.log("dsfsdfs");
        }
    }, [listData]);

    const handleEdit = (record: TContact) => {
        setTContact(record);
    };

    useEffect(() => {
        console.log(filter);

        refetchContacts();
    }, [filter]);

    const favoriteTitle = {
        "all-contacts": "All Contacts",
        "my-contacts": "My Contacts",
        "new-last-week": "New last week",
        "new-this-week": "New this week",
        "recent-modified-contact": "Recently modified contacts",
    };

    const columns: ColumnsType<TContact> = [
        {
            key: "name",
            title: "Name",
            dataIndex: "name",
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCellName
                    type="name"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    recordTypeFirst={record.firstName ?? null}
                    recordTypeLast={record.lastName ?? null}
                    setCurrentActiveType={setCurrentActiveType}
                    currentActiveType={currentActiveType}
                    setisModalOpen={setisModalOpen}
                    setTContact={setTContact}
                    setTitle={setTitle}
                    navigate={navigate}
                />
            ),
            sorter: (a, b) => a.firstName.length - b.firstName.length,
            defaultSortOrder: "descend",
            fixed: "left",
            width: 400,
            className: "custom-table-cell",
        },
        {
            key: "email",
            title: "Email",
            dataIndex: "email",
            width: 250,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="email"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    recordType={record.email ?? null}
                    setCurrentActiveType={setCurrentActiveType}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mobile",
            title: "Mobile",
            dataIndex: "mobile",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mobile"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mobile ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "countryLink",
            title: "Country Link",
            dataIndex: "countryLink",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="countryLink"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.countryLink ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "acres",
            title: "Acres",
            dataIndex: "acres",
            width: 150,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="acres"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.acres ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (text: string, record: TContact) => (
                <>
                    {/* {record.firstName} */}
                    {/* {record &&
                        record.tags &&
                        record.tags.length > 0 &&
                        record.tags.map((tag) => (
                            <Tag color="blue" key={tag}>
                                {tag}
                            </Tag>
                        ))} */}

                    <ContactsComponentsTableEditableCellTags
                        type="tags"
                        setCurrentActiveCell={setCurrentActiveCell}
                        currentActiveCell={currentActiveCell}
                        setCurrentBtnActive={setCurrentBtnActive}
                        currentBtnActive={currentBtnActive}
                        record={record}
                        setCurrentActiveType={setCurrentActiveType}
                        recordType={record.tags ?? null}
                        currentActiveType={currentActiveType}
                    />
                </>
            ),
            width: 250,
        },
        {
            key: "owner",
            title: "Owner",
            dataIndex: "owner",
            width: 200,
        },
        {
            key: "firstName",
            title: "First Name",
            dataIndex: "firstName",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="firstName"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.firstName ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },

        {
            key: "lastName",
            title: "Last Name",
            dataIndex: "lastName",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="lastName"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.lastName ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },

        {
            key: "jobTitle",
            title: "Job Title",
            dataIndex: "jobTitle",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="jobTitle"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.jobTitle ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "phone",
            title: "Phone",
            dataIndex: "phone",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="phone"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.phone ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },

        {
            key: "otherPhone",
            title: "Other Phone",
            dataIndex: "otherPhone",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="otherPhone"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.otherPhone ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "email2",
            title: "Email2",
            dataIndex: "email2",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="email2"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.email2 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "typeId",
            title: "Type",
            dataIndex: "typeId",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="typeId"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.typeId ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mailingStreetAddress",
            title: "Mailing Street Address",
            dataIndex: "mailingStreetAddress",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mailingStreetAddress"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mailingStreetAddress ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "emailOptOut",
            title: "Email Opt Out",
            dataIndex: "emailOptOut",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="emailOptOut"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.emailOptOut ? "Yes" : "No"}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mailingCity",
            title: "Mailing City",
            dataIndex: "mailingCity",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mailingCity"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mailingCity ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mailingCountry",
            title: "Mailing Country",
            dataIndex: "mailingCountry",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mailingCountry"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mailingCountry ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "subdivision",
            title: "Subdivision",
            dataIndex: "subdivision",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="subdivision"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.subdivision ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "subdivision",
            title: "Subdivision",
            dataIndex: "subdivision",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="subdivision"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.subdivision ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "APN",
            title: "APN",
            dataIndex: "APN",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="APN"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.APN ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "gMapLink",
            title: "Google Map Link",
            dataIndex: "gMapLink",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="gMapLink"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.gMapLink ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "roadFrontage",
            title: "Road Frontage",
            dataIndex: "roadFrontage",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="roadFrontage"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.roadFrontage ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "redfinLink",
            title: "Redfin Quick Link",
            dataIndex: "redfinLink",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="redfinLink"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.redfinLink ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "redfinLink",
            title: "Redfin Quick Link",
            dataIndex: "redfinLink",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="redfinLink"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.redfinLink ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "openingBid",
            title: "Opening Bid",
            dataIndex: "openingBid",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="openingBid"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.openingBid ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "assessedValue",
            title: "Assessed Value",
            dataIndex: "assessedValue",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="assessedValue"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.assessedValue ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "assessedVsOpeningMargin",
            title: "Assessed vs. Opening Bid Margin (manual)",
            dataIndex: "assessedVsOpeningMargin",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="assessedVsOpeningMargin"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.assessedVsOpeningMargin ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "assessedVsOpeningMargin",
            title: "Assessed vs. Opening Bid Margin (manual)",
            dataIndex: "assessedVsOpeningMargin",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="assessedVsOpeningMargin"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.assessedVsOpeningMargin ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "assessedVsOpeningMultiple",
            title: "Assessed vs. Opening Bid Multiple (manual)",
            dataIndex: "assessedVsOpeningMultiple",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="assessedVsOpeningMultiple"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.assessedVsOpeningMultiple ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "legalDescription",
            title: "Legal Description",
            dataIndex: "legalDescription",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="legalDescription"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.legalDescription ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "legalSubdivision",
            title: "Subdivision",
            dataIndex: "legalSubdivision",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="legalSubdivision"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.legalSubdivision ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "floodzone",
            title: "Flood Zone",
            dataIndex: "floodzone",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="floodzone"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.floodzone ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "topography",
            title: "Topography",
            dataIndex: "topography",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="topography"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.topography ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "wireless1",
            title: "Wireless 1",
            dataIndex: "wireless1",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="wireless1"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.wireless1 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "wireless2",
            title: "Wireless 2",
            dataIndex: "wireless2",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="wireless2"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.wireless2 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "wireless3",
            title: "Wireless 3",
            dataIndex: "wireless3",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="wireless3"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.wireless3 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "wireless4",
            title: "Wireless 4",
            dataIndex: "wireless4",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="wireless4"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.wireless4 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "landline1",
            title: "Landline 1",
            dataIndex: "landline1",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="landline1"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.landline1 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "landline2",
            title: "Landline 2",
            dataIndex: "landline2",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="landline2"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.landline2 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "landline3",
            title: "Landline 3",
            dataIndex: "landline3",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="landline3"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.landline3 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "landline4",
            title: "Landline 4",
            dataIndex: "landline4",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="landline4"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.landline4 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "marketAreaName",
            title: "MarketAreaName",
            dataIndex: "marketAreaName",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="marketAreaName"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.marketAreaName ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "skype",
            title: "Skype",
            dataIndex: "skype",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="skype"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.skype ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "website",
            title: "Website",
            dataIndex: "website",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="website"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.website ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "facebook",
            title: "Facebook",
            dataIndex: "facebook",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="facebook"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.facebook ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "linkedIn",
            title: "LinkedIn",
            dataIndex: "linkedIn",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="linkedIn"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.linkedIn ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "twitter",
            title: "Twitter",
            dataIndex: "twitter",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="twitter"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.twitter ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "instagram",
            title: "Instagram",
            dataIndex: "instagram",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="instagram"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.instagram ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "detailsDescription",
            title: "Details Description",
            dataIndex: "detailsDescription",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="detailsDescription"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.detailsDescription ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "detailsLegalDescription",
            title: "Legal Description",
            dataIndex: "detailsLegalDescription",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="detailsLegalDescription"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.detailsLegalDescription ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "addressLine1",
            title: "Address Line 1",
            dataIndex: "addressLine1",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="addressLine1"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.addressLine1 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "addressLine2",
            title: "Address Line 2",
            dataIndex: "addressLine2",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="addressLine2"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.addressLine2 ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "city",
            title: "City",
            dataIndex: "city",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="city"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.city ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "country",
            title: "Country",
            dataIndex: "country",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="country"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.country ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "zipCode",
            title: "Zip Code",
            dataIndex: "zipCode",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="zipCode"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.zipCode ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "state",
            title: "State",
            dataIndex: "state",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="state"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.state ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mailingState",
            title: "Mailing State",
            dataIndex: "mailingState",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mailingState"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mailingState ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "smsOptOut",
            title: "SMS Opt Out",
            dataIndex: "smsOptOut",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="smsOptOut"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.smsOptOut ? "Yes" : "No"}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "emailOptOutReason",
            title: "Email Opt Out Reason",
            dataIndex: "emailOptOutReason",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="emailOptOutReason"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.emailOptOutReason ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "mailingZip",
            title: "Mailing Zip",
            dataIndex: "mailingZip",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="mailingZip"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.mailingZip ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "wetlandsStatus",
            title: "Wetlands Status",
            dataIndex: "wetlandsStatus",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="wetlandsStatus"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.wetlandsStatus ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
        {
            key: "county",
            title: "County",
            dataIndex: "county",
            width: 200,
            render: (text: string, record: TContact) => (
                <ContactsComponentsTableEditableCell
                    type="county"
                    setCurrentActiveCell={setCurrentActiveCell}
                    currentActiveCell={currentActiveCell}
                    setCurrentBtnActive={setCurrentBtnActive}
                    currentBtnActive={currentBtnActive}
                    record={record}
                    setCurrentActiveType={setCurrentActiveType}
                    recordType={record.county ?? null}
                    currentActiveType={currentActiveType}
                />
            ),
        },
    ];

    const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
        "checkbox"
    );
    const [selectedRowsData, setSelectedRows] = useState<React.Key[]>([]);
    const [selectedData, setSelectedData] = useState<TContact[]>([]);

    const onSelectChange = (
        selectedRowKeys: React.Key[],
        selectedRows: TContact[]
    ) => {
        console.log(selectedRowKeys);
        console.log(selectedRows);
        setSelectedData(selectedRows);
        setSelectedRows(selectedRowKeys);

        // setSelectionType(selectedRows);
    };

    useEffect(() => {
        setShowDeleteButton(
            selectedRowsData && selectedRowsData.length > 0 ? true : false
        );
    }, [selectedRowsData]);

    const rowSelection = {
        selectedRowKeys: selectedRowsData,
        onChange: onSelectChange,

        // setSelectionType(selectedRows);
    };

    const deleteContact = useMutation(deleteContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            setShowDeleteButton(false);
        },
    });

    const handleDelete = () => {
        deleteContact.mutate({ userId: selectedRowsData });
    };

    const [isFavorite, setIsFavorite] = useState<string[]>([]);

    const addFavorite = useMutation(useContactAddFavorite, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("contacts");
        },
    });
    const deleteFavorite = useMutation(useContactDeleteFavorite, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("contacts");
        },
    });

    const handleFavoriteClick = (value) => {
        console.log("val", value);
        let isFavoriteVar = [...isFavorite];

        if (!isFavoriteVar.includes(value)) {
            isFavoriteVar.push(value);

            addFavorite.mutate({ name: value });
        } else {
            let index = isFavoriteVar.findIndex((x) => x === value);
            isFavoriteVar.splice(index, 1);

            deleteFavorite.mutate({ name: value });
        }

        setIsFavorite(isFavoriteVar);
    };

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleItemClick = (item: string) => {
        setDropdownVisible(false);
    };

    const handleExportCSV = () => {
        const tableData = selectedData.map((item) => ({
            Name: item.firstName + " " + item.lastName,
            Email: item.email,
            Mobile: item.mobile,
            CountryLink: item.countryLink,
            Acres: item.acres,
            Tags: item.tags,
            Owner: item.owner,
            FirstName: item.firstName,
            LastName: item.lastName,
        }));

        // Get the current timestamp in the user's local time zone
        const timestamp = new Date().toLocaleString();

        // Format the timestamp to be suitable for a filename
        const formattedTimestamp = timestamp.replace(/[\s:]/g, "-");

        const fileName = `Speedlead_Export_${formattedTimestamp}.csv`; // Add timestamp to the filename
        const csvData = Papa.unparse(tableData, { header: true });
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", fileName);
        link.click();
    };

    useEffect(() => {
        if (favorites) {
            console.log("asdads");

            if (favorites.length > 0) {
                let isFavoriteVar: any = [];
                console.log("deals", favorites);

                favorites.forEach((element: any) => {
                    isFavoriteVar.push(element.name);
                });

                setIsFavorite(isFavoriteVar);
            }
        }
    }, [favorites]);

    const [orderedColumns, setOrderedColumns] = useState<any>();
    const [columnData, setColumnData] = useState<any>();

    useEffect(() => {
        if (contactsTable && contactsTable[0]) {
            let data = JSON.parse(contactsTable[0].table_columns);

            var newOrderedColumns = data.map((item: any) => {
                let findColumn = columns.find(
                    (column) => column.key === Object.values(item)[2]
                );

                if (findColumn) {
                    console.log("findColumn 1213123", findColumn);
                    return findColumn;
                }
            });

            // newOrderedColumns.forEach((element) => {
            //     console.log("asdasd", element);
            // });

            newOrderedColumns = newOrderedColumns.filter((item) => {
                return item != undefined;
            });

            setOrderedColumns(newOrderedColumns);
            setColumnData(data);
            setListData(data);
        } else {
            var newOrderedColumns: any = initialColumns.map((item: any) => {
                return columns.find(
                    (column) => column.key === Object.values(item)[2]
                );
            });
            setOrderedColumns(newOrderedColumns);
            setColumnData(initialColumns);
            setListData(initialColumns);
            console.log("aweawe");
        }
    }, [contactsTable]);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const onSearch = (query: string) => {
        setSearchQuery(query);
    };

    const search = (menuItems: string[], query: string) => {
        return menuItems.filter((item) => {
            const title = favoriteTitle[item];
            return title.toLowerCase().includes(query.toLowerCase());
        });
    };

    const filteredFavoriteItems = search(isFavorite, searchQuery);

    return (
        <Space direction="vertical" className="w-100">
            <HeaderMenu />
            <Card>
                {showDeleteButton ? (
                    <Row style={{ alignItems: "center", marginBottom: "20px" }}>
                        <Button
                            icon={<CloseOutlined />}
                            type="text"
                            className="m-r-md"
                            onClick={() => {
                                setSelectedRows([]);
                                setShowDeleteButton(false);
                            }}
                        ></Button>
                        <Typography.Text className="m-r-md">
                            {selectedRowsData?.length + " Selected"}
                        </Typography.Text>
                        <Popconfirm
                            title="Delete Contact"
                            description="Are you sure to delete this contact?"
                            onConfirm={() => {
                                handleDelete();
                            }}
                        >
                            <Button type="primary" danger className="m-r-sm">
                                Delete
                            </Button>
                        </Popconfirm>

                        <Button
                            onClick={() => {
                                setisModalOpenUpdate(true);
                            }}
                            icon={<SaveOutlined />}
                            className="m-r-sm"
                        >
                            Update
                        </Button>
                        <Button
                            icon={<ExportOutlined />}
                            className="m-r-sm"
                            onClick={() => {
                                handleExportCSV();
                            }}
                        >
                            Export
                        </Button>
                        <Button
                            icon={<CopyOutlined />}
                            className="m-r-sm"
                            onClick={() => {
                                if (
                                    selectedData.length >= 2 &&
                                    selectedData.length <= 3
                                ) {
                                    navigate(`/contacts/mergeContacts`, {
                                        state: { data: selectedData },
                                    });
                                } else {
                                    notification.warning({
                                        message:
                                            "Please select either two or three Contacts to merge",
                                    });
                                }
                            }}
                        >
                            Merge
                        </Button>
                        <Button icon={<MailOutlined />} className="m-r-sm">
                            Email
                        </Button>
                        <Button
                            icon={<MobileOutlined />}
                            className="m-r-sm"
                            onClick={() => setIsSendToManyModalOpen(true)}
                        >
                            Text
                        </Button>
                        <Button
                            icon={<CheckCircleOutlined />}
                            className="m-r-sm"
                        >
                            Create Activities
                        </Button>
                        <Button
                            icon={<UnorderedListOutlined />}
                            onClick={() => {
                                setisModalOpenAddlist(true);
                            }}
                        >
                            Add to List
                        </Button>
                    </Row>
                ) : (
                    <Row style={{ marginBottom: "20px" }}>
                        <Col md={12} lg={12}>
                            <Dropdown
                                visible={isDropdownVisible}
                                onVisibleChange={setDropdownVisible}
                                overlay={
                                    <Card style={{ width: "370px" }}>
                                        <Search
                                            placeholder="Search views"
                                            allowClear
                                            onSearch={onSearch}
                                            value={searchQuery}
                                            onChange={(e) =>
                                                onSearch(e.target.value)
                                            }
                                        />
                                        {!searchQuery ? (
                                            <Tabs
                                                defaultActiveKey="tab1"
                                                onChange={handleTabChange}
                                            >
                                                <TabPane
                                                    tab="FAVORITES"
                                                    key="tab1"
                                                >
                                                    {isFavorite.length > 0 ? (
                                                        <Menu
                                                            style={{
                                                                backgroundColor:
                                                                    "none",
                                                                boxShadow:
                                                                    "none",
                                                            }}
                                                            mode="inline"
                                                        >
                                                            {isFavorite.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <Menu.Item
                                                                            key={
                                                                                index
                                                                            }
                                                                            onClick={() => {
                                                                                setDropdownVisible(
                                                                                    false
                                                                                );
                                                                                setFilter(
                                                                                    item
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                favoriteTitle[
                                                                                    item
                                                                                ]
                                                                            }
                                                                        </Menu.Item>
                                                                    );
                                                                }
                                                            )}{" "}
                                                        </Menu>
                                                    ) : (
                                                        <Col
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                flexDirection:
                                                                    "column",
                                                            }}
                                                        >
                                                            <Typography.Title
                                                                level={5}
                                                            >
                                                                You have no
                                                                favorites
                                                            </Typography.Title>
                                                            <Typography.Text>
                                                                Select views as
                                                                favorites to
                                                                make it appear
                                                                here.
                                                            </Typography.Text>
                                                        </Col>
                                                    )}
                                                </TabPane>
                                                <TabPane
                                                    tab="ALL VIEWS"
                                                    key="tab2"
                                                >
                                                    <Menu
                                                        style={{
                                                            backgroundColor:
                                                                "none",
                                                            boxShadow: "none",
                                                        }}
                                                        mode="inline"
                                                        // defaultSelectedKeys={

                                                        // }
                                                        // defaultOpenKeys={["sub1"]}
                                                    >
                                                        <Typography.Text
                                                            className="m-b-sm"
                                                            strong
                                                        >
                                                            SYSTEM
                                                        </Typography.Text>
                                                        <Menu.Item
                                                            className="menuList"
                                                            key="item1"
                                                            icon={
                                                                <LockOutlined />
                                                            }
                                                        >
                                                            <Space>
                                                                <Button
                                                                    className="disableHover"
                                                                    style={{
                                                                        paddingLeft:
                                                                            "0px",
                                                                        width: "220px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "start",
                                                                    }}
                                                                    type="text"
                                                                    onClick={() => {
                                                                        setDropdownVisible(
                                                                            false
                                                                        );
                                                                        setFilter(
                                                                            "all-contacts"
                                                                        );
                                                                    }}
                                                                >
                                                                    All Contacts
                                                                </Button>
                                                                <Button
                                                                    className="disableHover"
                                                                    type="text"
                                                                    onClick={() => {
                                                                        console.log(
                                                                            "click"
                                                                        );

                                                                        handleFavoriteClick(
                                                                            "all-contacts"
                                                                        );
                                                                    }}
                                                                >
                                                                    {isFavorite.includes(
                                                                        "all-contacts"
                                                                    ) ? (
                                                                        <StarFilled />
                                                                    ) : (
                                                                        <StarOutlined />
                                                                    )}
                                                                </Button>
                                                            </Space>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            className="menuList"
                                                            key="item2"
                                                            icon={
                                                                <LockOutlined />
                                                            }
                                                        >
                                                            <Space>
                                                                <Button
                                                                    className="disableHover"
                                                                    style={{
                                                                        paddingLeft:
                                                                            "0px",
                                                                        width: "220px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "start",
                                                                    }}
                                                                    type="text"
                                                                    onClick={() => {
                                                                        setDropdownVisible(
                                                                            false
                                                                        );
                                                                        setFilter(
                                                                            "my-contacts"
                                                                        );
                                                                    }}
                                                                >
                                                                    My Contacts
                                                                </Button>
                                                                <Button
                                                                    className="disableHover"
                                                                    type="text"
                                                                    onClick={() => {
                                                                        handleFavoriteClick(
                                                                            "my-contacts"
                                                                        );
                                                                    }}
                                                                >
                                                                    {isFavorite.includes(
                                                                        "my-contacts"
                                                                    ) ? (
                                                                        <StarFilled />
                                                                    ) : (
                                                                        <StarOutlined />
                                                                    )}
                                                                </Button>
                                                            </Space>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            className="menuList"
                                                            key="item3"
                                                            icon={
                                                                <LockOutlined />
                                                            }
                                                        >
                                                            <Space>
                                                                <Button
                                                                    className="disableHover"
                                                                    style={{
                                                                        paddingLeft:
                                                                            "0px",
                                                                        width: "220px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "start",
                                                                    }}
                                                                    type="text"
                                                                    onClick={() => {
                                                                        setDropdownVisible(
                                                                            false
                                                                        );
                                                                        setFilter(
                                                                            "new-last-week"
                                                                        );
                                                                    }}
                                                                >
                                                                    New last
                                                                    week
                                                                </Button>

                                                                <Button
                                                                    className="disableHover"
                                                                    type="text"
                                                                    onClick={() => {
                                                                        handleFavoriteClick(
                                                                            "new-last-week"
                                                                        );
                                                                    }}
                                                                >
                                                                    {isFavorite.includes(
                                                                        "new-last-week"
                                                                    ) ? (
                                                                        <StarFilled />
                                                                    ) : (
                                                                        <StarOutlined />
                                                                    )}
                                                                </Button>
                                                            </Space>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            className="menuList"
                                                            key="4"
                                                            icon={
                                                                <LockOutlined />
                                                            }
                                                        >
                                                            <Space>
                                                                <Button
                                                                    className="disableHover"
                                                                    style={{
                                                                        paddingLeft:
                                                                            "0px",
                                                                        width: "220px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "start",
                                                                    }}
                                                                    type="text"
                                                                    onClick={() => {
                                                                        setDropdownVisible(
                                                                            false
                                                                        );
                                                                        setFilter(
                                                                            "new-this-week"
                                                                        );
                                                                    }}
                                                                >
                                                                    New this
                                                                    week
                                                                </Button>
                                                                <Button
                                                                    className="disableHover"
                                                                    type="text"
                                                                    onClick={() => {
                                                                        handleFavoriteClick(
                                                                            "new-this-week"
                                                                        );
                                                                    }}
                                                                >
                                                                    {isFavorite.includes(
                                                                        "new-this-week"
                                                                    ) ? (
                                                                        <StarFilled />
                                                                    ) : (
                                                                        <StarOutlined />
                                                                    )}
                                                                </Button>
                                                            </Space>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            className="menuList"
                                                            key="5"
                                                            icon={
                                                                <LockOutlined />
                                                            }
                                                        >
                                                            <Space>
                                                                <Button
                                                                    className="disableHover"
                                                                    style={{
                                                                        paddingLeft:
                                                                            "0px",
                                                                        width: "220px",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "start",
                                                                    }}
                                                                    type="text"
                                                                    onClick={() => {
                                                                        setDropdownVisible(
                                                                            false
                                                                        );
                                                                        setFilter(
                                                                            "recent-modified-contact"
                                                                        );
                                                                    }}
                                                                >
                                                                    Recently
                                                                    modified
                                                                    contacts
                                                                </Button>
                                                                <Button
                                                                    className="disableHover"
                                                                    type="text"
                                                                    onClick={() => {
                                                                        handleFavoriteClick(
                                                                            "recent-modified-contact"
                                                                        );
                                                                    }}
                                                                >
                                                                    {isFavorite.includes(
                                                                        "recent-modified-contact"
                                                                    ) ? (
                                                                        <StarFilled />
                                                                    ) : (
                                                                        <StarOutlined />
                                                                    )}
                                                                </Button>
                                                            </Space>
                                                        </Menu.Item>
                                                    </Menu>
                                                </TabPane>
                                            </Tabs>
                                        ) : (
                                            <>
                                                {Object.values(
                                                    favoriteTitle
                                                ).filter((item) =>
                                                    item
                                                        .toLocaleLowerCase()
                                                        .startsWith(
                                                            searchQuery.toLocaleLowerCase()
                                                        )
                                                ).length > 0 ? (
                                                    <>
                                                        <div className="m-t-md">
                                                            <Typography.Text>
                                                                {Object.values(
                                                                    favoriteTitle
                                                                ).filter(
                                                                    (item) =>
                                                                        item
                                                                            .toLocaleLowerCase()
                                                                            .startsWith(
                                                                                searchQuery.toLocaleLowerCase()
                                                                            )
                                                                ).length +
                                                                    " Result Found"}
                                                            </Typography.Text>
                                                        </div>
                                                        <div className="m-t-lg">
                                                            <Typography.Text
                                                                strong
                                                            >
                                                                SYSTEM
                                                            </Typography.Text>
                                                        </div>

                                                        <Menu
                                                            style={{
                                                                backgroundColor:
                                                                    "none",
                                                                boxShadow:
                                                                    "none",
                                                            }}
                                                            mode="inline"
                                                        >
                                                            {Object.values(
                                                                favoriteTitle
                                                            )
                                                                .filter(
                                                                    (item) =>
                                                                        item
                                                                            .toLocaleLowerCase()
                                                                            .startsWith(
                                                                                searchQuery.toLocaleLowerCase()
                                                                            )
                                                                )
                                                                .map((item) => {
                                                                    return (
                                                                        <Menu.Item
                                                                            className="menuList"
                                                                            key={
                                                                                item
                                                                            }
                                                                            icon={
                                                                                <LockOutlined />
                                                                            }
                                                                        >
                                                                            <Space>
                                                                                <Button
                                                                                    className="disableHover"
                                                                                    style={{
                                                                                        paddingLeft:
                                                                                            "0px",
                                                                                        width: "220px",
                                                                                        display:
                                                                                            "flex",
                                                                                        alignItems:
                                                                                            "start",
                                                                                    }}
                                                                                    type="text"
                                                                                    onClick={() => {
                                                                                        let objkey =
                                                                                            Object.fromEntries(
                                                                                                Object.entries(
                                                                                                    favoriteTitle
                                                                                                ).filter(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) =>
                                                                                                        value.toLocaleLowerCase() ==
                                                                                                        item.toLocaleLowerCase()
                                                                                                )
                                                                                            );

                                                                                        let finalKey =
                                                                                            Object.keys(
                                                                                                objkey
                                                                                            );

                                                                                        setDropdownVisible(
                                                                                            false
                                                                                        );
                                                                                        setFilter(
                                                                                            finalKey[0]
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        item
                                                                                    }
                                                                                </Button>
                                                                                <Button
                                                                                    className="disableHover"
                                                                                    type="text"
                                                                                    onClick={() => {
                                                                                        let objkey =
                                                                                            Object.fromEntries(
                                                                                                Object.entries(
                                                                                                    favoriteTitle
                                                                                                ).filter(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) =>
                                                                                                        value.toLocaleLowerCase() ==
                                                                                                        item.toLocaleLowerCase()
                                                                                                )
                                                                                            );

                                                                                        let finalKey =
                                                                                            Object.keys(
                                                                                                objkey
                                                                                            );

                                                                                        console.log(
                                                                                            "asdasdsa",
                                                                                            Object.fromEntries(
                                                                                                Object.entries(
                                                                                                    favoriteTitle
                                                                                                ).filter(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) =>
                                                                                                        value.toLocaleLowerCase() ==
                                                                                                        item.toLocaleLowerCase()
                                                                                                )
                                                                                            )[0]
                                                                                        );
                                                                                        handleFavoriteClick(
                                                                                            finalKey[0]
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {isFavorite.includes(
                                                                                        Object.keys(
                                                                                            Object.fromEntries(
                                                                                                Object.entries(
                                                                                                    favoriteTitle
                                                                                                ).filter(
                                                                                                    ([
                                                                                                        key,
                                                                                                        value,
                                                                                                    ]) =>
                                                                                                        value.toLocaleLowerCase() ==
                                                                                                        item.toLocaleLowerCase()
                                                                                                )
                                                                                            )
                                                                                        )[0]
                                                                                    ) ? (
                                                                                        <StarFilled />
                                                                                    ) : (
                                                                                        <StarOutlined />
                                                                                    )}
                                                                                </Button>
                                                                            </Space>
                                                                        </Menu.Item>
                                                                    );
                                                                })}
                                                        </Menu>
                                                    </>
                                                ) : (
                                                    <div className="noResult m-t-lg">
                                                        <Typography.Title
                                                            level={5}
                                                        >
                                                            No custom view found
                                                        </Typography.Title>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </Card>
                                }
                                trigger={["click"]}
                            >
                                <Button
                                    className="ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                    icon={<FunnelPlotOutlined />}
                                >
                                    All Contacts <CaretDownOutlined />
                                </Button>
                            </Dropdown>
                        </Col>
                        <Col
                            md={12}
                            lg={12}
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                style={{
                                    marginRight: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                <FunnelPlotOutlined />
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                style={{
                                    marginRight: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                onClick={() => {
                                    setisModalOpen(true);
                                    setTitle("Add Contact");
                                }}
                            >
                                Contact
                            </Button>
                            <Button
                                onClick={() => setIsModalManageColumnOpen(true)}
                                style={{
                                    marginRight: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <TableOutlined />
                            </Button>
                            <Select
                                dropdownClassName="dropdown-select"
                                defaultValue="Action"
                            >
                                {CONTACT_LIST_ACTION.map((action) => (
                                    <Select.Option
                                        value={action.value}
                                        disabled={action.disabled}
                                    >
                                        {action.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col md={24} lg={24}>
                        <Table
                            className="tableCell"
                            rowSelection={{
                                type: selectionType,
                                ...rowSelection,
                            }}
                            rowKey={(record) => record.id}
                            columns={orderedColumns ? orderedColumns : columns}
                            // columns={columns}
                            dataSource={contacts}
                            scroll={{ x: 1300 }}
                        />
                    </Col>
                </Row>

                <ContactsComponentsAddContacts
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setisModalOpen}
                    record={isTContact}
                    title={isTitle}
                    setTContact={setTContact}
                />

                <Filter
                    openFilter={open}
                    setOpenFilter={setOpen}
                    columns={CONTACT_COLUMNS}
                />

                <ContactsComponentsUpdate
                    isModalOpenUpdate={isModalOpenUpdate}
                    setisModalOpenUpdate={setisModalOpenUpdate}
                    record={isTContact}
                    title={isTitle}
                    selectedData={selectedData}
                    setTContact={setTContact}
                />
                <ContactsComponentsAddtoList
                    isModalOpenAddList={isModalOpenAddList}
                    setisModalOpenAddList={setisModalOpenAddlist}
                    record={isTContact}
                    title={isTitle}
                    selectedData={selectedData}
                    setTContact={setTContact}
                />
                <ContactsComponentsAddContacts
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setisModalOpen}
                    record={isTContact}
                    title={isTitle}
                    setTContact={setTContact}
                />
                <ContactsComponentsManageColumn
                    isModalManageColumnOpen={isModalManageColumnOpen}
                    setIsModalManageColumnOpen={setIsModalManageColumnOpen}
                    listData={listData}
                    setListData={setListData}
                    refetchContactsTable={refetchContactsTable}
                    contactsTable={contactsTable}
                    resetFields={resetFields}
                    cancelFields={cancelFields}
                />

                <SendToManyModal
                    isModalOpen={isSendToManyModalOpen}
                    closeModal={() => setIsSendToManyModalOpen(false)}
                    contacts={(selectedData as any) ?? []}
                />
            </Card>
        </Space>
    );
};

export default Contacts;
