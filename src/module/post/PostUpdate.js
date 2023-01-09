import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "quill-image-uploader";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "~/components/button";
import { Radio } from "~/components/checkbox";
import { Dropdown, List, Option, Select } from "~/components/dropdown";
import { Field } from "~/components/field";
import { db } from "~/components/firebase/firebase-config";
import ImageUpload from "~/components/image/ImageUpload";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import Toggle from "~/components/toggle/Toggle";
import useFirebaseImage from "~/hooks/useFireBaseImage";
import { postStatus } from "~/utils/constants";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useMemo } from "react";
import axios from "axios";
import slugify from "slugify";
import { useAuth } from "~/contexts/auth-context";

Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [params] = useSearchParams();
    const postId = params.get("id");
    const [content, setContent] = useState("");
    const {
        control,
        reset,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { isSubmitting, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });
    const watchHot = watch("hot");
    const watchStatus = watch("status");
    const imageURL = getValues("image");
    const image_name = getValues("image_name");
    // const deleteAvatar = async () => {
    //     const docRef = doc(db, "posts", postId);
    //     await updateDoc(docRef, {
    //         image: "",
    //     });
    // };
    const {
        image,
        setImage,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues, image_name);

    const HandeUpdatePost = async (values) => {
        if (!isValid) return;
        // const docRef = doc(db, "posts", postId);
        // await updateDoc(docRef, {
        //     ...values,
        //     image,
        //     content,
        // });
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
            image,
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
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: formDataJsonString,
        };

        const response = await fetch(
            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/posts/update/${postId}`,
            fetchOptions
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        toast.success("Update post successfully");
        navigate("/manage/post");
    };
    useEffect(() => {
        async function fetchData() {
            const response = await axios(
                `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/posts/${postId}`
            );
            reset(response.data.data);
            setSelectCategory(response.data.data?.category || "");
            setContent(response.data.data?.content || "");
        }
        fetchData();
    }, [postId, reset]);

    useEffect(() => {
        setImage(imageURL);
    }, [imageURL, setImage]);

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

    if (!postId) return;
    return (
        <div>
            {" "}
            <DashboardHeading
                title="Update post"
                desc={`Update your post id: ${postId}`}
            ></DashboardHeading>
            <form onSubmit={handleSubmit(HandeUpdatePost)}>
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
                                onChange={() =>
                                    setValue("status", postStatus.APPROVED)
                                }
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.PENDING
                                }
                                onChange={() =>
                                    setValue("status", postStatus.PENDING)
                                }
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.REJECTED
                                }
                                onChange={() =>
                                    setValue("status", postStatus.REJECTED)
                                }
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                </div>
                <Button
                    type="submit"
                    className="mx-auto w-[250px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update post
                </Button>
            </form>
        </div>
    );
};

export default PostUpdate;
