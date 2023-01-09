import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Field } from "~/components/field";
import * as yup from "yup";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import Layout from "~/components/layout/Layout";
import { Textarea } from "~/components/textarea";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "~/contexts/auth-context";
import axios from "axios";

const schema = yup.object({
    fullname: yup.string().required("please enter your fullname"),
    email: yup
        .string()
        .email("please enter valid email address")
        .required("please enter your email address"),
    message: yup
        .string()
        .required("please enter your message")
        .min(8, "Your message must be at least 8 characters or greater"),
});

const FeedbackPage = () => {
    const { userInfo } = useAuth();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

    const handleSubmitContact = async (values) => {
        if (!isValid) return;
        try {
            const user = await axios(
                `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/users/${userInfo.id}`
            );
            const data = {
                fullname: userInfo.fullname || "admin",
                email: userInfo.email,
                message: values.message,
                user: user.data.data,
            };

            const formDataJsonString = JSON.stringify(data);

            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: formDataJsonString,
            };

            const response = await fetch(
                "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/feedbacks/create",
                fetchOptions
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            toast.success("create feedback successfully");
            reset({
                fullname: "",
                email: "",
                message: "",
            });
        } catch (error) {
            toast.error(error);
        }
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
        reset({
            fullname: userInfo.fullname || "admin",
            email: userInfo.email,
            message: "",
        });
    }, []);

    useEffect(() => {
        document.title = "Contact Page";
    }, []);

    return (
        <Layout>
            <div className="container">
                <div className="w-2/4 mx-auto">
                    <form
                        className=" form"
                        onSubmit={handleSubmit(handleSubmitContact)}
                    >
                        <Field>
                            <Label htmlFor="fullname">Fullname</Label>
                            <Input
                                control={control}
                                type="text"
                                name="fullname"
                                disabled={true}
                                placeholder="Enter your fullname"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                control={control}
                                type="email"
                                name="email"
                                disabled={true}
                                placeholder="Enter your email"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="Message">Message</Label>
                            <Textarea
                                name="message"
                                placeholder="Message..."
                                control={control}
                            ></Textarea>
                        </Field>

                        <Button
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full max-w-[350px] mx-auto"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default FeedbackPage;
