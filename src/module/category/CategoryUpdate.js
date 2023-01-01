import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Button } from "~/components/button";
import { Radio } from "~/components/checkbox";
import { Field, FieldCheckboxes } from "~/components/field";
import { db } from "~/components/firebase/firebase-config";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import { catogoryStatus } from "~/utils/constants";

const CategoryUpdate = () => {
    const [params] = useSearchParams();
    const categoryId = params.get("id");
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
    const watchStatus = watch("status");

    useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "categories", categoryId);
            const singleDoc = await getDoc(docRef);
            reset(singleDoc.data());
        }
        fetchData();
    }, [categoryId, reset]);
    const hanleUpdateCategory = async (values) => {
        const docRef = doc(db, "categories", categoryId);
        await updateDoc(docRef, {
            title: values.name,
            slug: slugify(values.slug || values.name, { lower: true }),
            status: values.status,
        });
        toast.success("Update category successfully!");
        navigate("/manage/category");
    };

    if (!categoryId) return;
    return (
        <div>
            <DashboardHeading
                title="Update category"
                desc={`Update your category id: ${categoryId}`}
            ></DashboardHeading>
            <form onSubmit={handleSubmit(hanleUpdateCategory)}>
                <div className="form-layout">
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            name="slug"
                            placeholder="Enter your slug"
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
                                checked={
                                    Number(watchStatus) ===
                                    catogoryStatus.APPROVED
                                }
                                onChange={() =>
                                    setValue("status", catogoryStatus.APPROVED)
                                }
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) ===
                                    catogoryStatus.UNAPPROVED
                                }
                                onChange={() =>
                                    setValue(
                                        "status",
                                        catogoryStatus.UNAPPROVED
                                    )
                                }
                            >
                                Unapproved
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    kind="primary"
                    className="mx-auto w-[250px]"
                >
                    Update category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;
