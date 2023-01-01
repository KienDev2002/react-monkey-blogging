import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Field } from "~/components/field";
import { Button } from "~/components/button";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "~/components/firebase/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";

import InputPasswordToggle from "~/components/input/InputPasswordToggle";
import slugify from "slugify";
import { userRole, userStatus } from "~/utils/constants";

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
    } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

    const hanleSignUp = async (values) => {
        if (!isValid) return;
        await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        updateProfile(auth.currentUser, {
            displayName: values.fullname,
            photoURL:
                "https://tse4.mm.bing.net/th?id=OIP.fpaUV35ECaGkz-YNCrBSwQHaHa&pid=Api&P=0",
        });
        // const colRef = collection(db, "users");
        // create users in doc có id là id của user in authentication firebase
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            username: slugify(values.fullname, { lower: true }),
            avatar: "https://tse4.mm.bing.net/th?id=OIP.fpaUV35ECaGkz-YNCrBSwQHaHa&pid=Api&P=0",
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: serverTimestamp(),
        });
        // await setDoc(colRef, {
        //     fullname: values.fullname,
        //     email: values.email,
        //     password: values.password,
        // });
        toast.success("Register successfully");
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

    useEffect(() => {
        document.title = "Register Page";
    }, []);
    return (
        <AuthenticationPage>
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
                    <InputPasswordToggle
                        control={control}
                    ></InputPasswordToggle>
                </Field>

                <div className="have-account">
                    Have you already had an account?
                    <NavLink to={"/sign-in"}> Login</NavLink>
                </div>
                <Button
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full max-w-[350px] mx-auto"
                >
                    Sign up
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignUpPage;
