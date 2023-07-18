import { Avatar, Popover } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import React from "react";

const AvatarWithPopover = () => {
    const [avatarHovered, setAvatarHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setAvatarHovered(true);
    };

    const handleMouseLeave = () => {
        setAvatarHovered(false);
    };

    const AvatarContent = (
        <Popover content="Change Avatar" placement="bottom">
            <Avatar
                size={50}
                style={{ backgroundColor: "#00AC7C", verticalAlign: "middle" }}
            >
                {avatarHovered ? (
                    <CameraOutlined style={{ cursor: "pointer" }} />
                ) : (
                    "K"
                )}
            </Avatar>
        </Popover>
    );

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {AvatarContent}
        </div>
    );
};

export default AvatarWithPopover;
