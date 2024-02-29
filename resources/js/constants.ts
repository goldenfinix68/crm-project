import { TFilter } from "./entities";

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
        type: "text",
        description: "The text fields can store up to 255 characters.",
        icon: "text",
    },
    {
        label: "Text Area",
        type: "textArea",
        description:
            "This field lets you store much bigger texts than text fields. Such fields are not visible on reports or grids.",
        icon: "text-area",
    },
    {
        label: "Integer",
        type: "int",
        description:
            "The integer field can have numeric values without any decimal points.",
        icon: "integer",
    },
    {
        label: "Decimal",
        type: "decimal",
        description:
            "The decimal field can have numeric values with two decimal points.",
        icon: "decimal",
    },
    {
        label: "Date",
        type: "date",
        description:
            "The field lets you select date input using the calendar component.",
        icon: "date",
    },
    {
        label: "Date Time",
        type: "dateTime",
        description:
            "The field lets you select a date and time information using calendar + time picker.",
        icon: "date",
    },
    {
        label: "Email",
        type: "email",
        description: "The field lets you enter a valid email address..",
        icon: "email",
    },
    {
        label: "Mobile",
        type: "mobile",
        description: "The field lets you enter a mobile number.",
        icon: "mobile",
    },
    {
        label: "Phone",
        type: "phone",
        description: "The field lets you enter a phone number.",
        icon: "phone",
    },
    {
        label: "Select",
        type: "select",
        description:
            "The field lets you define a list of options that will appear in the dropdown. You can select a single option from the list.",
        icon: "select",
    },
    {
        label: "Multi Select",
        type: "multiSelect",
        description:
            "The field lets you define a list of options that will appear in the dropdown. You can select multiple options from the list.",
        icon: "multi-select",
    },
    {
        label: "Contact Lookup",
        type: "contactLookup",
        description:
            "The field lets you associate the contact record with your module.",
        icon: "contact-lookup",
    },
    {
        label: "User Lookup",
        type: "userLookup",
        description:
            "The field lets you associate the user record with your module.",
        icon: "user-lookup",
    },
    {
        label: "Contact Type Lookup",
        type: "contactTypeLookup",
        description:
            "The field lets you associate a contact type record with your module.",
        icon: "contactTypeLookup",
    },
    {
        label: "URL",
        type: "url",
        description:
            "This field lets you enter a website or page URL, which appears as a clickable link.",
        icon: "url",
    },
    {
        label: "Big Integer",
        type: "bigInt",
        description:
            "The big integer field can have numeric values without any decimal points.  Big Integer can go up to 9223372036854775807.",
        icon: "big-integer",
    },
    {
        label: "Percentage",
        type: "percentage",
        description:
            "The field can have numeric values that appear with a % sign during display.",
        icon: "percentage",
    },
    {
        label: "Boolean",
        type: "boolean",
        description:
            "The field lets you create a single value (true/false) option with a toggle operation.",
        icon: "boolean",
    },
    {
        label: "Currency",
        type: "currency",
        description:
            "The field lets you create a numeric value with decimals that appears with the organization's currency symbol during display.",
        icon: "currency",
    },
    {
        label: "Tag",
        type: "tag",
        description:
            "The field lets you enter custom values or tags that are not part of the predefined options.",
        icon: "tag",
        creationLimit: 1,
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
        mergeField: "{{contact.firstName}}",
    },
    {
        label: "Last Name",
        value: "lastName",
        mergeField: "{{contact.lastName}}",
    },
    {
        label: "Mobile",
        value: "mobile",
        mergeField: "{{contact.mobile}}",
    },
    {
        label: "Country Link",
        value: "countryLink",
        mergeField: "{{contact.countryLink}}",
    },
    {
        label: "Acres",
        value: "acres",
        mergeField: "{{contact.acres}}",
    },
    {
        label: "Email",
        value: "email",
        mergeField: "{{contact.email}}",
    },
    {
        label: "Job Title",
        value: "jobTitle",
        mergeField: "{{contact.jobTitle}}",
    },
    {
        label: "Phone",
        value: "phone",
        mergeField: "{{contact.phone}}",
    },
    {
        label: "Other Phone",
        value: "otherPhone",
        mergeField: "{{contact.otherPhone}}",
    },
    // {
    //     label: "Owner ID",
    //     value: "ownerId",
    //     mergeField: "{{contact.ownerId}}",
    // },
    {
        label: "Email 2",
        value: "email2",
        mergeField: "{{contact.email2}}",
    },
    // {
    //     label: "Type ID",
    //     value: "typeId",
    //     mergeField: "{{contact.typeId}}",
    // },
    // {
    //     label: "Type",
    //     value: "type",
    //     mergeField: "{{contact.type}}",
    // },
    {
        label: "Mailing Street Address",
        value: "mailingStreetAddress",
        mergeField: "{{contact.mailingStreetAddress}}",
    },
    {
        label: "Email Opt Out",
        value: "emailOptOut",
        mergeField: "{{contact.emailOptOut}}",
    },
    {
        label: "Mailing City",
        value: "mailingCity",
        mergeField: "{{contact.mailingCity}}",
    },
    {
        label: "Mailing Country",
        value: "mailingCountry",
        mergeField: "{{contact.mailingCountry}}",
    },
    {
        label: "Subdivision",
        value: "subdivision",
        mergeField: "{{contact.subdivision}}",
    },
    {
        label: "APN",
        value: "APN",
        mergeField: "{{contact.APN}}",
    },
    {
        label: "Google Map Link",
        value: "gMapLink",
        mergeField: "{{contact.gMapLink}}",
    },
    {
        label: "Road Frontage",
        value: "roadFrontage",
        mergeField: "{{contact.roadFrontage}}",
    },
    {
        label: "Redfin Link",
        value: "redfinLink",
        mergeField: "{{contact.redfinLink}}",
    },
    {
        label: "Opening Bid",
        value: "openingBid",
        mergeField: "{{contact.openingBid}}",
    },
    {
        label: "Assessed Value",
        value: "assessedValue",
        mergeField: "{{contact.assessedValue}}",
    },
    {
        label: "Assessed vs Opening Margin",
        value: "assessedVsOpeningMargin",
        mergeField: "{{contact.assessedVsOpeningMargin}}",
    },
];

export const DEAL_COLUMNS = [
    {
        label: "Title",
        value: "title",
        mergeField: "{{deal.title}}",
    },
    {
        label: "Win Probability",
        value: "win_probabilty",
        mergeField: "{{deal.win_probabilty}}",
    },
    {
        label: "Estimated closed date",
        value: "estimated_close_date",
        mergeField: "{{deal.estimated_close_date}}",
    },
    {
        label: "Value",
        value: "value",
        mergeField: "{{deal.value}}",
    },
    {
        label: "Currency",
        value: "currency",
        mergeField: "{{deal.currency}}",
    },
    {
        label: "Status",
        value: "status",
        mergeField: "{{deal.status}}",
    },
    {
        label: "Stage",
        value: "stage",
        mergeField: "{{deal.stage}}",
    },
    {
        label: "Priority",
        value: "priority",
        mergeField: "{{deal.priority}}",
    },
];

export const ACTIVITY_COLUMNS = [
    {
        label: "Title",
        value: "title",
        mergeField: "{{activity.title}}",
    },
    {
        label: "Type",
        value: "type",
        mergeField: "{{activity.type}}",
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

export const defaultFilter: TFilter = {
    filters: {
        conditions: [],
        conditionalOperator: "and",
    },
    page: 1,
    page_size: 50,
    total: 0,
};

export const allowedroleToAccess = ["superAdmin", "mainUser", "user"];

export const userRoleOption = [
    { value: "superAdmin", label: "Super Admin" },
    { value: "mainUser", label: "Main User" },
    { value: "user", label: "User" },
    { value: "stats", label: "Stats" },
];
