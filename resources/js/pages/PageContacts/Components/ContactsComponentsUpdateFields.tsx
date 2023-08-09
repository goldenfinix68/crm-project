import { CaretDownFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
    Button,
    Col,
    Dropdown,
    Modal,
    Row,
    Space,
    Input,
    Select,
    Typography,
    Checkbox,
    Divider,
    Form,
} from "antd";

import React, { useEffect, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact } from "../../../entities";

interface ContactsComponentsUpdateFields {
    activeField: string;
}

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

const ContactsComponentsUpdateFields = ({ activeField }) => {
    switch (activeField) {
        case "apn":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">APN</Typography>

                    <Form.Item name="apn">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "acres":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Acres</Typography>

                    <Form.Item name="acres">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "addressLine1":
            return (
                <Form.Item name="addressLine1">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Address Line 1</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "addressLine2":
            return (
                <Form.Item name="addressLine2">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Address Line 2</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "assessedValue":
            return (
                <Form.Item name="assessedValue">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Assessed Value</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "assessedVsOpeningMargin":
            return (
                <Form.Item name="assessedVsOpeningMargin">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Assessed vs. Opening Bid Margin (manual)
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "assessedVsOpeningMultiple":
            return (
                <Form.Item name="assessedVsOpeningMultiple">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Assessed vs. Opening Bid Multiple (manual)
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "city":
            return (
                <Form.Item name="city">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">City</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "country":
            return (
                <Form.Item name="country">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Country</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "county":
            return (
                <Form.Item name="county">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">County</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "countyLink":
            return (
                <Form.Item name="countyLink">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">County Link</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "description":
            return (
                <Form.Item name="description">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Description</Typography>
                    <Input.TextArea />
                </Form.Item>
            );
            break;
        case "emailOptOut":
            return (
                <Form.Item name="emailOptOut">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Email Opt Out</Typography>
                    <Select
                        defaultValue="1"
                        onChange={handleChange}
                        options={[
                            { value: "1", label: "Yes" },
                            { value: "0", label: "No" },
                        ]}
                    />
                </Form.Item>
            );
            break;
        case "emailOptOutReason":
            return (
                <Form.Item name="emailOptOutReason">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Email Opt Out Reason
                    </Typography>
                    <Input.TextArea />
                </Form.Item>
            );
            break;
        case "facebook":
            return (
                <Form.Item name="facebook">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Facebook</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "firstName":
            return (
                <Form.Item name="firstName">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">First Name</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "floodZone":
            return (
                <Form.Item name="floodZone">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Flood Zone</Typography>
                    <Select
                        defaultValue="1"
                        onChange={handleChange}
                        options={[
                            { value: "1", label: "Yes" },
                            { value: "0", label: "No" },
                        ]}
                    />
                </Form.Item>
            );
            break;
        case "googleMapLink":
            return (
                <Form.Item name="googleMapLink">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Google Map Link</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "instagram":
            return (
                <Form.Item name="instagram">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Instagram</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "jobTitle":
            return (
                <Form.Item name="jobTitle">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Job Title</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "lastName":
            return (
                <Form.Item name="lastName">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Last Name</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "legalDescription":
            return (
                <Form.Item name="legalDescription">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Legal Description
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "legalDescription":
            return (
                <Form.Item name="legalDescription">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Legal Description
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "linkedIn":
            return (
                <Form.Item name="linkedIn">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">LinkedIn</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "mailingCity":
            return (
                <Form.Item name="mailingCity">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing City</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "mailingCounty":
            return (
                <Form.Item name="mailingCounty">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing County</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "mailingState":
            return (
                <Form.Item name="mailingState">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing State</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "mailingStreetAddress":
            return (
                <Form.Item name="mailingStreetAddress">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Mailing Steet Address
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "mailingZip":
            return (
                <Form.Item name="mailingZip">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing Zip</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "marketAreaName":
            return (
                <Form.Item name="marketAreaName">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">MarketAreaName</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "openingBid":
            return (
                <Form.Item name="openingBid">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Opening Bid</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "owner":
            return (
                <Form.Item name="owner">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Owner</Typography>
                    <Select
                        defaultValue="1"
                        onChange={handleChange}
                        options={[
                            { value: "1", label: "Jesse Admin" },
                            // { value: "0", label: "No" },
                        ]}
                    />
                </Form.Item>
            );
            break;
        case "redfinQuickLink":
            return (
                <Form.Item name="redfinQuickLink">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Redfin Quick Link
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "roadFrontage":
            return (
                <Form.Item name="roadFrontage">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Road Frontage (ft)
                    </Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "smsOptOut":
            return (
                <Form.Item name="smsOptOut">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">SMS Opt Out</Typography>
                    <Select
                        defaultValue="1"
                        onChange={handleChange}
                        options={[
                            { value: "1", label: "Yes" },
                            { value: "0", label: "No" },
                        ]}
                    />
                </Form.Item>
            );
            break;
        case "skype":
            return (
                <Form.Item name="skype">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Skype</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "state":
            return (
                <Form.Item name="state">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">State</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "subdivision":
            return (
                <Form.Item name="subdivision">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Subdivision</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "subdivision":
            return (
                <Form.Item name="subdivision">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Subdivision</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "tags":
            return (
                <Form.Item name="tags">
                    <Select
                        className="m-b-md"
                        defaultValue="append"
                        onChange={handleChange}
                        options={[
                            { value: "append", label: "Append" },
                            { value: "remove", label: "Remove" },
                            { value: "equal", label: "Equal" },
                        ]}
                    />
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Tags</Typography>
                    <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        tokenSeparators={[","]}
                        // options={options}
                    />
                </Form.Item>
            );
            break;
        case "topogprahy":
            return (
                <Form.Item name="topogprahy">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Topography</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "twitter":
            return (
                <Form.Item name="twitter">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Twitter</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "type":
            return (
                <Form.Item name="type">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Type</Typography>
                    <Select
                        className="m-b-md"
                        defaultValue="Select"
                        onChange={handleChange}
                        options={[
                            {
                                value: "Customer",
                                label: "Customer",
                            },
                            {
                                value: "Lead",
                                label: "Lead",
                            },
                            {
                                value: "Vendor",
                                label: "Vendor",
                            },
                            {
                                value: "Partner",
                                label: "Partner",
                            },
                            {
                                value: "Competitor",
                                label: "Competitor",
                            },
                            {
                                value: "Reseller",
                                label: "Reseller",
                            },
                            {
                                value: "Other",
                                label: "Other",
                            },
                        ]}
                    />
                </Form.Item>
            );
            break;
        case "website":
            return (
                <Form.Item name="website">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Website</Typography>
                    <Input />
                </Form.Item>
            );
            break;
        case "wetlandsStatus":
            return (
                <Form.Item name="wetlandsStatus">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Wetlands Status</Typography>
                    <Select
                        className="m-b-md"
                        defaultValue="Select"
                        onChange={handleChange}
                        options={[
                            { value: "None", label: "None" },
                            {
                                value: "Small Portion",
                                label: "Small Portion",
                            },
                            { value: "Half", label: "Half" },
                            {
                                value: "Most",
                                label: "Most",
                            },
                            { value: "All", label: "All" },
                        ]}
                    />
                </Form.Item>
            );
            break;
        case "zipCode":
            return (
                <Form.Item name="zipCode">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">ZipCode</Typography>
                    <Input />
                </Form.Item>
            );
            break;

        default:
            break;
    }
    return <>{}</>;
};

export default ContactsComponentsUpdateFields;
