import { collection, onSnapshot } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ActionDelete, ActionEdit, ActionView } from "~/components/action";
import { db } from "~/components/firebase/firebase-config";
import { LabelStatus } from "~/components/label";
import { Table } from "~/components/table";
import DashboardHeading from "~/drafts/DashboardHeading";
import { catogoryStatus } from "~/utils/constants";

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
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
    console.log(categoryList);
    return (
        <div>
            <DashboardHeading
                title="Categories"
                desc="Manage your category"
            ></DashboardHeading>
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
                                        <ActionEdit></ActionEdit>
                                        <ActionDelete></ActionDelete>
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
