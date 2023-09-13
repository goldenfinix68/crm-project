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
    } else if (timeDiffInDays < 7) {
        timeAgo = `${timeDiffInDays}d ago`;
    } else if (timeDiffInWeeks < 4) {
        timeAgo = `${timeDiffInWeeks}w ago`;
    } else {
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
