const date = new Date();
const key = process.env.MIX_APP_KEY + `-${date.getFullYear()}`;

const encryptor = require("simple-encryptor")(key);

const token = () => {
    if (localStorage.token === null || localStorage.token === undefined) {
        localStorage.token = "";
        return process.env.MIX_APP_API_KEY;
        // return false;
    }
    return "Bearer " + localStorage.token;
};

const userData = () => {
    if (encryptor.decrypt(localStorage.userdata) === null) {
        localStorage.userdata = "";
        return false;
    }
    return encryptor.decrypt(localStorage.userdata);
};

const role = () => {
    if (encryptor.decrypt(localStorage.userdata) === null) {
        localStorage.userdata = "";
        return false;
    }
    return encryptor.decrypt(localStorage.userdata).role;
};

export default function companyInfo() {
    return {
        date,
        key,
        userData: userData(),
        token: token(),
        role: role(),
        apiUrl: process.env.MIX_APP_API_URL,
        logo: process.env.MIX_APP_LOGO,
        darkLogo: process.env.MIX_APP_FULLWIDTH_LOGO,
        sidelogo: process.env.MIX_APP_SIDE_LOGO,
        centerDarkLogo: process.env.MIX_APP_FULLWIDTH_WHITE_LOGO,
        name: process.env.MIX_APP_NAME,
        description: process.env.MIX_APP_DESCRIPTION,
        version: process.env.MIX_APP_VERSION,
        encryptor,
    };
}
