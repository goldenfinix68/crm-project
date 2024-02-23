import { useState } from "react";

export function getTimeAgo(dateString: string) {
    let timeAgo = "";

    const currentDate = new Date();
    const pastDate = new Date(dateString);

    const timeDiffInMinutes = Math.floor(
        (currentDate.getTime() - pastDate.getTime()) / (1000 * 60)
    );
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
    const timeDiffInDays = Math.floor(timeDiffInHours / 24);
    const timeDiffInWeeks = Math.floor(timeDiffInDays / 7);

    if (timeDiffInMinutes < 60) {
        timeAgo = `${timeDiffInMinutes}m ago`;
    } else if (timeDiffInHours < 24) {
        timeAgo = `${timeDiffInHours}h ago`;
    }
    // else if (timeDiffInDays < 7) {
    //     timeAgo = `${timeDiffInDays}d ago`;
    // } else if (timeDiffInWeeks < 4) {
    //     timeAgo = `${timeDiffInWeeks}w ago`;
    // }
    else {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const formattedDate = `${
            monthNames[pastDate.getMonth()]
        } ${pastDate.getDate()}`;
        timeAgo = formattedDate;
    }

    return timeAgo;
}

export function replacePlaceholders(inputString, contact) {
    // Use a regular expression to find all placeholders in the inputString
    const regex = /{{(.*?)}}/g;

    // Replace each placeholder with the corresponding value from the contact object
    const replacedString = inputString.replace(regex, (match, placeholder) => {
        // Remove any leading/trailing spaces from the placeholder
        const trimmedPlaceholder = placeholder.trim();

        // Use the trimmed placeholder to access the value from the contact object
        const value = contact[trimmedPlaceholder];

        // If the value is defined, return it; otherwise, return an empty string
        return value !== undefined ? value : "";
    });

    return replacedString;
}

interface ArrayActions<T> {
    array: T[];
    add: (item: T) => void;
    removeByKey: (key: string) => void;
    removeById: (id: string) => void;
    updateByKey: (key: string, newValue: T) => void;
    updateById: (id: string, newValue: T) => void;
    removeByIndex: (key: number) => void;
    updateByIndex: (key: number, newValue: T) => void;
    clear: () => void;
    setInitialArray: (array: T[]) => void;
}

export function useArray<T>(initialArray: T[] = []): ArrayActions<T> {
    const [array, setArray] = useState<T[]>(initialArray);

    // Add an item to the array
    const add = (item: T) => {
        if (
            !array.some(
                (arrayItem) => (arrayItem as any).key === (item as any).key
            )
        ) {
            setArray([...array, item]);
        }
    };

    // Remove an item from the array by key
    const removeByKey = (key: string) => {
        const newArray = array.filter((item) => (item as any).key !== key);
        setArray(newArray);
    };

    const removeById = (id: string) => {
        const newArray = array.filter((item) => (item as any).id !== id);
        setArray(newArray);
    };

    // Update an item in the array by key or add it if it doesn't exist
    const updateByKey = (key: string, newValue: T) => {
        const index = array.findIndex((item) => (item as any).key === key);
        if (index !== -1) {
            // Update the object if it exists
            const newArray = [...array];
            newArray[index] = newValue;
            setArray(newArray);
        }
    };

    const updateById = (id: string, newValue: T) => {
        const index = array.findIndex((item) => (item as any).id === id);
        if (index !== -1) {
            // Update the object if it exists
            const newArray = [...array];
            newArray[index] = newValue;
            setArray(newArray);
        }
    };

    // Clear the array
    const clear = () => {
        setArray([]);
    };

    // Remove an item from the array by index
    const removeByIndex = (index: number) => {
        if (index >= 0 && index < array.length) {
            const newArray = [...array];
            newArray.splice(index, 1);
            setArray(newArray);
        }
    };

    // Update an item in the array by index or add it if it doesn't exist
    const updateByIndex = (index: number, newValue: T) => {
        if (index >= 0 && index < array.length) {
            const newArray = [...array];
            newArray[index] = newValue;
            setArray(newArray);
        }
    };

    const setInitialArray = (val) => {
        setArray(val);
    };

    return {
        array,
        add,
        removeByKey,
        updateByKey,
        clear,
        removeByIndex,
        removeById,
        updateByIndex,
        updateById,
        setInitialArray,
    };
}
export function filterData(datas, filters) {
    const filteredData = datas.filter((data) => {
        // Initialize a variable to track if any condition matches (for OR operator)
        let matchesAnyCondition = false;

        // Loop through each condition in filters
        for (const condition of filters.conditions) {
            const { key, condition: operator, value } = condition;
            const field = data.fields[key]?.toLowerCase(); // Convert field to lowercase
            const lowercaseValue = value.toLowerCase(); // Convert value to lowercase

            // If the field is missing, handle the "empty" condition
            if (field === undefined || field === null) {
                if (operator == "empty") {
                    return true;
                }
                return false;
            }

            // Define a function to evaluate the condition
            const evaluateCondition = (operator, field, value) => {
                switch (operator) {
                    case "contains":
                        return field.includes(value);
                    case "notContains":
                        return !field.includes(value);
                    case "equals":
                        return field === value;
                    case "notEquals":
                        return field !== value;
                    case "startsWith":
                        return field.startsWith(value);
                    case "endsWith":
                        return field.endsWith(value);
                    case "empty":
                        return (
                            field === null ||
                            field === undefined ||
                            field === ""
                        );
                    case "notEmpty":
                        return (
                            field !== null &&
                            field !== undefined &&
                            field !== ""
                        );
                    default:
                        return false; // Invalid condition
                }
            };

            // Check if the condition is met for this field
            let conditionMet = evaluateCondition(
                operator,
                field,
                lowercaseValue
            );

            // For the OR operator, include the contact if any condition is met
            if (filters.conditionalOperator === "or" && conditionMet) {
                matchesAnyCondition = true; // Mark that at least one condition is met for OR
                break; // No need to check further conditions
            }

            // For the AND operator, all conditions must be met for a contact to be included
            if (filters.conditionalOperator === "and" && !conditionMet) {
                return false; // Skip this contact if any condition fails for AND
            }
        }

        // If using the AND operator, include the contact since all conditions passed
        // For the OR operator, include the contact if at least one condition is met
        return filters.conditionalOperator === "and"
            ? true
            : matchesAnyCondition;
    });

    return filteredData;
}
export function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

export function spinContent(content) {
    // Use a regular expression to find and replace the spin syntax
    const pattern = /\[([^\[\]]+)\]/g;
    if (!pattern.test(content)) {
        return null; // Return null if no placeholders are found
    }
    const matches = content?.match(pattern);

    // If there are matches, generate all possible spun versions
    if (matches) {
        const allSpunVersions: any = [];

        const generateSpunVersions = (currentContent, currentIndex) => {
            if (currentIndex === matches.length) {
                allSpunVersions.push(currentContent);
                return;
            }

            const options = matches[currentIndex].slice(1, -1).split("|");
            options.forEach((option) => {
                generateSpunVersions(
                    currentContent.replace(matches[currentIndex], option),
                    currentIndex + 1
                );
            });
        };

        generateSpunVersions(content, 0);
        return allSpunVersions;
    }

    // If there are no matches, return the original content
    return [content];
}

async function getLatestAppVersion() {
    try {
        const response = await fetch("/meta.json");

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const latestVersion = data.version;
        return latestVersion;
    } catch (error) {
        console.error("Error checking app version:", error);
        return false; // Handle the error appropriately in your application
    }
}

export async function isAppLatestVersion() {
    const latestVersion = await getLatestAppVersion();
    const currentVersion = localStorage.getItem("appVersion") || "";
    console.log(latestVersion === currentVersion);
    return latestVersion === currentVersion;
}

export async function updateAppVersion() {
    try {
        // Clear the cache
        if (caches) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
            console.log("Cache cleared");
        }

        const latestVersion = await getLatestAppVersion();
        localStorage.setItem("appVersion", latestVersion);
        console.log("App version updated in local storage");

        window.location.reload();
    } catch (error) {
        console.error("Error updating app version:", error);
    }
}

export function timeToLocalMachineTZ(date) {
    // Create a Date object using the UTC string
    const utcDate = new Date(date);

    // Get the timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();

    // Convert UTC time to local time
    const localDate = new Date(utcDate.getTime() + timezoneOffset * 60 * 1000);

    return "asdasd";
}
