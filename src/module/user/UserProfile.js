import { Button } from "~/components/button";
import { Field } from "~/components/field";
import ImageUpload from "~/components/image/ImageUpload";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "~/contexts/auth-context";
import { useEffect } from "react";
import useFirebaseImage from "~/hooks/useFireBaseImage";
import { db } from "~/components/firebase/firebase-config";
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useState } from "react";

const UserProfile = () => {
    const { userInfo } = useAuth();
    const [user, setUser] = useState([]);
    const {
        control,
        reset,
        setValue,
        getValues,
        handleSubmit,
        formState: { isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });

    const imageURL = userInfo.avatar;
    const imageRegex = imageURL && /%2F(\S+)\?/gm.exec(imageURL);
    const image_name = imageRegex && imageRegex[1];

    const deleteAvatar = async () => {
        const docRef = doc(db, "users", user[0].id);
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
    useEffect(() => {
        reset({
            fullname: userInfo.fullname,
            username: userInfo.username,
            email: userInfo.email,
        });
    }, [reset, userInfo.email, userInfo.fullname, userInfo.username]);
    useEffect(() => {
        setImage(imageURL);
    }, [setImage, imageURL]);

    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        try {
            const docRef = doc(db, "users", user[0].id);
            await updateDoc(docRef, {
                ...values,
                birthday: values.birthday,
                phone: values.phone,
                password: values.password,
                confirmPassword: values.confirmPassword,
                avatar: image,
            });
            toast.success("Update user information successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Update user information failed!");
        }
    };
    useEffect(() => {
        function fetchData() {
            if (userInfo.email) {
                const docRef = query(
                    collection(db, "users"),
                    where("email", "==", userInfo.email)
                );
                onSnapshot(docRef, (onsnapshot) => {
                    const results = [];
                    onsnapshot.forEach((doc) => {
                        results.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                        setUser(results);
                    });
                });
            }
        }
        fetchData();
    }, [userInfo.email]);
    if (!userInfo) return;
    return (
        <div>
            <DashboardHeading
                title="Account information"
                desc="Update your account information"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className="mb-10 text-center">
                    <ImageUpload
                        image={image}
                        progress={progress}
                        onChange={handleSelectImage}
                        handleDeleteImage={handleDeleteImage}
                        className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
                    ></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            control={control}
                            name="fullname"
                            placeholder="Enter your fullname"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            control={control}
                            name="username"
                            placeholder="Enter your username"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Date of Birth</Label>
                        <Input
                            control={control}
                            name="birthday"
                            placeholder="dd/mm/yyyy"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Mobile Number</Label>
                        <Input
                            control={control}
                            name="phone"
                            placeholder="Enter your phone number"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            control={control}
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                        ></Input>
                    </Field>
                    <Field></Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>New Password</Label>
                        <Input
                            control={control}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Confirm Password</Label>
                        <Input
                            control={control}
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter your confirm password"
                        ></Input>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    type="submit"
                    className="mx-auto w-[200px]"
                >
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserProfile;
