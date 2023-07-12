export default function removeAllNonNumericCharactersFromString(str) {
    return str.replace(/[^.0-9]/g, "");
}
