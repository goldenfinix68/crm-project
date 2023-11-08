import { Button, Popover, Tooltip } from "antd";
import React from "react";
import { useAppContextProvider } from "../../../context/AppContext";

const ActionMenuBtn = ({
    handleClick,
    icon,
    isDisabled = false,
    tooltip = "",
}) => {
    const { isRoleStats } = useAppContextProvider();
    return (
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
                disabled={isDisabled || isRoleStats}
            >
                {icon}
            </Button>
        </Tooltip>
    );
};

export default ActionMenuBtn;
