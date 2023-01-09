import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Button } from "~/components/button";
import { Radio } from "~/components/checkbox";
import { Field, FieldCheckboxes } from "~/components/field";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { useAuth } from "~/contexts/auth-context";
import { catogoryStatus } from "~/utils/constants";
import DashboardHeading from "../dashboard/DashboardHeading";

const FeedbackUpdate = () => {
    const { userInfo } = useAuth();
    const [params] = useSearchParams();
    const [user, setUser] = useState();
    const feedbackId = params.get("id");
    const navigate = useNavigate();
    const {
        control,
        reset,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });

    useEffect(() => {
        async function fetchData() {
            const response = await axios(
                `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/feedbacks/${feedbackId}`
            );
            reset(response.data.data);
            setUser(response.data.data?.user);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const hanleUpdateCategory = async (values) => {
        const userInfo = await axios(
            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/users/${user.id}`
        );
        const data = {
            fullname: values.fullname,
            email: values.email,
            message: values.message,
            user: userInfo.data.data,
        };

        const formDataJsonString = JSON.stringify(data);

        const fetchOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: formDataJsonString,
        };

        const response = await fetch(
            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/feedbacks/update/${feedbackId}`,
            fetchOptions
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        toast.success("Update feedback successfully!");
        navigate("/manage/feedback");
    };

    if (!feedbackId) return;
    return (
        <div>
            <DashboardHeading
                title="Update feedback"
                desc={`Update your feedback id: ${feedbackId}`}
            ></DashboardHeading>
            <form onSubmit={handleSubmit(hanleUpdateCategory)}>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            control={control}
                            name="fullname"
                            placeholder="Enter your category fullname"
                            required
                            disabled={true}
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Email</Label>
                        <Input
                            control={control}
                            name="email"
                            placeholder="Enter your email"
                            disabled={true}
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Message</Label>
                        <Input
                            control={control}
                            name="message"
                            placeholder="Enter your message"
                            disabled={userInfo.email === "admin@admin.com"}
                        ></Input>
                    </Field>
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    kind="primary"
                    className="mx-auto w-[250px]"
                >
                    Update feedback
                </Button>
            </form>
        </div>
    );
};

export default FeedbackUpdate;
