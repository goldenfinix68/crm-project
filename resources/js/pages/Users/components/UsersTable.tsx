import React from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { userRoleOption } from "../../../constants";
import TextEllipsis from "../../../components/TextEllipsis";
import CustomResizeableTable from "../../../components/CustomResizeableTable";

const columns: ColumnsType<TUser> = [
    {
        key: "firstName",
        title: "First Name",
        render: (key: any, record: TUser) => {
            return <TextEllipsis>{record.firstName}</TextEllipsis>;
        },
    },
    {
        key: "lastName",
        title: "Last Name",
        render: (key: any, record: TUser) => {
            return <TextEllipsis>{record.lastName}</TextEllipsis>;
        },
    },
    {
        key: "email",
        title: "Email Address",
        render: (key: any, record: TUser) => {
            return <TextEllipsis>{record.email}</TextEllipsis>;
        },
    },
    {
        key: "role",
        title: "Role",
        render: (key: any, record: TUser) => {
            return (
                <TextEllipsis>
                    {
                        userRoleOption.find(
                            (option) => option.value == record.role
                        )?.label
                    }
                </TextEllipsis>
            );
        },
    },
    {
        key: "telnyxConnectionName",
        title: "SIP Trunking / Mobile Numbers",
        render: (key: any, record: TUser) => {
            return (
                <TextEllipsis>
                    {record.telnyxConnectionName
                        ? `${record.telnyxConnectionName} (${
                              record.numbers?.length
                                  ? record.numbers
                                        .map((number) => number.mobileNumber)
                                        .join(", ")
                                  : ""
                          })`
                        : "Not Set"}
                </TextEllipsis>
            );
        },
    },
    {
        title: "Action",
        key: "action",
        render: (key: any, record: any) => {
            return (
                <Link to={`/setup/customizations/users/${record.id}`}>
                    <Button type="link">
                        <EditOutlined />
                    </Button>
                </Link>
            );
        },
    },
];

const UsersTable = ({ users }: { users: Array<TUser> }) => {
    return (
        // <Table
        //     columns={columns}
        //     dataSource={users}
        //     pagination={{
        //         defaultPageSize: 100,
        //         pageSizeOptions: ["100", "250"],
        //         showSizeChanger: true,
        //     }}
        // />

        <CustomResizeableTable
            columns={columns}
            dataSource={users}
            pagination={{
                defaultPageSize: 100,
                pageSizeOptions: ["100", "250"],
                showSizeChanger: true,
            }}
            localStorageKey="usersTableColumnsWidth"
        />
    );
};

export default UsersTable;
