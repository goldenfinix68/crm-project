import { Button, Mentions, Form, Space } from "antd";
import React, { useContext } from "react";

const DialerKeyPad = ({ handleKeyPressed }: { handleKeyPressed: any }) => {
    return (
        <div>
            <div
                style={{
                    textAlign: "center",
                    width: 300,
                    margin: "auto",
                }}
            >
                <div className="dialerNumberContainer">
                    <div
                        className="dialerNumberContent"
                        style={{ paddingTop: 15 }}
                        onClick={() => handleKeyPressed("1")}
                    >
                        <span className="dialerNumber">1</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("2")}
                    >
                        <span className="dialerNumber">2</span>
                        <span className="dialerNumberChars">A B C</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("3")}
                    >
                        <span className="dialerNumber">3</span>
                        <span className="dialerNumberChars">D E F</span>
                    </div>
                    <div className="break"></div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("4")}
                    >
                        <span className="dialerNumber">4</span>
                        <span className="dialerNumberChars">G H I</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("5")}
                    >
                        <span className="dialerNumber">5</span>
                        <span className="dialerNumberChars">J K L</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("6")}
                    >
                        <span className="dialerNumber">6</span>
                        <span className="dialerNumberChars">M N O</span>
                    </div>
                    <div className="break"></div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("7")}
                    >
                        <span className="dialerNumber">7</span>
                        <span className="dialerNumberChars">P Q R S</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("8")}
                    >
                        <span className="dialerNumber">8</span>
                        <span className="dialerNumberChars">T U V</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("9")}
                    >
                        <span className="dialerNumber">9</span>
                        <span className="dialerNumberChars">W X Y Z</span>
                    </div>
                    <div className="break"></div>
                    <div
                        className="dialerNumberContent"
                        style={{ paddingTop: 15 }}
                        onClick={() => handleKeyPressed("*")}
                    >
                        <span className="dialerNumber">*</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        onClick={() => handleKeyPressed("0")}
                    >
                        <span className="dialerNumber">0</span>
                        <span className="dialerNumberChars">+</span>
                    </div>
                    <div
                        className="dialerNumberContent"
                        style={{ paddingTop: 15 }}
                        onClick={() => handleKeyPressed("#")}
                    >
                        <span className="dialerNumber">#</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DialerKeyPad;
