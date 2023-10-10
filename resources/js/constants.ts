export const DEFAULT_REQUIRED_MESSAGE = "This message is required";

export const COLUMN_LIST = [
    "Id",
    "Title",
    "Duration",
    "Owner",
    "Availability",
    "Start Date",
    "Location",
    "Type",
    "Video Conferencing",
    "Title (Deal)",
    "Name (Contact)",
    "Tags",
    "End Date",
    "Created By",
    "Completed Date",
    "Last Modified By",
    "Created At",
    "Last Note Added At",
    "Last Modified Date",
    "Last Note Added",
    "Last Note Added By",
    "Created Longitude",
    "Created Latitude",
    "Created Address",
];

export const FIELD_TYPE_LIST = [
    {
        label: "Text",
        type: "Text",
        description: "The text fields can store up to 255 characters.",
        icon: "text",
    },
    {
        label: "Text Area",
        type: "Text Area",
        description:
            "This field lets you store much bigger texts than text fields. Such fields are not visible on reports or grids.",
        icon: "text-area",
    },
    {
        label: "Integer",
        type: "Integer",
        description:
            "The integer field can have numeric values without any decimal points.",
        icon: "integer",
    },
    {
        label: "Decimal",
        type: "Decimal",
        description:
            "The decimal field can have numeric values with two decimal points.",
        icon: "decimal",
    },
    {
        label: "Date",
        type: "Date",
        description:
            "The field lets you select date input using the calendar component.",
        icon: "date",
    },
    {
        label: "Date Time",
        type: "Date Time",
        description:
            "The field lets you select a date and time information using calendar + time picker.",
        icon: "date",
    },
    {
        label: "Email",
        type: "Email",
        description: "The field lets you enter a valid email address..",
        icon: "email",
    },
    {
        label: "Phone",
        type: "Phone",
        description: "The field lets you enter a phone or mobile number.",
        icon: "phone",
    },
    {
        label: "Select",
        type: "Select",
        description:
            "The field lets you define a list of options that will appear in the dropdown. You can select a single option from the list.",
        icon: "select",
    },
    {
        label: "Multi Select",
        type: "Multi Select",
        description:
            "The field lets you define a list of options that will appear in the dropdown. You can select multiple options from the list.",
        icon: "multi-select",
    },
    // {
    //     label: "Contact Lookup",
    //     type: "Contact Lookup",
    //     description:
    //         "The field lets you associate the contact record with your module.",
    //     icon: "contact-lookup",
    // },
    // {
    //     label: "User Lookup",
    //     type: "User Lookup",
    //     description:
    //         "The field lets you associate the user record with your module.",
    //     icon: "user-lookup",
    // },
    {
        label: "URL",
        type: "URL",
        description:
            "This field lets you enter a website or page URL, which appears as a clickable link.",
        icon: "url",
    },
    {
        label: "Big Integer",
        type: "Big Integer",
        description:
            "The big integer field can have numeric values without any decimal points.  Big Integer can go up to 9223372036854775807.",
        icon: "big-integer",
    },
    {
        label: "Percentage",
        type: "Percentage",
        description:
            "The field can have numeric values that appear with a % sign during display.",
        icon: "percentage",
    },
    {
        label: "Boolean",
        type: "Boolean",
        description:
            "The field lets you create a single value (true/false) option with a toggle operation.",
        icon: "boolean",
    },
    {
        label: "Currency",
        type: "Currency",
        description:
            "The field lets you create a numeric value with decimals that appears with the organization's currency symbol during display.",
        icon: "currency",
    },
];

export const CONTACT_LIST_ACTION = [
    {
        value: "Transfer",
        label: "Mass Transfer Contacts",
        disabled: true,
    },
    {
        value: "Delete",
        label: "Mass Delete Contacts",
        disabled: true,
    },
    {
        value: "Update",
        label: "Mass Update Contacts",
        disabled: true,
    },
    { value: "Merge", label: "Merge Contacts", disabled: true },

    {
        value: "ImportExcel",
        label: "Import from Excel or CSV file",
        disabled: true,
    },
    {
        value: "ImportGoogle",
        label: "Import Google Contacts",
        disabled: true,
    },
    {
        value: "Export",
        label: "Export Contacts",
        disabled: true,
    },
    {
        value: "ViewDeleted",
        label: "View Recent Deleted Records",
        disabled: true,
    },
];
export const CONTACT_COLUMNS = [
    {
        label: "First Name",
        value: "firstName",
    },
    {
        label: "Last Name",
        value: "lastName",
    },
    {
        label: "Mobile",
        value: "mobile",
    },
    {
        label: "Country Link",
        value: "countryLink",
    },
    {
        label: "Acres",
        value: "acres",
    },
    {
        label: "Email",
        value: "email",
    },
    {
        label: "Job Title",
        value: "jobTitle",
    },
    {
        label: "Phone",
        value: "phone",
    },
    {
        label: "Other Phone",
        value: "otherPhone",
    },
    {
        label: "Owner ID",
        value: "ownerId",
    },
    {
        label: "Email 2",
        value: "email2",
    },
    {
        label: "Type ID",
        value: "typeId",
    },
    {
        label: "Type",
        value: "type",
    },
    {
        label: "Mailing Street Address",
        value: "mailingStreetAddress",
    },
    {
        label: "Email Opt Out",
        value: "emailOptOut",
    },
    {
        label: "Mailing City",
        value: "mailingCity",
    },
    {
        label: "Mailing Country",
        value: "mailingCountry",
    },
    {
        label: "Subdivision",
        value: "subdivision",
    },
    {
        label: "APN",
        value: "APN",
    },
    {
        label: "Google Map Link",
        value: "gMapLink",
    },
    {
        label: "Road Frontage",
        value: "roadFrontage",
    },
    {
        label: "Redfin Link",
        value: "redfinLink",
    },
    {
        label: "Opening Bid",
        value: "openingBid",
    },
    {
        label: "Assessed Value",
        value: "assessedValue",
    },
    {
        label: "Assessed vs Opening Margin",
        value: "assessedVsOpeningMargin",
    },
    {
        label: "Assessed vs Opening Multiple",
        value: "assessedVsOpeningMultiple",
    },
    {
        label: "Wetlands Status",
        value: "wetlandsStatus",
    },
    {
        label: "Legal Description",
        value: "legalDescription",
    },
    {
        label: "Legal Subdivision",
        value: "legalSubdivision",
    },
    {
        label: "Flood Zone",
        value: "floodzone",
    },
    {
        label: "Topography",
        value: "topography",
    },
    {
        label: "Wireless 1",
        value: "wireless1",
    },
    {
        label: "Wireless 2",
        value: "wireless2",
    },
    {
        label: "Wireless 3",
        value: "wireless3",
    },
    {
        label: "Wireless 4",
        value: "wireless4",
    },
    {
        label: "Landline 1",
        value: "landline1",
    },
    {
        label: "Landline 2",
        value: "landline2",
    },
    {
        label: "Landline 3",
        value: "landline3",
    },
    {
        label: "Landline 4",
        value: "landline4",
    },
    {
        label: "Market Area Name",
        value: "marketAreaName",
    },
    {
        label: "Skype",
        value: "skype",
    },
    {
        label: "Website",
        value: "website",
    },
    {
        label: "Facebook",
        value: "facebook",
    },
    {
        label: "LinkedIn",
        value: "linkedIn",
    },
    {
        label: "Twitter",
        value: "twitter",
    },
    {
        label: "Instagram",
        value: "instagram",
    },
    {
        label: "Details Description",
        value: "detailsDescription",
    },
    {
        label: "Tags",
        value: "tags",
    },
    {
        label: "Details Legal Description",
        value: "detailsLegalDescription",
    },
    {
        label: "Address Line 1",
        value: "addressLine1",
    },
    {
        label: "Address Line 2",
        value: "addressLine2",
    },
    {
        label: "City",
        value: "city",
    },
    {
        label: "Country",
        value: "country",
    },
    {
        label: "Zip Code",
        value: "zipCode",
    },
    {
        label: "State",
        value: "state",
    },
    {
        label: "Owner",
        value: "owner",
    },
    {
        label: "Wall",
        value: "wall",
    },
    {
        label: "Texts",
        value: "texts",
    },
    {
        label: "Mailing State",
        value: "mailingState",
    },
    {
        label: "SMS Opt Out",
        value: "smsOptOut",
    },
    {
        label: "Email Opt Out Reason",
        value: "emailOptOutReason",
    },
    {
        label: "Mailing Zip",
        value: "mailingZip",
    },
    {
        label: "County",
        value: "county",
    },
    {
        label: "Default Mobile Number",
        value: "defaultMobileNumber",
    },
];

export const FILTER_OPTIONS = [
    {
        value: "contains",
        label: "Contains",
    },
    {
        value: "notContains",
        label: "Does not contains",
    },
    {
        value: "equals",
        label: "Equals to",
    },
    {
        value: "notEquals",
        label: "Not equals to",
    },
    {
        value: "startsWith",
        label: "Starts with",
    },
    {
        value: "endsWith",
        label: "Ends with",
    },
    {
        value: "empty",
        label: "Is unknown",
    },
    {
        value: "notEmpty",
        label: "Has any value",
    },
];
