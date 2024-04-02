import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

// Define the context type
interface CallContextType {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    callerNumber: string;
    setCallerNumber: Dispatch<SetStateAction<string>>;
    destinationNumber: string;
    setDestinationNumber: Dispatch<SetStateAction<string>>;
    agentNumber: string;
    setAgentNumber: Dispatch<SetStateAction<string>>;
}

// Create the context
const CallContext = createContext<CallContextType | undefined>(undefined);

// Define a custom provider component
interface CallProviderProps {
    children: ReactNode;
}

export function CallProvider({ children }: CallProviderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [callerNumber, setCallerNumber] = useState("");
    const [destinationNumber, setDestinationNumber] = useState("");
    const [agentNumber, setAgentNumber] = useState("");

    return (
        <CallContext.Provider
            value={{
                isModalOpen,
                setIsModalOpen,
                callerNumber,
                setCallerNumber,
                destinationNumber,
                setDestinationNumber,
                agentNumber,
                setAgentNumber,
            }}
        >
            {children}
        </CallContext.Provider>
    );
}

// Create a custom hook to access the context
export function useCallContext() {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCallContext must be used within an CallProvider");
    }
    return context;
}
