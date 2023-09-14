import {
    Card,
    Button,
    Dropdown,
    Space,
    Radio,
    Tooltip,
    MenuProps,
    Tabs,
    Menu,
    Row,
    Col,
    List,
    notification,
    Typography,
    Collapse,
    theme,
    Input,
    Divider,
    Form,
    Select,
    DatePicker,
    TimePicker,
    message,
    Upload,
    Popconfirm,
    Tag,
    Descriptions,
} from "antd";
import axios from "axios";
import type { UploadProps } from "antd";
import type { CollapseProps } from "antd";
import type { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import validateRules from "../../providers/validateRules";

dayjs.extend(customParseFormat);
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import {
    faList,
    faPhoneVolume,
    faUsers,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";
import type { TabsProps } from "antd";
import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    UserAddOutlined,
    PlusCircleOutlined,
    DownOutlined,
    InsertRowBelowOutlined,
    FilterOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    HolderOutlined,
    CloseOutlined,
    PlusCircleFilled,
    PlusSquareOutlined,
    LikeOutlined,
    DislikeOutlined,
    CaretRightOutlined,
    CheckCircleOutlined,
    CalculatorOutlined,
    CalendarOutlined,
    InboxOutlined,
    UploadOutlined,
    PaperClipOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import { useDealsAll, useDealsByid } from "../../api/query/dealQuery";
import {
    useContactsList,
    useDealsList,
    useUsersList,
} from "../../api/query/activityQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    useDealMutationAddNotes,
    useDealMutationDeleteNotes,
    useDealMutationDeleteActivity,
    useDealMutationDeleteFile,
    useDealMutationAddParticipant,
    useDealMutationDeleteParticipants,
    useDealMutationAddTeammate,
    useDealMutationDeleteTeammate,
    useDealMutationUpdateStage,
    useDealMutationDeleteDeal,
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import DealsTable from "./components/DealsTable";
import type { SelectProps } from "antd";
import Resizer from "react-image-file-resizer";
import { addActivityMutation } from "../../api/mutation/useActivityMutation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ModalWonDeal from "./components/ModalWonDeal";
import ModalLostDeal from "./components/ModalLostDeal";
import ModalAddQuitContact from "./components/ModalAddQuitContact";
import {
    useContactTypesAll,
    useContactsAll,
    useGetContact,
} from "../../api/query/contactsQuery";
import ContactsWall from "../ContactView/components/ContactsWall";
import ContactContext from "../ContactView/context";
import LoadingComponent from "../../components/LoadingComponent";
import ActionsTabs from "../ContactView/components/ActionsTabs";
import ModalAddDeal from "./components/ModalAddDeal";
interface TDeals {
    id: number;
    title: string;
    name: string;
    value: string;
    stage: string;
    status: string;
    owner: string;
}
interface DealsById {
    title: string;
    win_probabilty: string;
    owner: string;
    estimated_close_date: string;
    value: string;
    currency: string;
    pipeline: string;
    source: string;
    stage: string;
    priority: string;
    status: string;
    details: string;
}

interface Props {
    match: any;
}

function POST_FILE(url: any) {
    const accessToken = localStorage.getItem("access_token");
    return useMutation((data: any) => {
        return axios
            .post(`${window.location.origin}${url}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => res.data);
    });
}

const DealDetail = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { dealId } = useParams();
    const { dataUsers, isLoadingUsers } = useUsersList();
    const { deals, isLoading, refetch } = useDealsByid(dealId ?? "");
    const [contact, setContact] = useState();
    useEffect(() => {
        if (deals) {
            setContact(deals.data.contact);
        }
    }, [deals]);

    // const { contact } = useGetContact(deals.data.contactId);

    const { contacts } = useContactsAll("All");
    const { token } = theme.useToken();
    const { Dragger } = Upload;
    const quillRef = React.useRef(null);
    const [fileList, setFileList] = useState([]);

    // const { contactId } = useParams();

    const handleChangeUpload = async ({ fileList: newFileList }) => {
        try {
            const modifiedFiles: any = await Promise.all(
                newFileList.map(async (item) => {
                    const compressedImage: any = await new Promise(
                        (resolve) => {
                            Resizer.imageFileResizer(
                                item.originFileObj,
                                1080, // maxWidth
                                1080, // maxHeight
                                "jpeg", // compressFormat
                                70, // quality
                                0, // rotation
                                (compressedImage) => {
                                    resolve(compressedImage);
                                },
                                "file", // outputType
                                1000 // minWidth
                            );
                        }
                    );

                    return {
                        originFileObj: compressedImage,
                        is_delete: 0,
                        lastModified: compressedImage.lastModified,
                        lastModifiedDate: compressedImage.lastModifiedDate,
                        name: compressedImage.name,
                        size: compressedImage.size,
                        type: compressedImage.type,
                        uid: item.uid,
                        status: "done",
                    };
                })
            );

            setFileList(modifiedFiles);
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };
    const handleOkAdd = () => {
        setIsModalOpenAdd(false);
        queryClient.invalidateQueries("deals");
    };

    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
    };

    const [isModalOpenAdd1, setIsModalOpenAdd1] = useState(false);
    const showModalAdd1 = () => {
        setIsModalOpenAdd1(true);
    };
    const handleOkAdd1 = () => {
        setIsModalOpenAdd1(false);
        queryClient.invalidateQueries("deals");
    };

    const handleCancelAdd1 = () => {
        setIsModalOpenAdd1(false);
    };
    const optionAvailability: SelectProps["options"] = [
        {
            label: "Busy",
            value: "Busy",
        },
        {
            label: "Free",
            value: "Free",
        },
    ];
    const [form] = Form.useForm();
    const [form_notes] = Form.useForm();
    function toCurrency(number: any) {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(number);
    }

    const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Deal Specific Email",
            children: (
                <Descriptions column={1}>
                    <Descriptions.Item label="Email">
                        {deals && deals.data.contact.email}
                    </Descriptions.Item>
                </Descriptions>
            ),
            style: panelStyle,
        },
        {
            key: "2",
            label: "Contact",
            children: (
                <div>
                    <div style={{ display: "flex" }}>
                        <span className="thumb-name-xs " title="Jesse Ashley">
                            {deals && deals.data.contact.firstName.charAt(0)}
                        </span>
                        <span style={{ fontSize: 14, marginLeft: 10 }}>
                            {deals &&
                                deals.data.contact.firstName +
                                    " " +
                                    deals.data.contact.lastName}
                        </span>
                    </div>

                    <Descriptions column={1} style={{ marginTop: 15 }}>
                        <Descriptions.Item label="Mobile">
                            {deals &&
                                deals.data.contact.phone &&
                                deals.data.contact.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {deals &&
                                deals.data.contact.otherPhone &&
                                deals.data.contact.otherPhone}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Deal Details",
            children: (
                <div>
                    {/* <div>
                        <b>Source</b>
                    </div>
                    <div>{deals && deals.data.source}</div>
                    <br></br>
                    <div>
                        <b>Priority</b>
                    </div>
                    <div>{deals && deals.data.priority}</div>
                    <br></br>
                    <div>
                        {" "}
                        <b>Description</b>
                    </div>
                    <div>{deals && deals.data.details}</div>
                    <br></br>
                    <div>
                        <b>Tags</b>
                    </div>
                    <div>{deals && deals.data.tags}</div>
                    <br></br> */}

                    <Descriptions column={1} style={{ marginTop: 15 }}>
                        <Descriptions.Item label="Source">
                            {deals && deals.data.source}
                        </Descriptions.Item>
                        <Descriptions.Item label="Priority">
                            {deals && deals.data.priority}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {deals && deals.data.details}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tags">
                            {deals && deals.data.tags}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ),
            style: panelStyle,
        },
    ];

    const onFinish = (values: any) => {
        values = {
            ...values,
            deal_id: dealId,
            invitees: [],
            follower_id: 0,
            contact_id: 0,
            start_date: values.start_date
                ? dayjs(values.start_date).format("YYYY/MM/DD")
                : undefined,
            end_date: values.end_date
                ? dayjs(values.end_date).format("YYYY/MM/DD")
                : undefined,
            start_time: values.start_time
                ? dayjs(values.start_time).format("HH:mm")
                : undefined,
            end_time: values.end_time
                ? dayjs(values.end_time).format("HH:mm")
                : undefined,
        };

        console.log("onFinish", values);

        addActivity.mutate(values);
    };

    const addActivity = useMutation(addActivityMutation, {
        onSuccess: (res) => {
            notification.success({
                message: "Activity",
                description: "Activity Successfully Added",
            });

            form.resetFields();
            refetch();
        },
    });

    const addDealsNotes = useMutation(useDealMutationAddNotes, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Notes Successfully Added",
            });
            form_notes.resetFields();
            refetch();
        },
    });

    const deleteDealsNotes = useMutation(useDealMutationDeleteNotes, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Notes Successfully Deleted",
            });

            refetch();
        },
    });

    const confirmDeleteNotes = (id: string) => {
        deleteDealsNotes.mutate({ id: id });
    };

    const deleteActivity = useMutation(useDealMutationDeleteActivity, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Activity Successfully Deleted",
            });

            refetch();
        },
    });

    const confirmDeleteActivity = (id: string) => {
        deleteActivity.mutate({ id: id });
    };

    const deleteFile = useMutation(useDealMutationDeleteFile, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "File Successfully Deleted",
            });

            refetch();
        },
    });

    const confirmDeleteFile = (id: string) => {
        deleteFile.mutate({ id: id });
    };

    const { mutate: mutateUpload, isLoading: isLoadingUploadDeliveryRequest } =
        POST_FILE("/api/deals/add_files");

    const onSaveChangeFile = (value: any) => {
        let data = new FormData();
        data.append("deal_id", "" + dealId);
        let count: number = 0;
        for (let x = 0; x < fileList.length; x++) {
            const elem: any = fileList[x];
            data.append("files_" + x, elem.originFileObj, elem.name);
            count++;
        }
        data.append("files_count", "" + count);
        mutateUpload(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Deals",
                        description: "File(s) Successfully Added",
                    });
                    refetch();
                    setFileList([]);
                }
            },
            onError: (err) => {},
        });

        // for (let x = 0; x < fileList.length; x++) {
        //     const elem: any = fileList[x];
        //     data.append("files_" + x, elem.originFileObj, elem.name);
        // }

        // addDealsFile.mutate({ id: fileList });
    };

    const onSaveChangeQuill = (value: any) => {
        addDealsNotes.mutate({ deal_id: "" + dealId, notes: value.notes });
    };

    const [selectedValue, setSelectedValue] = useState();
    const onChangeSelectParticipant = (value: any) => {
        addParticipant.mutate({ user_id: value, deal_id: "" + dealId });
    };

    const addParticipant = useMutation(useDealMutationAddParticipant, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Participant Successfully Added",
            });

            refetch();
        },
    });

    const deleteParticipant = useMutation(useDealMutationDeleteParticipants, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Delete Successfully Added",
            });

            refetch();
        },
    });

    const handleClose = (value: any) => {
        deleteParticipant.mutate({ id: value });
    };

    const onChangeSelectTeammate = (value: any) => {
        addTeammate.mutate({ user_id: value, deal_id: "" + dealId });
    };

    const addTeammate = useMutation(useDealMutationAddTeammate, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Teammate Successfully Added",
            });

            refetch();
        },
    });

    const deleteTeammate = useMutation(useDealMutationDeleteTeammate, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Delete Successfully Added",
            });

            refetch();
        },
    });

    const handleCloseTeammate = (value: any) => {
        deleteTeammate.mutate({ id: value });
    };

    const [isModalOpenContact, setIsModalOpenContact] = useState(false);
    const showModalContact = () => {
        setIsModalOpenContact(true);
    };
    const handleOkContact = () => {
        setIsModalOpenContact(false);
        queryClient.invalidateQueries("deals");
    };
    const handleCancelContact = () => {
        setIsModalOpenContact(false);
    };

    const [getLastCommunication, setGetLastCommunication] = useState("SMS");
    const [getLastCommunicationDate, setGetLastCommunicationDate] =
        useState("");

    const getItems2: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Smart Insights",
            children: (
                <>
                    <Descriptions column={1}>
                        <Descriptions.Item label="Last Communication">
                            {getLastCommunication}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Communication On">
                            {moment(getLastCommunicationDate).fromNow()}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Open Deals">
                            0 ($0)
                        </Descriptions.Item>
                        <Descriptions.Item label="Deals Won">
                            0 ($0)
                        </Descriptions.Item>
                        <Descriptions.Item label="Activities">
                            0/3
                        </Descriptions.Item> */}
                    </Descriptions>
                </>
            ),
            style: panelStyle,
        },
        {
            key: "2",
            label: "Teamates",
            children: (
                <div>
                    {deals &&
                        deals?.data.teammate.map((item: any, key: any) => {
                            return (
                                <Tag
                                    closable
                                    color="#2db7f5"
                                    onClose={(e) => {
                                        handleCloseTeammate(item.id);
                                    }}
                                    style={{ marginTop: "5px" }}
                                >
                                    {item.user.firstName +
                                        " " +
                                        item.user.lastName}
                                </Tag>
                            );
                        })}

                    <div style={{ marginTop: "10px" }}>
                        <Select
                            placeholder="Search"
                            showSearch
                            className="select-custom-width"
                            loading={isLoadingUsers}
                            style={{ width: "100%" }}
                            onChange={onChangeSelectTeammate}
                            dropdownRender={(menu) => <>{menu}</>}
                        >
                            {contacts &&
                                contacts.map((item: any, key: any) => {
                                    return (
                                        <Select.Option
                                            key={key}
                                            value={item.id}
                                            search={`${item.firstName} ${item.lastName}`}
                                        >
                                            {`${item.firstName} ${item.lastName}`}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Participants",
            children: (
                <div>
                    {deals &&
                        deals?.data.participant.map((item: any, key: any) => {
                            return (
                                <Tag
                                    closable
                                    color="#2db7f5"
                                    onClose={(e) => {
                                        handleClose(item.id);
                                    }}
                                    style={{ marginTop: "5px" }}
                                >
                                    {item.user.firstName +
                                        " " +
                                        item.user.lastName}
                                </Tag>
                            );
                        })}

                    <div style={{ marginTop: "10px" }}>
                        <Select
                            placeholder="Search"
                            showSearch
                            className="select-custom-width"
                            loading={isLoadingUsers}
                            style={{ width: "100%" }}
                            onChange={onChangeSelectParticipant}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider
                                        style={{
                                            marginBottom: "5px",
                                            marginTop: "5px",
                                        }}
                                    ></Divider>
                                    <Space style={{ padding: "0 8px 4px" }}>
                                        <Button
                                            type="text"
                                            icon={<PlusOutlined />}
                                            onClick={showModalContact}
                                        >
                                            Add Contact
                                        </Button>
                                    </Space>
                                </>
                            )}
                        >
                            {contacts &&
                                contacts.map((item: any, key: any) => {
                                    return (
                                        <Select.Option
                                            key={key}
                                            value={item.id}
                                            search={`${item.firstName} ${item.lastName}`}
                                        >
                                            {`${item.firstName} ${item.lastName}`}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </div>
                </div>
            ),
            style: panelStyle,
        },
    ];

    const [showModalAddDealValue, setshowModalAddDealValue] =
        useState<string>("");
    const [showModalAddDealValueFrom, setshowModalAddDealValueFrom] =
        useState<string>("add");
    const [isModalOpenAddDeal, setIsModalOpenAddDeal] = useState(false);
    const [modalValue, setModalValue] = useState(false);
    const showModalAddDeal = () => {
        setModalValue(deals.data);
        setIsModalOpenAddDeal(true);
    };

    const [isTContact, setTContact] = useState<TDeals | null>(null);
    const [isTitle, setTitle] = useState("");

    const handleOkAddDeal = () => {
        setIsModalOpenAddDeal(false);
        queryClient.invalidateQueries("deals_by_id");
    };

    const handleCancelAddDeal = () => {
        setIsModalOpenAddDeal(false);
    };
    const handleEditDeal = (record: any) => {
        setTContact(record);
    };

    const deleteContact = useMutation(useDealMutationDeleteDeal, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("deals_by_id");
            notification.success({
                message: "Success",
                description: "Deal Successfully Deleted",
            });
            navigate("/deals");
        },
    });
    const handleDelete = () => {
        deleteContact.mutate({ deals_id: [dealId] });
    };
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const action: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div
                    onClick={() => {
                        showModalAddDeal();
                        setshowModalAddDealValueFrom("update");
                        setDropdownVisible(true);
                    }}
                >
                    Edit
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <div
                    onClick={() => {
                        showModalAddDeal();
                        setshowModalAddDealValueFrom("clone");
                        setDropdownVisible(true);
                    }}
                >
                    Clone
                </div>
            ),
        },
        {
            key: "3",
            label: (
                <div
                    onClick={() => {
                        setDropdownVisible(true);
                    }}
                >
                    {" "}
                    <Popconfirm
                        title="Delete"
                        description="Are you sure to delete this deal?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        Delete
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const panelStyle = {};
    const [stagingColor, setStagingColor] = useState({
        first: "none",
        second: "none",
        third: "none",
        fourth: "none",
        fifth: "none",
    });

    // const [contact, setContact] = useState();
    useEffect(() => {
        if (deals) {
            deals.data.contact.wall?.every((x: any) => {
                if (x.type == "call" || x.type == "text") {
                    setGetLastCommunication(x.type == "call" ? "Call" : "SMS");
                    setGetLastCommunicationDate(x.date);
                    return false;
                }
                return true;
            });

            if (deals.data.stage == "Comp & Qualify") {
                setStagingColor({
                    ...stagingColor,
                    first: "active",
                    second: "none",
                    third: "none",
                    fourth: "none",
                    fifth: "none",
                });
            }
            if (deals.data.stage == "First Offer Given") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "active",

                    third: "none",
                    fourth: "none",
                    fifth: "none",
                });
            }
            if (deals.data.stage == "In Negotiation") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "done",
                    third: "active",

                    fourth: "none",
                    fifth: "none",
                });
            }
            if (deals.data.stage == "Verbal Offer Accepted") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "done",
                    third: "done",
                    fourth: "active",
                    fifth: "none",
                });
            }
            if (deals.data.stage == "Under Contract") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "done",
                    third: "done",
                    fourth: "done",
                    fifth: "active",
                });
            }
        }
    }, [deals]);

    const updateStage = useMutation(useDealMutationUpdateStage, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Stage Successfully Updated",
            });

            refetch();
        },
    });

    const onUpdateStage = (val: string) => {
        updateStage.mutate({ stage: val, id: "" + dealId });
    };

    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card title="Deals">
                    <div className="pyro hide">
                        <div className="before"></div>
                        <div className="after"></div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div>
                            <Typography.Title level={3}>
                                {deals && deals.data.title}
                            </Typography.Title>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}></span>
                            <span style={{ marginRight: 10 }}>
                                <Button
                                    type="primary"
                                    className={
                                        deals && deals.data.is_won == "0"
                                            ? "button-success-outlined"
                                            : "button-success-solid"
                                    }
                                    onClick={() => showModalAdd()}
                                >
                                    &nbsp; <LikeOutlined />
                                    Won
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button
                                    type="primary"
                                    danger
                                    className={
                                        deals && deals.data.is_lost == "0"
                                            ? "button-danger-outlined"
                                            : "button-danger-solid"
                                    }
                                    onClick={() => showModalAdd1()}
                                >
                                    <DislikeOutlined /> &nbsp; Lost
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    visible={isDropdownVisible}
                                    onVisibleChange={setDropdownVisible}
                                    menu={{ items: action }}
                                    placement="bottomLeft"
                                    trigger={["click"]}
                                >
                                    <Button>
                                        <Space>
                                            Action
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 15,
                            }}
                        >
                            <span style={{ marginRight: 15 }}>
                                <span>
                                    <div>Value</div>
                                    <div>
                                        {" "}
                                        {deals &&
                                            "$" + toCurrency(deals.data.value)}
                                    </div>
                                </span>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <span>
                                    <div>Pipleline</div>
                                    <div>{deals && deals.data.pipeline}</div>
                                </span>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <div>
                                    <div>Estimated Close Date</div>
                                    <div>
                                        <CalendarOutlined />{" "}
                                        {deals &&
                                            deals.data.estimated_close_date}
                                    </div>
                                </div>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <div>
                                    <div>Win Probability</div>
                                    <div>0</div>
                                </div>
                            </span>
                        </div>

                        <div></div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <div className="breadcrumb">
                            <a
                                href="#"
                                className={deals && stagingColor.first}
                                onClick={() => {
                                    onUpdateStage("Comp & Qualify");
                                }}
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Comp & Qualify
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={deals && stagingColor.second}
                                onClick={() => {
                                    onUpdateStage("First Offer Given");
                                }}
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        First Offer Given
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={deals && stagingColor.third}
                                onClick={() => {
                                    onUpdateStage("In Negotiation");
                                }}
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        In Negotiation
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={deals && stagingColor.fourth}
                                onClick={() => {
                                    onUpdateStage("Verbal Offer Accepted");
                                }}
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Verbal Offer Accepted
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={deals && stagingColor.fifth}
                                onClick={() => {
                                    onUpdateStage("Under Contract");
                                }}
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Under Contract
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <Row gutter={24}>
                            <Col md={6}>
                                <div
                                // className="card-left-deal-details "
                                >
                                    <Collapse
                                        // bordered={false}
                                        defaultActiveKey={["1", "2", "3"]}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}
                                            />
                                        )}
                                        items={getItems(panelStyle)}
                                    />
                                </div>
                            </Col>
                            <Col md={12}>
                                {contact && (
                                    <ContactContext.Provider
                                        value={{ contact }}
                                    >
                                        <ActionsTabs />
                                        <div style={{ paddingTop: "15px" }}>
                                            <ContactsWall />
                                        </div>
                                    </ContactContext.Provider>
                                )}
                            </Col>
                            <Col md={6}>
                                <div>
                                    <Collapse
                                        defaultActiveKey={["1", "2", "3"]}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}
                                            />
                                        )}
                                        items={getItems2(panelStyle)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>

                <ModalWonDeal
                    isModalOpenAdd={isModalOpenAdd}
                    handleOkAdd={handleOkAdd}
                    handleCancelAdd={handleCancelAdd}
                    dealId={"" + dealId}
                />
                <ModalLostDeal
                    isModalOpenAdd1={isModalOpenAdd1}
                    handleOkAdd1={handleOkAdd1}
                    handleCancelAdd1={handleCancelAdd1}
                    dealId={"" + dealId}
                />
                <ModalAddQuitContact
                    isModalOpenContact={isModalOpenContact}
                    handleOkContact={handleOkContact}
                    handleCancelContact={handleCancelContact}
                    dealId={"" + dealId}
                />
                <ModalAddDeal
                    isModalOpenAdd={isModalOpenAddDeal}
                    handleOkAdd={handleOkAddDeal}
                    handleCancelAdd={handleCancelAddDeal}
                    showModalAddDealValue={showModalAddDealValue}
                    from={showModalAddDealValueFrom}
                    modalValue={modalValue}
                />
            </Col>
        </Row>
    );
};

export default DealDetail;
