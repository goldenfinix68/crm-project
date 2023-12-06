import React from "react";
import { Link } from "react-router-dom";

const CustomLink = ({
    children,
    style,
    to,
}: {
    children: any;
    style?: React.CSSProperties;
    to: string;
}) => {
    const defaultStyles: React.CSSProperties = {
        textDecoration: "none",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return (
        <Link style={combinedStyles} to={to}>
            {children}
        </Link>
    );
};

export default CustomLink;
