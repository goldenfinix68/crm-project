export default function convertExponentialToDecimal(value) {
    // Check if the value is in exponential notation
    if (
        typeof value === "number" &&
        /\d+\.?\d*e[+-]\d+/i.test(value.toString())
    ) {
        // Convert exponential notation to decimal notation
        const parts = value.toString().toLowerCase().split("e");
        const coefficient = parseFloat(parts[0]);
        const exponent = parseInt(parts[1].replace("+", ""));
        return coefficient * Math.pow(10, exponent);
    }

    // Return the value as is if it's not in exponential notation
    return value;
}
