import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { TContact, TCustomField, TUser } from "../entities";
import { useContactsAll } from "../api/query/contactsQuery";
import { useLoggedInUser } from "../api/query/userQuery";
import {
    useCustomFieldSections,
    useCustomFields,
} from "../api/query/customFieldQuery";
import { isAppLatestVersion as isLatestVersion } from "../helpers";

// Define the context type
interface IAppContext {
    contacts: TContact[];
    isContactsLoading: boolean;
    refetchContacts: any;
    loggedInUser: TUser | null;
    contactFields: TCustomField[];
    isRoleStats: boolean;
    isSUperAdmin: boolean;
    isAppLatestVersion: boolean;
}

// Create the context
const AppContext = createContext<IAppContext | undefined>(undefined);

// Define a custom provider component
interface AppContextProviderProps {
    children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
    const [isAppLatestVersion, setIsAppLatestVersion] = useState<boolean>(true);

    const {
        contacts,
        isLoading: isContactsLoading,
        refetch: refetchContacts,
    } = useContactsAll("All");

    const { user } = useLoggedInUser();

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const getIsLatestVersion = async () => {
        try {
            const response = await fetch("/meta.json");

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();

            // Check if the app version in data matches the expected version
            const latestVersion = data.version; // Replace with the actual field in your JSON
            const currentVersion = localStorage.getItem("appVersion") || ""; // Replace with the actual version of your app
            console.log(latestVersion === currentVersion);
            return latestVersion === currentVersion;
        } catch (error) {
            console.error("Error checking app version:", error);
            return false; // Handle the error appropriately in your application
        }
    };

    React.useEffect(() => {
        const fetchAppVersion = async () => {
            const version = await isLatestVersion();
            setIsAppLatestVersion(version);
        };

        fetchAppVersion();
    }, []);

    return (
        <AppContext.Provider
            value={{
                contacts: contacts ?? [],
                isContactsLoading,
                refetchContacts,
                loggedInUser: user ?? null,
                contactFields: contactFields ?? [],
                isRoleStats: user?.role == "stats",
                isSUperAdmin: user?.role == "superAdmin",
                isAppLatestVersion,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

// Create a custom hook to access the context
export function useAppContextProvider() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useCallContext must be used within an CallProvider");
    }
    return context;
}
