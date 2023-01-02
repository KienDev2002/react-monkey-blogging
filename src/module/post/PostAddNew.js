import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Radio } from "~/components/checkbox";
import { Dropdown, List, Option, Select } from "~/components/dropdown";
import slugify from "slugify";
import { postStatus } from "~/utils/constants";

import ImageUpload from "~/components/image/ImageUpload";
import { useState } from "react";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "~/components/firebase/firebase-config";
import Toggle from "~/components/toggle/Toggle";
import { useEffect } from "react";
import { useAuth } from "~/contexts/auth-context";
import { toast } from "react-toastify";
import useFirebaseImage from "~/hooks/useFireBaseImage";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const { control, watch, setValue, handleSubmit, getValues, reset } =
        useForm({
            mode: "onChange",
            defaultValues: {
                title: "",
                slug: "",
                status: 2,
                category: {},
                hot: false,
                image: "",
                user: {},
            },
        });

    const watchStatus = watch("status");
    const watchHot = watch("hot");
    // console.log("PostAddNew ~ watchCategory", watchCategory);
    const {
        image,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues);
    const addPostHandler = async (values) => {
        setLoading(true);
        try {
            const cloneValues = { ...values };
            cloneValues.slug = slugify(values.slug || values.title, {
                lower: true,
            });
            cloneValues.status = Number(values.status);
            const colRef = collection(db, "posts");
            await addDoc(colRef, {
                ...cloneValues,
                createdAt: serverTimestamp(),
                image,
            });

            toast.success("Create new post successfully");
            reset({
                title: "",
                slug: "",
                status: 2,
                category: {},
                hot: false,
                image: "",
                user: {},
            });
            handleResetUpload();
            setSelectCategory({});
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function getData() {
            const colRef = collection(db, "categories");
            const q = query(colRef, where("status", "==", 1));
            const querySnapshot = await getDocs(q);
            let results = [];
            querySnapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategories(results);
        }
        getData();
    }, []);

    useEffect(() => {
        document.title = "Monkey Blogging - Add new post ";
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (!userInfo.email) return;
            const q = query(
                collection(db, "users"),
                where("email", "==", userInfo.email)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setValue("user", {
                    id: doc.id,
                    ...doc.data(),
                });
            });
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo.email]);

    const [selectCategory, setSelectCategory] = useState("");
    const handleClickOption = async (item) => {
        const docRef = doc(db, "categories", item.id);
        const docData = await getDoc(docRef);
        setValue("category", {
            id: docData.id,
            ...docData.data(),
        });
        setSelectCategory(item);
    };
    return (
        <PostAddNewStyles>
            <h1 className="dashboard-heading">Add new post</h1>
            <form onSubmit={handleSubmit(addPostHandler)}>
                <div className="grid grid-cols-2 mb-10 gap-x-10">
                    <Field>
                        <Label>Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            placeholder="Enter your slug"
                            name="slug"
                        ></Input>
                    </Field>
                </div>
                <div className="grid grid-cols-2 mb-10 gap-x-10">
                    <Field>
                        <Label>Image</Label>

                        <ImageUpload
                            className="h-[250px]"
                            onChange={handleSelectImage}
                            progress={progress}
                            image={image}
                            handleDeleteImage={handleDeleteImage}
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                            <Select
                                placeholder={"Select the category"}
                            ></Select>
                            <List>
                                {categories.length > 0 &&
                                    categories.map((item) => (
                                        <Option
                                            onClick={() =>
                                                handleClickOption(item)
                                            }
                                            key={item.id}
                                        >
                                            {item.name}
                                        </Option>
                                    ))}
                            </List>
                        </Dropdown>
                        {selectCategory?.name && (
                            <span className="inline-block p-4 text-xl font-medium text-green-600 rounded-lg bg-green-50">
                                {selectCategory?.name}
                            </span>
                        )}
                    </Field>
                </div>
                <div className="grid grid-cols-2 mb-10 gap-x-10">
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle
                            on={watchHot === true}
                            onClick={() => setValue("hot", !watchHot)}
                        ></Toggle>
                    </Field>
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.APPROVED
                                }
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.PENDING
                                }
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.REJECTED
                                }
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                </div>
                <Button
                    type="submit"
                    className="mx-auto w-[250px]"
                    isLoading={loading}
                    disabled={loading}
                >
                    Add new post
                </Button>
            </form>
        </PostAddNewStyles>
    );
};

export default PostAddNew;
