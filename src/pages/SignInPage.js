import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { IconEyeClose, IconEyeOpen } from "~/components/icon";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { useAuth } from "~/contexts/auth-context";
import AuthenticationPage from "./AuthenticationPage";

const SignInPage = () => {
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({
        mode: "onChange",
    });
    // const { useInfo } = useAuth();
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if (!useInfo?.email) {
    //         navigate("/sign-up");
    //     } else {
    //         navigate("/");
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const [togglePassword, setTogglePassword] = useState(false);
    const hanleSignIn = (values) => {};

    return (
        <AuthenticationPage>
            <form className="form" onSubmit={handleSubmit(hanleSignIn)}>
                <Field>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        control={control}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                    />
                </Field>
                <Field>
                    <Label htmlFor="password">Password</Label>
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
                </Field>
                <Button
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    style={{ maxWidth: 350, margin: "0 auto" }}
                >
                    Sign in
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;
