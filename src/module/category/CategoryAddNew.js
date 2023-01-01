import React from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { Button } from "~/components/button";
import { Radio } from "~/components/checkbox";
import { Field } from "~/components/field";
import { FieldCheckboxes } from "~/components/field";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import DashboardHeading from "../../drafts/DashboardHeading";
import { catogoryStatus } from "~/utils/constants";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "~/components/firebase/firebase-config";
import { toast } from "react-toastify";

const CategoryAddNew = () => {
    const {
        control,
        setValue,
        formState: { errors, isSubmitting, isValid },
        handleSubmit,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            slug: "",
            status: 1,
            createdAt: new Date(),
        },
    });

    const hanleAddNewCategory = async (values) => {
        if (!isValid) return;
        const newValues = { ...values };
        newValues.slug = slugify(newValues.slug || newValues.name, {
            lower: true,
        });
        newValues.status = Number(newValues.status);
        const colRef = collection(db, "categories");
        try {
            await addDoc(colRef, {
                ...newValues,
                createdAt: serverTimestamp(),
            });
            toast.success("Create new category successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            reset({
                name: "",
                slug: "",
                status: 1,
                createdAt: new Date(),
            });
        }
    };

    const watchStatus = watch("status");
    return (
        <div>
            <DashboardHeading
                title="New category"
                desc="Add new category"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(hanleAddNewCategory)}>
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
                    Add new category
                </Button>
            </form>
        </div>
    );
};

export default CategoryAddNew;
