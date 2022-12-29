import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { IconEyeClose, IconEyeOpen } from "~/components/icon";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Field } from "~/components/field";
import { useState } from "react";
import { Button } from "~/components/button";
import { async } from "@firebase/util";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "~/components/firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
const SignUpPageStyles = styled.div`
    min-height: 100vh;
    padding: 40px;

    .logo {
        margin: 0 auto 20px;
    }

    .heading {
        text-align: center;
        color: ${(props) => props.theme.primary};
        font-weight: bold;
        font-size: 4rem;
        margin-bottom: 60px;
    }

    .form {
        max-width: 600px;
        margin: 0 auto;
    }
`;

const schema = yup.object({
    fullname: yup.string().required("please enter your fullname"),
    email: yup
        .string()
        .email("please enter valid email address")
        .required("please enter your email address"),
    password: yup
        .string()
        .required("please enter your password")
        .min(8, "Your password must be at least 8 characters or greater"),
});

const SignUpPage = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        watch,
        reset,
    } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

    const hanleSignUp = async (values) => {
        if (!isValid) return;
        const user = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        updateProfile(auth.currentUser, {
            displayName: values.fullname,
        });
        const colRef = collection(db, "users");
        await addDoc(colRef, {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
        });
        toast.success("Register successfully");
        navigate("/");
    };
    const [togglePassword, setTogglePassword] = useState(false);
    useEffect(() => {
        const arrError = Object.values(errors);
        if (arrError.length > 0) {
            toast.error(arrError[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
    return (
        <SignUpPageStyles>
            <div className="container">
                <img
                    className="logo"
                    srcSet="/logo.png 2x"
                    alt="monkey-blogging"
                />
                <h1 className="heading">Monkey Blogging</h1>
                <form className="form" onSubmit={handleSubmit(hanleSignUp)}>
                    <Field>
                        <Label htmlFor="fullname">Fullname</Label>
                        <Input
                            control={control}
                            type="text"
                            name="fullname"
                            placeholder="Enter your fullname"
                        />
                    </Field>
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
                        Sign up
                    </Button>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
