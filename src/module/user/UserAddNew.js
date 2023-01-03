import { Button } from "~/components/button";
import { Radio } from "~/components/checkbox";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import React from "react";
import { useForm } from "react-hook-form";
import { Field } from "~/components/field";
import { FieldCheckboxes } from "~/components/field";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import ImageUpload from "~/components/image/ImageUpload";
import { userRole, userStatus } from "~/utils/constants";
import useFirebaseImage from "~/hooks/useFireBaseImage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "~/components/firebase/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import slugify from "slugify";
import { toast } from "react-toastify";
import { Textarea } from "~/components/textarea";

const UserAddNew = () => {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        getValues,
        reset,
        formState: { isValid, isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            username: "",
            description: "",
            avatar: "",
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: new Date(),
        },
    });
    const watchStatus = watch("status");
    const watchRoles = watch("role");

    const {
        image,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues);

    const handleCreateUser = async (values) => {
        if (!isValid) return;
        try {
            await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const colRef = collection(db, "users");
            await addDoc(colRef, {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                username: slugify(values.username || values.fullname, {
                    lower: true,
                    replacement: " ",
                    trim: true,
                }),
                description: values.description,
                avatar: image,
                status: Number(values.status),
                role: Number(values.role),
                createdAt: serverTimestamp(),
            });
            toast.success(
                `Create new user with email: ${values.email} successfully!`
            );
            reset({
                fullname: "",
                email: "",
                password: "",
                username: "",
                avatar: "",
                description: "",
                status: userStatus.ACTIVE,
                role: userRole.USER,
                createdAt: new Date(),
            });
            handleResetUpload();
        } catch (error) {
            console.log(error);
            toast.error("Cannot create new user");
        }
    };

    return (
        <div>
            <DashboardHeading
                title="New user"
                desc="Add new user to system"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleCreateUser)}>
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
                    <Field>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            placeholder="Enter your description"
                            control={control}
                        ></Textarea>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    type="submit"
                    className="mx-auto w-[200px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Add new user
                </Button>
            </form>
        </div>
    );
};

export default UserAddNew;
