/** grams */

export function gramsToMilligrams(grams) {
    return grams * 1000;
}
export function gramsToPounds(grams) {
    return grams * 0.0022046;
}
export function gramsToKilograms(grams) {
    return grams * 0.001;
}

/** end grams */

/** milligrams */

export function milligramsToGrams(milligrams) {
    return milligrams * 0.001;
}
export function milligramsToPounds(milligrams) {
    return milligrams * 0.0000022;
}
export function milligramsToKilograms(milligrams) {
    return milligrams * 0.000001;
}

/** end milligrams */

/** pounds */

export function poundsToGrams(pounds) {
    return pounds / 0.0022046;
}
export function poundsToMilligrams(pounds) {
    return pounds / 0.0000022;
}
export function poundsToKilograms(pounds) {
    return pounds / 2.2046;
}

/** end pounds */

/** kilograms */

export function kilogramsToGrams(kilograms) {
    return kilograms * 1000;
}
export function kilogramsToMilligrams(kilograms) {
    return kilograms * 1000000;
}
export function kilogramsToPounds(kilograms) {
    return kilograms * 2.2046;
}

/** end kilograms */

export default function unitConvertion(props) {
    const { fromUnit, toUnit, value } = props;

    let newvalue = value;

    if (fromUnit) {
        if (fromUnit !== toUnit) {
            if (fromUnit === "g" && toUnit === "mg") {
                newvalue = gramsToMilligrams(parseFloat(value));
            } else if (fromUnit === "g" && toUnit === "lb") {
                newvalue = gramsToPounds(parseFloat(value));
            } else if (fromUnit === "g" && toUnit === "kg") {
                newvalue = gramsToKilograms(parseFloat(value));
            } else if (fromUnit === "mg" && toUnit === "g") {
                newvalue = milligramsToGrams(parseFloat(value));
            } else if (fromUnit === "mg" && toUnit === "lb") {
                newvalue = milligramsToPounds(parseFloat(value));
            } else if (fromUnit === "mg" && toUnit === "kg") {
                newvalue = milligramsToKilograms(parseFloat(value));
            } else if (fromUnit === "lb" && toUnit === "g") {
                newvalue = poundsToGrams(parseFloat(value));
            } else if (fromUnit === "lb" && toUnit === "mg") {
                newvalue = poundsToMilligrams(parseFloat(value));
            } else if (fromUnit === "lb" && toUnit === "kg") {
                newvalue = poundsToKilograms(parseFloat(value));
            } else if (fromUnit === "kg" && toUnit === "g") {
                newvalue = kilogramsToGrams(parseFloat(value));
            } else if (fromUnit === "kg" && toUnit === "mg") {
                newvalue = kilogramsToMilligrams(parseFloat(value));
            } else if (fromUnit === "kg" && toUnit === "lb") {
                newvalue = kilogramsToPounds(parseFloat(value));
            }
        }
    }

    return newvalue;
}
