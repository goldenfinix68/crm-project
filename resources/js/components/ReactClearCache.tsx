import React, { useState } from "react";
import { GiftOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { updateAppVersion } from "../helpers";
import { isAppLatestVersion as isLatestVersion } from "../helpers";

const ReactClearCache = () => {
    const [isAppLatestVersion, setIsAppLatestVersion] = useState<boolean>(true);

    React.useEffect(() => {
        const fetchAppVersion = async () => {
            const version = await isLatestVersion();
            setIsAppLatestVersion(version);
        };

        fetchAppVersion();
    }, []);
    return (
        <>
            {!isAppLatestVersion && (
                <div className="updateAvailableDiv">
                    <div className="div1">
                        <GiftOutlined />
                    </div>
                    <div className="div2">
                        <h5>Updates available</h5>
                        <p>
                            A new and better version of the app is installed
                            <br />
                            and ready. Reload the page to get all the changes.
                        </p>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                updateAppVersion();
                            }}
                            type="primary"
                        >
                            Reload
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReactClearCache;
