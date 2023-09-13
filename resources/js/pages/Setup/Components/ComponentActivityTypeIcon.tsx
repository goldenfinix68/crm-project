import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBinoculars,
    faCalendarDays,
    faCamera,
    faCar,
    faChalkboardUser,
    faCirclePlay,
    faClipboardCheck,
    faEnvelope,
    faFlag,
    faGem,
    faGlobe,
    faImage,
    faKey,
    faKitMedical,
    faMedal,
    faMugHot,
    faPhoneVolume,
    faPlaneDeparture,
    faStar,
    faTag,
    faTrophy,
    faUsers,
    faUtensils,
    faWrench,
} from "@fortawesome/free-solid-svg-icons";

export default function ComponentActivityTypeIcon(val: string) {
    switch (val) {
        case "A":
            return <FontAwesomeIcon icon={faPhoneVolume} />;
        case "B":
            return <FontAwesomeIcon icon={faClipboardCheck} />;
        case "C":
            return <FontAwesomeIcon icon={faUsers} />;
        case "D":
            return <FontAwesomeIcon icon={faChalkboardUser} />;
        case "E":
            return <FontAwesomeIcon icon={faUtensils} />;
        case "F":
            return <FontAwesomeIcon icon={faCalendarDays} />;
        case "G":
            return <FontAwesomeIcon icon={faEnvelope} />;
        case "H":
            return <FontAwesomeIcon icon={faMugHot} />;
        case "I":
            return <FontAwesomeIcon icon={faFlag} />;
        case "J":
            return <FontAwesomeIcon icon={faCamera} />;
        case "K":
            return <FontAwesomeIcon icon={faImage} />;
        case "L":
            return <FontAwesomeIcon icon={faCar} />;
        case "M":
            return <FontAwesomeIcon icon={faMedal} />;
        case "N":
            return <FontAwesomeIcon icon={faTrophy} />;
        case "O":
            return <FontAwesomeIcon icon={faStar} />;
        case "P":
            return <FontAwesomeIcon icon={faPlaneDeparture} />;
        case "Q":
            return <FontAwesomeIcon icon={faGlobe} />;
        case "R":
            return <FontAwesomeIcon icon={faKey} />;
        case "S":
            return <FontAwesomeIcon icon={faTag} />;
        case "T":
            return <FontAwesomeIcon icon={faCirclePlay} />;
        case "W":
            return <FontAwesomeIcon icon={faBinoculars} />;
        case "X":
            return <FontAwesomeIcon icon={faGem} />;
        case "Y":
            return <FontAwesomeIcon icon={faKitMedical} />;
        case "Z":
            return <FontAwesomeIcon icon={faWrench} />;

        default:
            return "";
    }
}
