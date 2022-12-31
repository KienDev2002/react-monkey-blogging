import React, { Fragment } from "react";
import { useState } from "react";
import { IconEyeClose, IconEyeOpen } from "../icon";
import Input from "./Input";

const InputPasswordToggle = ({ control }) => {
    const [togglePassword, setTogglePassword] = useState(false);
    if (!control) return null;
    return (
        <Fragment>
            <Input
                control={control}
                type={togglePassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
            >
                {!togglePassword ? (
                    <IconEyeClose
                        onClick={() => setTogglePassword(true)}
                    ></IconEyeClose>
                ) : (
                    <IconEyeOpen
                        onClick={() => setTogglePassword(false)}
                    ></IconEyeOpen>
                )}
            </Input>
        </Fragment>
    );
};

export default InputPasswordToggle;
