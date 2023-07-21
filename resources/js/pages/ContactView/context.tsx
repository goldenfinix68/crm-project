// MyContext.js
import { createContext } from "react";
import { TContact } from "../../entities";

interface ContactContextProps {
    contact: TContact;
}

const ContactContext = createContext<ContactContextProps>(undefined as any);

export default ContactContext;
