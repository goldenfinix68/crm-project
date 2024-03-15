import { Tooltip } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const CustomLink = ({
    children,
    style,
    to,
    onClick,
    tooltipTitle = "",
}: {
    children: any;
    style?: React.CSSProperties;
    to: string;
    onClick?: () => void;
    tooltipTitle?: string;
}) => {
    const defaultStyles: React.CSSProperties = {
        textDecoration: "none",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return (
        <Tooltip title={tooltipTitle}>
            <Link style={combinedStyles} to={to} onClick={onClick}>
                {children}
            </Link>
        </Tooltip>
    );
};

export default CustomLink;
