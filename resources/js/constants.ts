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
