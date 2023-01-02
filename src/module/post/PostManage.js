import { Pagination } from "~/components/pagination";
import { Table } from "~/components/table";
import React, { useEffect } from "react";
import { useState } from "react";
import {
    collection,
    getDocs,
    limit,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "~/components/firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { ActionDelete, ActionEdit, ActionView } from "~/components/action";
import { Button } from "~/components/button";

const POST_PER_PAGE = 1;

const PostManage = () => {
    const navigate = useNavigate();
    const [postList, setPostList] = useState([]);
    const [filter, setFilter] = useState("");
    const [lastDoc, setLastDoc] = useState();

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "posts");
            // onSnapshot(colRef, (snapshot) => {
            //     setTotalCategory(snapshot.size);
            // });
            const newRef = filter
                ? query(
                      colRef,
                      where("name", ">=", filter),
                      where("name", "<=", filter + "utf8")
                  )
                : query(colRef, limit(POST_PER_PAGE));
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
                setPostList(results);
            });
        }
        fetchData();
    }, [filter]);
    return (
        <div>
            <h1 className="dashboard-heading">Manage post</h1>
            <div className="flex justify-end mb-10">
                <div className="w-full max-w-[300px]">
                    <input
                        type="text"
                        className="w-full p-4 border border-gray-300 border-solid rounded-lg"
                        placeholder="Search post..."
                    />
                </div>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Id</th>
                        <th>Post</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {postList.length > 0 &&
                        postList.map((post) => (
                            <tr key={post.id}>
                                <td></td>
                                <td title={post.id}>
                                    {post.id.slice(0, 5) + "..."}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <img
                                            src={post.image}
                                            alt=""
                                            className="w-[66px] h-[55px] rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold max-w-[300px] whitespace-pre-wrap">
                                                {post.title}
                                            </h3>
                                            <time className="text-sm text-gray-500">
                                                Date:
                                                {post?.createdAt?.seconds &&
                                                    new Date(
                                                        post.createdAt
                                                            ?.seconds * 1000
                                                    ).toLocaleDateString(
                                                        "vi-VI"
                                                    )}
                                            </time>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-gray-500">
                                        {post.category.name}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-gray-500">
                                        {post.user.username}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center text-gray-500 gap-x-3">
                                        <ActionView
                                            onClick={() =>
                                                navigate(`/${post.slug}`)
                                            }
                                        ></ActionView>

                                        <ActionEdit></ActionEdit>
                                        <ActionDelete></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            <div className="mt-10 mx-auto w-[250px]">
                <Button> Load more</Button>
            </div>
        </div>
    );
};

export default PostManage;
