export type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
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

export type TText = {
    id?: string;
    userId?: string;
    contactId?: string;
    from: string;
    to: string;
    message: string;
    type: "sent" | "received";
    sender: string;
};

export type TWallData = {
    date: string;
    day: string;
    month: string;
    year: string;
    type: "call" | "text" | "note";
    note?: TNote;
    text?: TText;
};

export type TContact = {
    id: string;
    firstName: any;
    lastName: string;
    mobile?: string;
    countryLink?: string;
    acres?: number;
    email?: string;
    jobTitle?: string;
    phone?: string;
    otherPhone?: string;
    ownerId: string;
    email2?: string;
    typeId?: string;
    type?: TContactType;
    mailingStreetAddress?: string;
    emailOptOut?: boolean;
    mailingCity?: string;
    mailingCountry?: string;
    subdivision?: string;
    APN?: string;
    gMapLink?: string;
    roadFrontage: string;
    redfinLink?: string;
    openingBid?: number;
    assessedValue?: number;
    assessedVsOpeningMargin?: number;
    assessedVsOpeningMultiple?: number;
    wetlandsStatus?: string;
    legalDescription?: string;
    legalSubdivision?: string;
    floodzone?: boolean;
    topography?: string;
    wireless1?: string;
    wireless2?: string;
    wireless3?: string;
    wireless4?: string;
    landline1?: string;
    landline2?: string;
    landline3?: string;
    landline4?: string;
    marketAreaName?: string;
    skype?: string;
    website?: string;
    facebook?: string;
    linkedIn?: string;
    twitter?: string;
    instagram?: string;
    detailsDescription?: string;
    tags?: string[];
    detailsLegalDescription?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    zipCode?: string;
    state?: string;
    owner?: string;
    wall?: TWallData[];
};
