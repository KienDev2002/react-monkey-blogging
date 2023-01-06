import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import ImageUploader from "quill-image-uploader";
import styled from "styled-components";
import { Radio } from "~/components/checkbox";
import { Dropdown, List, Option, Select } from "~/components/dropdown";
import slugify from "slugify";
import { postStatus, userStatus } from "~/utils/constants";

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
import axios from "axios";
import { useMemo } from "react";

Quill.register("modules/imageUploader", ImageUploader);
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
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
                replacement: "-",
                trim: true,
            });
            cloneValues.status = Number(values.status);
            const data = {
                title: values.title,
                slug: cloneValues.slug,
                image: image,
                category: values.category,
                status: cloneValues.status,
                hot: values.hot,
                content,
                user: {
                    fullname: userInfo.fullname,
                    email: userInfo.email,
                    password: userInfo.password,
                    username: userInfo.username,
                    avatar: userInfo.avatar,
                    status: userInfo.status,
                    role: userInfo.role,
                    description: userInfo.description,
                    createdAt: userInfo.createdAt,
                },
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
                "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/posts/create",
                fetchOptions
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

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
            const response = await axios(
                "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/categories"
            );
            setCategories(response.data.data);
        }
        getData();
    }, []);
    useEffect(() => {
        document.title = "Monkey Blogging - Add new post ";
    }, []);

    // useEffect(() => {
    //     async function fetchData() {
    //         if (!userInfo.email) return;
    //         const q = query(
    //             collection(db, "users"),
    //             where("email", "==", userInfo.email)
    //         );
    //         const querySnapshot = await getDocs(q);
    //         querySnapshot.forEach((doc) => {
    //             setValue("user", {
    //                 id: doc.id,
    //                 ...doc.data(),
    //             });
    //         });
    //     }
    //     fetchData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [userInfo.email]);

    const [selectCategory, setSelectCategory] = useState("");
    const handleClickOption = async (item) => {
        const response = await axios(
            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/categories/${item.id}`
        );
        setValue("category", response.data.data);
        setSelectCategory(item);
    };

    const modules = useMemo(
        () => ({
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                ["blockquote"],
                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: "ordered" }, { list: "bullet" }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["link", "image"],
            ],
            imageUploader: {
                // imgbbAPI
                upload: async (file) => {
                    const bodyFormData = new FormData();
                    bodyFormData.append("image", file);
                    const response = await axios({
                        method: "post",
                        url: "https://api.imgbb.com/1/upload?key=63e6cd3f1f92682cb805d54a8f2cbd96",
                        data: bodyFormData,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    return response.data.data.url;
                },
            },
        }),
        []
    );
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
                <div className="mb-10">
                    <Field>
                        <Label>Content</Label>
                        <div className="w-full entry-content">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                            />
                        </div>
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
