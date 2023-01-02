import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "~/components/button";
import { Radio } from "~/components/checkbox";
import { Field, FieldCheckboxes } from "~/components/field";
import { db } from "~/components/firebase/firebase-config";
import ImageUpload from "~/components/image/ImageUpload";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import useFirebaseImage from "~/hooks/useFireBaseImage";
import { userRole, userStatus } from "~/utils/constants";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserUpdate = () => {
    const [params] = useSearchParams();
    const userId = params.get("id");

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        getValues,
        formState: { isValid, isSubmitting },
    } = useForm({ mode: "onChange", defaultValues: {} });
    const watchRoles = watch("role");
    const watchStatus = watch("status");
    const imageURL = getValues("avatar");
    const imageRegex = imageURL && /%2F(\S+)\?/gm.exec(imageURL);
    const image_name = imageRegex && imageRegex[1];

    const deleteAvatar = async () => {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {
            avatar: "",
        });
    };

    const {
        image,
        setImage,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues, image_name, deleteAvatar);

    const handleUpadateUser = async (values) => {
        if (!isValid) return;
        try {
            const docRef = doc(db, "users", userId);
            await updateDoc(docRef, {
                ...values,
                avatar: image,
            });
            toast.success("Update user information successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Update user information failed!");
        }
    };

    useEffect(() => {
        setImage(imageURL);
    }, [imageURL, setImage]);
    useEffect(() => {
        if (!userId) return;
        async function fetchData() {
            const docRef = doc(db, "users", userId);
            const docData = await getDoc(docRef);
            reset(docData.data());
        }
        fetchData();
    }, [reset, userId]);

    if (!userId) return;
    return (
        <div>
            <DashboardHeading
                title="Update user"
                desc="Update user information"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpadateUser)}>
                <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
                    <ImageUpload
                        image={image}
                        progress={progress}
                        onChange={handleSelectImage}
                        handleDeleteImage={handleDeleteImage}
                        className="!rounded-full h-full"
                    ></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            name="fullname"
                            placeholder="Enter your fullname"
                            control={control}
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            name="username"
                            placeholder="Enter your username"
                            control={control}
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                            type="email"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Password</Label>
                        <Input
                            name="password"
                            placeholder="Enter your password"
                            control={control}
                            type="password"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                onChange={() =>
                                    setValue("status", userStatus.ACTIVE)
                                }
                                checked={
                                    Number(watchStatus) === userStatus.ACTIVE
                                }
                            >
                                Active
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                onChange={() =>
                                    setValue("status", userStatus.PENDING)
                                }
                                checked={
                                    Number(watchStatus) === userStatus.PENDING
                                }
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                onChange={() =>
                                    setValue("status", userStatus.BAN)
                                }
                                checked={Number(watchStatus) === userStatus.BAN}
                            >
                                Banned
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="role"
                                control={control}
                                onChange={() =>
                                    setValue("role", userRole.ADMIN)
                                }
                                checked={Number(watchRoles) === userRole.ADMIN}
                            >
                                Admin
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                onChange={() => setValue("role", userRole.MOD)}
                                checked={Number(watchRoles) === userRole.MOD}
                            >
                                Moderator
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                onChange={() =>
                                    setValue("role", userRole.EDITOR)
                                }
                                checked={Number(watchRoles) === userRole.EDITOR}
                            >
                                Editor
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                onChange={() => setValue("role", userRole.USER)}
                                checked={Number(watchRoles) === userRole.USER}
                            >
                                User
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    type="submit"
                    className="mx-auto w-[200px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update user
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;
