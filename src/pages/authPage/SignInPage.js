import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { useAuth } from "~/contexts/auth-context";
import AuthenticationPage from "./AuthenticationPage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "~/components/firebase/firebase-config";
import InputPasswordToggle from "~/components/input/InputPasswordToggle";

const schema = yup.object({
    email: yup
        .string()
        .email("please enter valid email address")
        .required("please enter your email address"),
    password: yup
        .string()
        .required("please enter your password")
        .min(8, "Your password must be at least 8 characters or greater"),
});
const SignInPage = () => {
    const navigate = useNavigate();
    const {
        handleSubmit,
        control,
        formState: { isValid, errors, isSubmitting },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const hanleSignIn = async (values) => {
        if (!isValid) return;
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate("/");
    };
    useEffect(() => {
        const arrError = Object.values(errors);
        if (arrError.length > 0) {
            toast.error(arrError[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
    const { userInfo } = useAuth();
    useEffect(() => {
        document.title = "Login Page";
        if (userInfo?.email) {
            // navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <InputPasswordToggle
                        control={control}
                    ></InputPasswordToggle>
                </Field>
                <div className="have-account">
                    Haven't you already had an account?
                    <NavLink to={"/sign-up"}> Register an account</NavLink>
                </div>
                <Button
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    style={{ maxWidth: 350, width: "100%", margin: "0 auto" }}
                >
                    Sign in
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;
