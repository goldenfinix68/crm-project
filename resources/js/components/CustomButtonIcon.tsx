import React from "react";
import { Link } from "react-router-dom";

const CustomButtonIcon = ({
    children,
    style,
}: {
    children: any;
    style?: React.CSSProperties;
}) => {
    const defaultStyles: React.CSSProperties = {
        cursor: "pointer",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return <div style={combinedStyles}>{children}</div>;
};

export default CustomButtonIcon;
