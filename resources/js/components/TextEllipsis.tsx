import React from "react";

const TextEllipsis = ({
    children,
    style,
}: {
    children: any;
    style?: React.CSSProperties;
}) => {
    const defaultStyles: React.CSSProperties = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "calc(100% - 10px)",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return <div style={combinedStyles}>{children}</div>;
};

export default TextEllipsis;
