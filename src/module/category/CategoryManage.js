import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useState } from "react";
import { ActionDelete, ActionEdit, ActionView } from "~/components/action";
import { db } from "~/components/firebase/firebase-config";
import { LabelStatus } from "~/components/label";
import { Table } from "~/components/table";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import { catogoryStatus } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/button";

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const colRef = collection(db, "categories");
        onSnapshot(colRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategoryList(results);
        });
    }, []);
    const handleDeleteCategory = (docId) => {
        const docRef = doc(db, "categories", docId);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(docRef);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };
    return (
        <div>
            <DashboardHeading title="Categories" desc="Manage your category">
                <Button kind="ghost" height="60px" to="/manage/add-category">
                    Create category
                </Button>
            </DashboardHeading>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.length > 0 &&
                        categoryList.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <span className="italic text-gray-400">
                                        {category.slug}
                                    </span>
                                </td>
                                <td>
                                    {category.status ===
                                        catogoryStatus.APPROVED && (
                                        <LabelStatus type="success">
                                            Approved
                                        </LabelStatus>
                                    )}
                                    {category.status ===
                                        catogoryStatus.UNAPPROVED && (
                                        <LabelStatus type="warning">
                                            Unapproved
                                        </LabelStatus>
                                    )}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <ActionView></ActionView>
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-category?id=${category.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() =>
                                                handleDeleteCategory(
                                                    category.id
                                                )
                                            }
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CategoryManage;
