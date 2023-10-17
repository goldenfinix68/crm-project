import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Dropdown,
    Form,
    Input,
    MenuProps,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography,
    notification,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import { useMutation, useQueryClient } from "react-query";
import CustomFieldAddUpdateModal from "../../components/CustomFieldAddUpdateModal";
import CustomFieldSectionAddUpdateModal from "../../components/CustomFieldSectionAddUpdateModal";

const ContactSetup: React.FC = () => {
    const queryClient = useQueryClient();

    return <></>;
};

export default ContactSetup;
