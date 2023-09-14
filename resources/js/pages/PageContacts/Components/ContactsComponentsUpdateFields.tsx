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

                    <Form.Item name="APN">
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
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Address Line 1</Typography>
                    <Form.Item name="addressLine1">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "addressLine2":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Address Line 2</Typography>
                    <Form.Item name="addressLine2">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "assessedValue":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Assessed Value</Typography>
                    <Form.Item name="assessedValue">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "assessedVsOpeningMargin":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Assessed vs. Opening Bid Margin (manual)
                    </Typography>
                    <Form.Item name="assessedVsOpeningMargin">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "assessedVsOpeningMultiple":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Assessed vs. Opening Bid Multiple (manual)
                    </Typography>
                    <Form.Item name="assessedVsOpeningMultiple">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "city":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">City</Typography>
                    <Form.Item name="city">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "country":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Country</Typography>
                    <Form.Item name="country">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "county":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">County</Typography>
                    <Form.Item name="county">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "countryLink":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Country Link</Typography>
                    <Form.Item name="countryLink">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "description":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Description</Typography>
                    <Form.Item name="description">
                        <Input.TextArea />
                    </Form.Item>
                </>
            );
            break;
        case "emailOptOut":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Email Opt Out</Typography>
                    <Form.Item name="emailOptOut">
                        <Select
                            defaultValue="1"
                            onChange={handleChange}
                            options={[
                                { value: "1", label: "Yes" },
                                { value: "0", label: "No" },
                            ]}
                        />
                    </Form.Item>
                </>
            );
            break;
        case "emailOptOutReason":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Email Opt Out Reason
                    </Typography>
                    <Form.Item name="emailOptOutReason">
                        <Input.TextArea />
                    </Form.Item>
                </>
            );
            break;
        case "facebook":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Facebook</Typography>
                    <Form.Item name="facebook">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "firstName":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">First Name</Typography>
                    <Form.Item name="firstName">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "floodZone":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Flood Zone</Typography>
                    <Form.Item name="floodZone">
                        <Select
                            defaultValue="1"
                            onChange={handleChange}
                            options={[
                                { value: "1", label: "Yes" },
                                { value: "0", label: "No" },
                            ]}
                        />
                    </Form.Item>
                </>
            );
            break;
        case "googleMapLink":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Google Map Link</Typography>
                    <Form.Item name="googleMapLink">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "instagram":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Instagram</Typography>
                    <Form.Item name="instagram">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "jobTitle":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Job Title</Typography>
                    <Form.Item name="jobTitle">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "lastName":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Last Name</Typography>
                    <Form.Item name="lastName">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "legalDescription":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Legal Description
                    </Typography>
                    <Form.Item name="legalDescription">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "detailsLegalDescription":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Legal Description
                    </Typography>
                    <Form.Item name="detailsLegalDescription">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "linkedIn":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">LinkedIn</Typography>
                    <Form.Item name="linkedIn">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "mailingCity":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing City</Typography>
                    <Form.Item name="mailingCity">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "mailingCounty":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing County</Typography>
                    <Form.Item name="mailingCounty">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "mailingState":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing State</Typography>
                    <Form.Item name="mailingState">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "mailingStreetAddress":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Mailing Steet Address
                    </Typography>
                    <Form.Item name="mailingStreetAddress">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "mailingZip":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Mailing Zip</Typography>
                    <Form.Item name="mailingZip">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "marketAreaName":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">MarketAreaName</Typography>
                    <Form.Item name="marketAreaName">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "openingBid":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Opening Bid</Typography>
                    <Form.Item name="openingBid">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "owner":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Owner</Typography>
                    <Form.Item name="owner">
                        <Select
                            defaultValue="1"
                            onChange={handleChange}
                            options={[
                                { value: "1", label: "Jesse Admin" },
                                // { value: "0", label: "No" },
                            ]}
                        />
                    </Form.Item>
                </>
            );
            break;
        case "redfinQuickLink":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Redfin Quick Link
                    </Typography>
                    <Form.Item name="redfinQuickLink">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "roadFrontage":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">
                        Road Frontage (ft)
                    </Typography>
                    <Form.Item name="roadFrontage">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "smsOptOut":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">SMS Opt Out</Typography>
                    <Form.Item name="smsOptOut">
                        <Select
                            defaultValue="1"
                            onChange={handleChange}
                            options={[
                                { value: "1", label: "Yes" },
                                { value: "0", label: "No" },
                            ]}
                        />
                    </Form.Item>
                </>
            );
            break;
        case "skype":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Skype</Typography>
                    <Form.Item name="skype">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "state":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">State</Typography>
                    <Form.Item name="state">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "subdivision":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Subdivision</Typography>
                    <Form.Item name="subdivision">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "legalSubdivision":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Subdivision</Typography>
                    <Form.Item name="legalSubdivision">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "tags":
            return (
                <>
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
                    <Form.Item name="tags">
                        <Select
                            mode="tags"
                            style={{ width: "100%" }}
                            tokenSeparators={[","]}
                            // options={options}
                        />
                    </Form.Item>
                </>
            );
            break;
        case "topogprahy":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Topography</Typography>
                    <Form.Item name="topogprahy">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "twitter":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Twitter</Typography>
                    <Form.Item name="twitter">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "type":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Type</Typography>
                    <Form.Item name="type">
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
                </>
            );
            break;
        case "website":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Website</Typography>
                    <Form.Item name="website">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        case "wetlandsStatus":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Wetlands Status</Typography>
                    <Form.Item name="wetlandsStatus">
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
                </>
            );
            break;
        case "zipCode":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">ZipCode</Typography>
                    <Form.Item name="zipCode">
                        <Input />
                    </Form.Item>
                </>
            );
            break;

        default:
            break;
    }
    return <>{}</>;
};

export default ContactsComponentsUpdateFields;
