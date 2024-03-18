import React from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { Dropdown, Menu, Typography } from "antd";

const DropdownComponent = ({
    menuList,
    label,
    floatRight = false,
    showCarret = true,
    ...rest
}: any) => {
    return (
        <Dropdown
            overlay={
                <Menu>
                    {menuList.map((item) => (
                        <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                </Menu>
            }
            trigger={["click"]}
            {...rest}
            handleButtonClick={(e) => console.log(e)}
        >
            <Typography.Text
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: floatRight ? "flex-end" : "flex-start",
                }}
            >
                {label}{" "}
                {showCarret && (
                    <CaretDownFilled style={{ marginLeft: 4 }} size={1} />
                )}
            </Typography.Text>
        </Dropdown>
    );
};

export default DropdownComponent;
