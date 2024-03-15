export type TUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    forwardingType?: string;
    forwardTo?: string;
    main_user?: TUser;
    settings?: TUserSettings;
    mobileNumbers?: TMobileNumber[];
};

export type TMobileNumber = {
    id: string;
    mobileNumber: string;
    nickname?: string;
};

export type TSipTrunkingConnection = {
    telnyxConnectionId: string;
    telnyxConnectionName: string;
    telnyxConnectionUserName: string;
    telnyxConnectionPassword: string;
    numbers: TMobileNumber[];
};

export type TContactType = {
    id?: string;
    name: string;
    highlight: string;
};

export type TNote = {
    id?: string;
    contactId: string;
    notes: string;
};

export type TTextTemplateFolder = {
    id?: string;
    name: string;
};

export type TTextLabel = {
    id?: string;
    name: string;
};

export type TTextTemplate = {
    id?: string;
    name: string;
    folderId: string;
    folder?: TTextTemplateFolder;
    user?: TUser;
    textMessage: string;
    deleted_at?: string;
};

export type TCallHistory = {
    isToApp: any;
    url_recording: string;
    telnyxCallSessionId: string;
    recording_url?: string;
    isAnswered: boolean;
    dateTime: string;
    isFromApp: string;
    contactName: string;
    userName: string;
    duration: string;
    from: string;
    to: string;
};

export type TText = {
    id?: string;
    userId?: string;
    contactId?: string;
    from: string;
    to: string;
    message: string;
    type: "sent" | "received" | "scheduled";
    sender: string;
    receivers: string;
    day: string;
    month: string;
    year: string;
    created_at: string;
    time: string;
    isFromApp: boolean;
    status?: string;
    telnyxResponse?: string;
    schedule?: string;
    seen_at?: string;
};

export type TTextThreadList = {
    id: string;
    contactId?: string;
    contactName: string;
    lastText: string;
    created_at: string;
    haveDuplicatePhoneNumbers: boolean;
    isContactSaved: boolean;
    isLastTextSeen: boolean;
    labels?: TTextLabel[];
};

export type TTextThreadContent = {
    id: string;
    phoneNumbers: string;
    contact?: TContact;
    contactName: string;
    texts: TText[];
};

export type TDeal = {
    id?: string;
    contact?: TContact;
    pipeline?: TDealPipeline;
    stage?: TDealPipelineStage;
    contactId?: string;
    pipelineId?: string;
    stageId?: string;
    aging: string;
    created_at?: string;
    creator?: TUser;
};

export type TUpdateOwner = {
    firstName: string;
    id: any;
};

export type TUpdate = {
    id: string;
    userId: string;
    by: string;
    title: string;
    from: string;
    to: string;
    type: string;
    owner: TUpdateOwner;
    start_date: string;
    outcome: string;
    firstName: string;
    uploaded_by: any;
    file_url: string;
    file_size: string;
    file_name: string;
    availability: string;
};

export type TWorkflow = {
    id: any;
    type: string;
    action: string;
    startOn: string;
    batchQuantity: number;
    repeatAfter: string;
    repeatAfterType: "days" | "hours" | "minutes" | "seconds";
    sendOn: string;
    startFrom: string;
    endsAt: string;
    message: string;
    timezone: string;
    contactIds?: string[];
    user?: TUser;
    items?: TWorkflowItem[];
    total: number;
    completedAt?: string;
};

export type TWorkflowItem = {
    id: any;
    workflowId: string;
    contactIds?: string[];
    trigger_at: string;
    queue_lock: boolean;
    success: number;
    failed: number;
    total: number;
};

export type TCustomFieldSection = {
    id: any;
    columnLayout: string;
    name: string;
    sort: number;
    type: string;
    fields?: TCustomField[];
    inactivefields?: TCustomField[];
    isDefault: boolean;
};

export type TCustomField = {
    id?: string;
    type: string;
    fieldName: string;
    label: string;
    options?: string;
    customFieldSectionId?: string;
    isRequired: boolean;
    isActive?: boolean;
    isDefault?: boolean;
    sort?: string;
    associationType?: string;
    relatedRecordLabel?: string;
    fieldType?: string;
    isDisplayTable?: boolean;
    tableSort?: number;
    phoneFieldStatus?: string;
};

export type TCustomFieldValue = {
    id: string;
    customableId?: string;
    customFieldName: string;
    value?: string;
};

export type TDealPipeline = {
    id: string;
    name: string;
    stages?: TDealPipelineStage[];
};

export type TDealPipelineStage = {
    id: string;
    name: string;
    pipeline?: TDealPipeline;
    dealPipelineId?: string;
    deals?: TDeal[];
};

export type TWallData = {
    date: string;
    day: string;
    month: string;
    year: string;
    type:
        | "call"
        | "text"
        | "note"
        | "deal"
        | "update"
        | "activity log"
        | "files"
        | "activities";
    note?: TNote;
    text?: TText;
    deal?: TDeal;
    update?: TUpdate;
    activity?: TUpdate;
    call?: TCallHistory;
};

export type TContact = {
    id: string;
    defaultMobileNumber?: string;
    fields: {
        [key: string]: any;
    };
    wall?: TWallData[];
    deals?: TDeal[];
    deal?: TDeal;
    phoneNumbers?: string[];
    duplicatePhoneNumbers?: string[];
};

export type TFilterCondition = {
    key: string;
    column: { label: string; value: string };
    condition: string;
    value: string;
};

export type TFilters = {
    conditions: Array<TFilterCondition>;
    conditionalOperator: "and" | "or";
};

export type TFilter = {
    id: string;
    name: string;
    filters: TFilters;
};

export type TGSheetCrawlHistory = {
    id: string;
    triggeredBy: string;
    gSheetId: string;
    gSheetData?: string;
    created_at: string;
    initiatedBy: string;
    status: "Completed" | "Failed" | "Queued" | "Running";
    importedCount?: string;
    rowCount?: string;
    processed?: number;
};
export type TGSheetCrawl = {
    id: string;
    gSheetId: string;
    interval: number;
};

export type TGSheetCrawlResult = {
    isImportedToRoor: boolean;
    errors?: string[];
};

export type TUserSettings = {
    dealCardpos2FieldId?: string;
    dealCardpos3FieldId?: string;
    dealCardpos4FieldId?: string;
    roorMapping?: {
        first_name?: string;
        last_name?: string;
        phone: string;
        phone2?: string;
        phone3?: string;
        phone4?: string;
        address1?: string;
        address2?: string;
        city?: string;
        state?: string;
        zip?: string;
        email?: string;
        notes?: string;
    };
};
