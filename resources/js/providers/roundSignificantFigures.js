export default function roundSignificantFigures(number, figure) {
    let significantDigits = figure;

    number = number.toString();

    // Check if the number is already in scientific notation
    if (number.toLowerCase().includes("e")) {
        let parts = number.toLowerCase().split("e");
        let significand = parseFloat(
            Number(parts[0]).toPrecision(significantDigits - 1)
        );
        let exponent = parts[1];

        // Reconstruct the number in scientific notation with rounded significand
        return significand.toExponential(significantDigits) + "e" + exponent;
    }

    // If the number is not in scientific notation, use toPrecision to round it
    let roundedNumber = parseFloat(
        Number(number).toPrecision(significantDigits)
    );

    // Convert the rounded number back to a floating-point value
    return roundedNumber.toFixed(significantDigits);
}
