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
import { useSearchParams } from "react-router-dom";
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

const PostUpdate = () => {
    const [params] = useSearchParams();
    const postId = params.get("id");
    const {
        control,
        reset,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { isSubmitting },
    } = useForm({
        mode: "onChange",
        defaultValues: {},
    });
    const watchHot = watch("hot");
    const watchStatus = watch("status");
    const imageURL = getValues("image");
    const image_name = getValues("image_name");
    const deleteAvatar = async () => {
        const docRef = doc(db, "posts", postId);
        await updateDoc(docRef, {
            image: "",
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

    const HandeUpdatePost = (values) => {
        console.log(values);
    };
    useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "posts", postId);
            const singleDoc = await getDoc(docRef);
            console.log(singleDoc.data());
            reset(singleDoc.data());
            setSelectCategory(singleDoc.data()?.category || "");
        }
        fetchData();
    }, [postId, reset]);

    useEffect(() => {
        setImage(imageURL);
    }, [imageURL, setImage]);

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
                <div className="mb-10">Content</div>
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
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Add new post
                </Button>
            </form>
        </div>
    );
};

export default PostUpdate;
