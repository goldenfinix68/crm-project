import {
    Card,
    Button,
    Dropdown,
    Space,
    MenuProps,
    Tabs,
    Row,
    Col,
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
    Upload,
    Popconfirm,
    Tag,
} from "antd";
import axios from "axios";
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
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    DownOutlined,
    UserOutlined,
    LikeOutlined,
    DislikeOutlined,
    CaretRightOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    InboxOutlined,
    PaperClipOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import { useDealsByid } from "../../api/query/dealQuery";
import { useUsersList } from "../../api/query/activityQuery";
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
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import type { SelectProps } from "antd";
import Resizer from "react-image-file-resizer";
import { addActivityMutation } from "../../api/mutation/useActivityMutation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ModalWonDeal from "./components/ModalWonDeal";
import ModalLostDeal from "./components/ModalLostDeal";
import ModalAddQuitContact from "./components/ModalAddQuitContact";
import { useAppContextProvider } from "../../context/AppContext";

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
    const { contacts } = useAppContextProvider();
    const { token } = theme.useToken();
    const { Dragger } = Upload;
    const quillRef = React.useRef(null);
    const [fileList, setFileList] = useState([]);
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
            children: <p>{deals && deals.data.contact.email}</p>,
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
                    <div>
                        Mobile:{" "}
                        {deals &&
                            deals.data.contact.phone +
                                " " +
                                deals.data.contact.phone}
                    </div>
                    <div>
                        Phone:{" "}
                        {deals &&
                            deals.data.contact.otherPhone +
                                " " +
                                deals.data.contact.otherPhone}
                    </div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Deal Details",
            children: (
                <div>
                    <div>
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
                    <br></br>
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

    const getItems2: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Smart Insights",
            children: (
                <div>
                    <div>
                        <b>Last Communication</b>{" "}
                        <span style={{ marginLeft: 5 }}>Text</span>
                    </div>
                    <div>
                        <b>Last Communication On</b>{" "}
                        <span style={{ marginLeft: 5 }}>10hours Ago</span>
                    </div>
                </div>
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
    const action: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Edit</div>,
        },
        {
            key: "2",
            label: <div>Clone</div>,
        },
        {
            key: "3",
            label: <div>Delete</div>,
        },
    ];
    const panelStyle = {
        marginBottom: 24,

        border: "none",
    };
    const [stagingColor, setStagingColor] = useState({
        first: "none",
        second: "none",
        third: "none",
        fourth: "none",
        fifth: "none",
    });
    useEffect(() => {
        if (deals) {
            if (deals.data.stage == "Comp & Qualify") {
                setStagingColor({
                    ...stagingColor,
                    first: "active",
                });
            }
            if (deals.data.stage == "First Offer Given") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "active",
                });
            }
            if (deals.data.stage == "In Negotiation") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "done",
                    third: "active",
                });
            }
            if (deals.data.stage == "Verbal Offer Accepted") {
                setStagingColor({
                    ...stagingColor,
                    first: "done",
                    second: "done",
                    third: "done",
                    fourth: "active",
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
    const cardForm = () => {
        return (
            <Form form={form} onFinish={(e) => onFinish(e)}>
                <Row gutter={12} className="">
                    <Col span={24} className="p-md p-t-lg form-left">
                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Title</Typography.Text>
                            </Col>
                            <Col span={19}>
                                {" "}
                                <Form.Item
                                    name={"title"}
                                    rules={[validateRules.required]}
                                >
                                    <Input placeholder="Title" className="" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Type</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"type"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        className="select-custom-width"
                                        placeholder="Type"
                                    >
                                        <Select.Option value="Call">
                                            <FontAwesomeIcon
                                                icon={faPhoneVolume}
                                                className="font-12px m-r-xs"
                                            />
                                            Call
                                        </Select.Option>
                                        <Select.Option value="Task">
                                            <FontAwesomeIcon
                                                icon={faList}
                                                className="font-12px m-r-xs"
                                            />
                                            Task
                                        </Select.Option>
                                        <Select.Option value="Meeting">
                                            <FontAwesomeIcon
                                                icon={faUsers}
                                                className="font-12px m-r-xs"
                                            />
                                            Meeting
                                        </Select.Option>
                                        <Select.Option value="Demo">
                                            <FontAwesomeIcon
                                                icon={faVideo}
                                                className="font-12px m-r-xs"
                                            />
                                            Demo
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Date & Time</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="start_date"
                                            rules={[validateRules.required]}
                                        >
                                            <DatePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                placeholder="Start Date"
                                                format={"MMM, DD YYYY"}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="start_time">
                                            <TimePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                minuteStep={30}
                                                format="HH:mm"
                                                placeholder="Start Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="end_time"
                                            rules={[validateRules.required]}
                                        >
                                            <TimePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                minuteStep={30}
                                                format="HH:mm"
                                                placeholder="End Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="end_date">
                                            <DatePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                placeholder="End Date"
                                                format={"MMM, DD YYYY"}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Availability</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"availability"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Availability"
                                        showSearch
                                        className="select-custom-width"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label col-label-note">
                                <Typography.Text>Internal Note</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"internal_note"}>
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Add internal note"
                                        className="no-resize"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Owner</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"owner_id"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Owner"
                                        showSearch
                                        className="select-custom-width"
                                        loading={isLoadingUsers}
                                    >
                                        {dataUsers &&
                                            dataUsers?.data &&
                                            dataUsers?.data.map(
                                                (item: any, key: any) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item.id}
                                                            search={`${item.firstName} ${item.lastName}`}
                                                        >
                                                            {`${item.firstName} ${item.lastName}`}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Followers</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"followers"}>
                                    <Select
                                        placeholder="Followers"
                                        showSearch
                                        mode="multiple"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Tags</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"tags"}>
                                    <Select
                                        placeholder="Tags"
                                        showSearch
                                        mode="tags"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={24}>
                        <div>
                            {" "}
                            <Button
                                style={{ float: "right" }}
                                onClick={() => {
                                    form.submit();
                                }}
                                type="primary"
                            >
                                Save
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    };
    const itemstab: TabsProps["items"] = [
        {
            key: "1",
            label: `Note`,
            children: (
                <div style={{ height: 240, padding: 20 }}>
                    <Form
                        form={form_notes}
                        onFinish={(e) => onSaveChangeQuill(e)}
                    >
                        <Form.Item name="notes">
                            <ReactQuill
                                ref={quillRef}
                                style={{ height: "150px" }}
                            />
                        </Form.Item>

                        <div style={{ marginTop: 50 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ float: "right" }}
                            >
                                Save
                            </Button>
                        </div>
                    </Form>
                </div>
            ),
        },
        {
            key: "2",
            label: `Email`,
            children: (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        padding: 20,
                    }}
                >
                    <div>
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={{ fontSize: 50 }}
                        />
                    </div>

                    <div>
                        <div style={{ fontSize: 20 }}>
                            Configure your Email Account
                        </div>
                        <br></br>
                        logging with Salesmate's two-way email sync
                        functionality. Measure email engagement with email open
                        and click tracking. Don't forget to use email templates
                        for your canned responses and repetitive emails.
                        <Button type="primary" style={{ marginTop: 20 }}>
                            Configue email account
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: "3",
            label: `Add Activity`,
            children: cardForm(),
        },
        {
            key: "4",
            label: `Log Activity`,
            children: cardForm(),
        },
        {
            key: "5",
            label: `File`,
            children: (
                <div
                    style={{
                        padding: 20,
                    }}
                >
                    <Dragger
                        multiple={true}
                        name="avatar"
                        action={""}
                        fileList={fileList}
                        onChange={handleChangeUpload}
                        accept="image/png,image/jpg,image/jpeg,image/gif"
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Drag and Drop files here or Click to upload
                        </p>
                    </Dragger>

                    <div style={{ marginTop: 15 }}>
                        <Button
                            type="primary"
                            onClick={onSaveChangeFile}
                            style={{ float: "right" }}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            ),
        },
    ];
    const itemstab2: TabsProps["items"] = [
        {
            key: "1",
            label: `All`,
            children: (
                <>
                    {deals && deals.notes.length > 0 && (
                        <div>Pinned Notes ({deals.notes.length})</div>
                    )}
                    {deals &&
                        deals.notes.length > 0 &&
                        deals.notes.map((item: any) => {
                            return (
                                <div>
                                    <Card
                                        style={{
                                            marginTop: 20,
                                            background: "#dfddca",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <div className="delete-post-icon">
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete this notes?"
                                                onConfirm={() =>
                                                    confirmDeleteNotes(item.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                <b>{"Note Added"}</b> by{" "}
                                                {item.user.firstName +
                                                    " " +
                                                    item.user.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: item.notes,
                                                }}
                                            ></span>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}

                    <div>Upcoming (0)</div>

                    {deals &&
                        deals.data.activities.length > 0 &&
                        deals.data.activities.map((item: any) => {
                            return (
                                <div>
                                    <Card style={{ marginTop: 20 }}>
                                        <div className="delete-post-icon">
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete this activity?"
                                                onConfirm={() =>
                                                    confirmDeleteActivity(
                                                        item.id
                                                    )
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <span
                                                className="thumb-name-xs "
                                                title="Jesse Ashley"
                                            >
                                                {item.owner.firstName.charAt(0)}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {" "}
                                                <b>{item.type}</b> for{" "}
                                                {item.owner.firstName +
                                                    " " +
                                                    item.owner.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span>
                                                <CheckCircleOutlined
                                                    style={{ fontSize: 24 }}
                                                />
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: 20,
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                                marginTop: 10,
                                            }}
                                        >
                                            <span>
                                                <CalendarOutlined
                                                    style={{ fontSize: 14 }}
                                                />
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {" "}
                                                {moment(item.start_date).format(
                                                    "LLL"
                                                )}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: 20,
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                            }}
                                        >
                                            <span>
                                                <UserOutlined
                                                    style={{ fontSize: 14 }}
                                                />
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {deals &&
                                                    deals.data.owner.firstName +
                                                        " " +
                                                        deals.data.owner
                                                            .lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <Input placeholder="Add your note for this activity"></Input>
                                    </Card>
                                </div>
                            );
                        })}
                    {deals &&
                        deals.data.notes.length > 0 &&
                        deals.data.notes.map((item: any) => {
                            return (
                                <div>
                                    <Card style={{ marginTop: 20 }}>
                                        <div style={{ display: "flex" }}>
                                            <div className="delete-post-icon">
                                                <Popconfirm
                                                    title="Delete"
                                                    description="Are you sure to delete this notes?"
                                                    onConfirm={() =>
                                                        confirmDeleteNotes(
                                                            item.id
                                                        )
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <DeleteOutlined />
                                                </Popconfirm>
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                <b>{"Note Added"}</b> by{" "}
                                                {item.user.firstName +
                                                    " " +
                                                    item.user.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: item.notes,
                                                }}
                                            ></span>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    {deals &&
                        deals.data.files.length > 0 &&
                        deals.data.files.map((item: any) => {
                            return (
                                <div>
                                    <Card style={{ marginTop: 20 }}>
                                        <div className="delete-post-icon">
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete this file?"
                                                onConfirm={() =>
                                                    confirmDeleteFile(item.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                <b>{"File Added"}</b> by{" "}
                                                {item.uploaded_by.firstName +
                                                    " " +
                                                    item.uploaded_by.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>

                                        <div
                                            style={{
                                                background: "#F2F5FA",
                                                borderRadius: 5,
                                                padding: 10,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                window.open(
                                                    window.location.origin +
                                                        "/" +
                                                        item.file_url
                                                );
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span>
                                                    <PaperClipOutlined
                                                        style={{ fontSize: 20 }}
                                                    />
                                                </span>
                                                <span
                                                    style={{ marginLeft: 10 }}
                                                >
                                                    {item.file_name}

                                                    <div
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        {item.file_size}
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                </>
            ),
        },
        {
            key: "2",
            label: `Activites`,
            children: (
                <>
                    {deals &&
                        deals.data.activities.length > 0 &&
                        deals.data.activities.map((item: any) => {
                            return (
                                <div>
                                    <Card style={{ marginTop: 20 }}>
                                        <div className="delete-post-icon">
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete this activity?"
                                                onConfirm={() =>
                                                    confirmDeleteActivity(
                                                        item.id
                                                    )
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <span
                                                className="thumb-name-xs "
                                                title="Jesse Ashley"
                                            >
                                                {item.owner.firstName.charAt(0)}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {" "}
                                                <b>{item.type}</b> for{" "}
                                                {item.owner.firstName +
                                                    " " +
                                                    item.owner.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span>
                                                <CheckCircleOutlined
                                                    style={{ fontSize: 24 }}
                                                />
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: 20,
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                                marginTop: 10,
                                            }}
                                        >
                                            <span>
                                                <CalendarOutlined
                                                    style={{ fontSize: 14 }}
                                                />
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {" "}
                                                {moment(item.start_date).format(
                                                    "LLL"
                                                )}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: 20,
                                                paddingTop: 0,
                                                paddingBottom: 0,
                                            }}
                                        >
                                            <span>
                                                <UserOutlined
                                                    style={{ fontSize: 14 }}
                                                />
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 14,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {deals &&
                                                    deals.data.owner.firstName +
                                                        " " +
                                                        deals.data.owner
                                                            .lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <Input placeholder="Add your note for this activity"></Input>
                                    </Card>
                                </div>
                            );
                        })}
                </>
            ),
        },
        {
            key: "3",
            label: `Notes`,
            children: (
                <>
                    {deals &&
                        deals.data.notes.length > 0 &&
                        deals.data.notes.map((item: any) => {
                            return (
                                <div>
                                    <Card style={{ marginTop: 20 }}>
                                        <div className="delete-post-icon">
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete this notes?"
                                                onConfirm={() =>
                                                    confirmDeleteNotes(item.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                <b>{"Note Added"}</b> by{" "}
                                                {item.user.firstName +
                                                    " " +
                                                    item.user.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: item.notes,
                                                }}
                                            ></span>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                </>
            ),
        },
        {
            key: "4",
            label: `Emails`,
            children: `No Content`,
        },
        {
            key: "5",
            label: `File`,
            children: (
                <>
                    {deals &&
                        deals.data.files.length > 0 &&
                        deals.data.files.map((item: any) => {
                            return (
                                <div>
                                    <Card style={{ marginTop: 20 }}>
                                        <div className="delete-post-icon">
                                            <Popconfirm
                                                title="Delete"
                                                description="Are you sure to delete this file?"
                                                onConfirm={() =>
                                                    confirmDeleteFile(item.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <span
                                                style={{
                                                    fontSize: 16,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                <b>{"File Added"}</b> by{" "}
                                                {item.uploaded_by.firstName +
                                                    " " +
                                                    item.uploaded_by.lastName}
                                            </span>
                                        </div>
                                        <Divider></Divider>

                                        <div
                                            style={{
                                                background: "#F2F5FA",
                                                borderRadius: 5,
                                                padding: 10,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                window.open(
                                                    window.location.origin +
                                                        "/" +
                                                        item.file_url
                                                );
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span>
                                                    <PaperClipOutlined
                                                        style={{ fontSize: 20 }}
                                                    />
                                                </span>
                                                <span
                                                    style={{ marginLeft: 10 }}
                                                >
                                                    {item.file_name}

                                                    <div
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        {item.file_size}
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                </>
            ),
        },
        {
            key: "6",
            label: `Texts`,
            children: `No Content`,
        },
        {
            key: "7",
            label: `Updates`,
            children: `No Content`,
        },
    ];

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
                                    menu={{ items: action }}
                                    placement="bottomLeft"
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
                                <div className="card-left-deal-details ">
                                    <Collapse
                                        bordered={false}
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
                                <Card
                                    bodyStyle={{
                                        padding: 10,
                                        paddingTop: 0,
                                    }}
                                >
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={itemstab}
                                        // onChange={onChange}
                                    />
                                </Card>

                                <div style={{ marginTop: 20 }}>
                                    <Tabs
                                        style={{ padding: 10 }}
                                        defaultActiveKey="1"
                                        items={itemstab2}
                                        // onChange={onChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="card-left-deal-details ">
                                    <Collapse
                                        bordered={false}
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
            </Col>
        </Row>
    );
};

export default DealDetail;
