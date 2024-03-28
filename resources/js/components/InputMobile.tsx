import React, { useEffect, useState } from "react";
import { Input, InputNumber, Select } from "antd";
import { ENDPOINTS } from "../endpoints";
import { mutateGet } from "../api/mutation/useSetupMutation";
import { defaultFilter } from "../constants";
import _ from "lodash";

interface Props {
    ref?: any;
}

const InputMobile = ({ ref }: Props) => {
    const mobileFormatter = (value) => {
        // Implement mobile formatting logic here
        // For example, format as (XXX) XXX-XXXX
        return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    };

    // Parser function to remove non-numeric characters
    const mobileParser = (value) => value.replace(/\D/g, "");
    return (
        <InputNumber
            className="w-100"
            ref={ref}
            formatter={mobileFormatter}
            parser={mobileParser}
        />
    );
};

export default InputMobile;
