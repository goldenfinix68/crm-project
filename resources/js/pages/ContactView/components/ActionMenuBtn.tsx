import { Button, Popover, Tooltip } from "antd";
import React from "react";

const ActionMenuBtn = ({
    handleClick,
    icon,
    isDisabled = false,
    tooltip = "",
}) => (
    <Tooltip title={tooltip} placement="bottom">
        <Button
            shape="circle"
            style={{
                backgroundColor: "#172b4d",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
            }}
            onClick={() => handleClick()}
            disabled={isDisabled}
        >
            {icon}
        </Button>
    </Tooltip>
);

export default ActionMenuBtn;
