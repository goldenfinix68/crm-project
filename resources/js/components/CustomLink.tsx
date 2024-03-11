import React from "react";
import { Link } from "react-router-dom";

const CustomLink = ({
    children,
    style,
    to,
    onClick,
}: {
    children: any;
    style?: React.CSSProperties;
    to: string;
    onClick?: () => void;
}) => {
    const defaultStyles: React.CSSProperties = {
        textDecoration: "none",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return (
        <Link style={combinedStyles} to={to} onClick={onClick}>
            {children}
        </Link>
    );
};

export default CustomLink;
