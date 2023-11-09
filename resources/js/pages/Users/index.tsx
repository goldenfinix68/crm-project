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
import UsersTable from "./components/UsersTable";
import { Link } from "react-router-dom";
import { sortUserCallForwardingMutation } from "../../api/mutation/useUserMutation";
import { useAppContextProvider } from "../../context/AppContext";

const Users: React.FC = ({}) => {
    const queryClient = useQueryClient();
    const { users, isLoading } = useUsersAll();

    return (
        <>
            <Card bodyStyle={{ padding: 0 }}>
                <Card
                    style={{
                        boxShadow: "none",
                    }}
                    bodyStyle={{ padding: "19px" }}
                    bordered={false}
                >
                    <Link to="/setup/customizations/users/new">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            className="m-b-md"
                        >
                            Add User
                        </Button>
                    </Link>
                    <UsersTable users={users || []} />
                </Card>
            </Card>
        </>
    );
};

export default Users;
