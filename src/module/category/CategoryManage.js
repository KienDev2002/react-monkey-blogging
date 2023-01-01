import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    onSnapshot,
    query,
    startAfter,
    where,
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
import { debounce } from "lodash";

const CATEGORY_PER_PAGE = 1;

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [lastDoc, setLastDoc] = useState();
    const [totalCategory, setTotalCategory] = useState(0);

    const handleLoadMoreCategory = async () => {
        const nextRef = query(
            collection(db, "categories"),
            startAfter(lastDoc || 0),
            limit(CATEGORY_PER_PAGE)
        );

        onSnapshot(nextRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategoryList([...categoryList, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);

        // Get the last visible document
        const lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "categories");
            onSnapshot(colRef, (snapshot) => {
                setTotalCategory(snapshot.size);
            });
            const newRef = filter
                ? query(
                      colRef,
                      where("name", ">=", filter),
                      where("name", "<=", filter + "utf8")
                  )
                : query(colRef, limit(CATEGORY_PER_PAGE));
            const documentSnapshots = await getDocs(newRef);

            // Get the last visible document
            const lastVisible =
                documentSnapshots.docs[documentSnapshots.docs.length - 1];

            setLastDoc(lastVisible);
            onSnapshot(newRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setCategoryList(results);
            });
        }
        fetchData();
    }, [filter]);
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
    const hanleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);
    return (
        <div>
            <DashboardHeading title="Categories" desc="Manage your category">
                <Button kind="ghost" height="60px" to="/manage/add-category">
                    Create new category
                </Button>
            </DashboardHeading>
            <div className="flex justify-end mb-10">
                <input
                    onChange={hanleInputFilter}
                    type="text"
                    placeholder="Search category..."
                    className="px-5 py-4 border border-gray-300 rounded-lg outline-none"
                />
            </div>
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
            {totalCategory > categoryList.length && (
                <div className="mt-10">
                    <Button
                        onClick={handleLoadMoreCategory}
                        className="mx-auto"
                    >
                        Load more
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CategoryManage;
