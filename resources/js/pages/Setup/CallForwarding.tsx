import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Dropdown,
    Form,
    Input,
    List,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Space,
    Table,
    Tabs,
    Typography,
    message,
    Select,
} from "antd";
import {
    DownOutlined,
    EditOutlined,
    HolderOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import { useMutation, useQueryClient } from "react-query";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DraggableLocation,
} from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBinoculars,
    faCalendarDays,
    faCamera,
    faCar,
    faChalkboardUser,
    faCirclePlay,
    faClipboardCheck,
    faEnvelope,
    faFlag,
    faGem,
    faGlobe,
    faImage,
    faKey,
    faKitMedical,
    faMedal,
    faMugHot,
    faPhoneVolume,
    faPlaneDeparture,
    faStar,
    faTag,
    faTrophy,
    faUsers,
    faUtensils,
    faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { mutateGet, mutatePost } from "../../api/mutation/useSetupMutation";
import validateRules from "../../providers/validateRules";
import { useUsersAll } from "../../api/query/userQuery";
import { TUser } from "../../entities";
import { Link } from "react-router-dom";
import { sortUserCallForwardingMutation } from "../../api/mutation/useUserMutation";
import { useAppContextProvider } from "../../context/AppContext";
import DroppableList from "../../components/DroppableList";

interface DragEndResult {
    source: DraggableLocation;
    destination?: DraggableLocation | null;
}

interface ListItem {
    id: string;
    title: string;
}

const CallForwarding: React.FC = ({}) => {
    const queryClient = useQueryClient();
    const { users, isLoading } = useUsersAll();
    const { loggedInUser } = useAppContextProvider();

    const [data, setData] = useState([]);
    const [forwardingType, setForwardingType] = useState(
        loggedInUser?.forwardingType ?? "off"
    );

    const handleDragEnd = (result: {
        source: DraggableLocation;
        destination?: DraggableLocation | null;
    }) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(data);
        const [reorderedItem] = items.splice(result.source.index, 1);
        if (result.destination.index !== undefined) {
            items.splice(result.destination.index, 0, reorderedItem);
        }

        let resetID = selectResetID(items);
        setData(resetID);
        // saveCallForwardSort({ users: resetID, forwardingType });
    };

    const selectResetID = (items: any) => {
        let array = items.map((item: any, key: Number) => {
            let dataKey = Number(key) + 1;
            return {
                ...item,
                sortCallForwarding: Number(dataKey).toFixed(),
            };
        });

        return array;
    };

    const callForwardSort = useMutation(sortUserCallForwardingMutation, {
        onSuccess: () => {
            message.success("Succesfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const saveCallForwardSort = (data) => {
        callForwardSort.mutate(data);
    };

    useEffect(() => {
        setData(
            users
                ?.filter(
                    (user: TUser) =>
                        user.role != "mainUser" && user.numbers.length
                )
                ?.sort((a, b) => a.sortCallForwarding - b.sortCallForwarding)
        );
    }, [users]);

    return (
        <Card
            style={{
                boxShadow: "none",
            }}
            bodyStyle={{ padding: "19px" }}
            bordered={false}
            loading={isLoading}
        >
            <Space direction="vertical" className="w-100" size={"large"}>
                <Select
                    showSearch
                    options={[
                        {
                            value: "off",
                            label: "Do not forward",
                        },
                        {
                            value: "on-failure",
                            label: "Forward on failure",
                        },
                        {
                            value: "always",
                            label: "Forward always",
                        },
                    ]}
                    value={forwardingType}
                    onChange={(e) => {
                        setForwardingType(e);
                        // saveCallForwardSort({
                        //     users: data,
                        //     forwardingType: e,
                        // });
                    }}
                />

                {forwardingType != "off" && (
                    <>
                        <Alert
                            message="Prioritize users who will receive the call first."
                            type="info"
                            showIcon
                        />

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <DroppableList items={data} />
                        </DragDropContext>
                    </>
                )}

                <Button
                    type="primary"
                    onClick={() => {
                        saveCallForwardSort({
                            users: data,
                            forwardingType,
                        });
                    }}
                    loading={callForwardSort.isLoading}
                    style={{ float: "right" }}
                >
                    Save
                </Button>
            </Space>
        </Card>
    );
};

export default CallForwarding;
