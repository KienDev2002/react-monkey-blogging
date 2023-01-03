import { Pagination } from "~/components/pagination";
import { Table } from "~/components/table";
import React, { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
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
import { db } from "~/components/firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { ActionDelete, ActionEdit, ActionView } from "~/components/action";
import { Button } from "~/components/button";
import { LabelStatus } from "~/components/label";
import { postStatus, userRole } from "~/utils/constants";
import { debounce } from "lodash";
import { useAuth } from "~/contexts/auth-context";

const POST_PER_PAGE = 1;

const PostManage = () => {
    const navigate = useNavigate();
    const [postList, setPostList] = useState([]);
    const [filter, setFilter] = useState("");
    const [lastDoc, setLastDoc] = useState();
    const [totalPost, setTotalPost] = useState();

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "posts");
            onSnapshot(colRef, (snapshot) => {
                setTotalPost(snapshot.size);
            });
            const newRef = filter
                ? query(
                      colRef,
                      where("title", ">=", filter),
                      where("title", "<=", filter + "utf8")
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

    const handleDeletePost = async (postId) => {
        const docRef = doc(db, "posts", postId);
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
                Swal.fire("Deleted!", "Your post has been deleted.", "success");
            }
        });
    };

    const renderPostStatus = (status) => {
        switch (status) {
            case postStatus.APPROVED:
                return <LabelStatus type="success">Approved</LabelStatus>;
            case postStatus.PENDING:
                return <LabelStatus type="warning">Pending</LabelStatus>;
            case postStatus.REJECTED:
                return <LabelStatus type="danger">Rejected</LabelStatus>;

            default:
                break;
        }
    };
    const handleChangeInput = debounce((e) => {
        setFilter(e.target.value);
    }, 500);

    const handleLoadmore = async () => {
        const nextRef = query(
            collection(db, "posts"),
            startAfter(lastDoc || 0),
            limit(POST_PER_PAGE)
        );

        onSnapshot(nextRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPostList([...postList, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);

        // Get the last visible document
        const lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    const { userInfo } = useAuth();
    if (userInfo.role !== userRole.ADMIN) return null;

    return (
        <div>
            <h1 className="dashboard-heading">Manage post</h1>
            <div className="flex justify-end mb-10">
                <div className="w-full max-w-[300px]">
                    <input
                        onChange={handleChangeInput}
                        type="text"
                        className="w-full p-4 border border-gray-300 border-solid rounded-lg"
                        placeholder="Search post..."
                    />
                </div>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Post</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {postList.length > 0 &&
                        postList.map((post) => (
                            <tr key={post.id}>
                                <td title={post.id}>
                                    {post.id.slice(0, 5) + "..."}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <img
                                            src={post.image}
                                            alt=""
                                            className="w-[40px] h-[45px] rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold min-w-[200px] whitespace-pre-wrap">
                                                {post.title.slice(0, 20) +
                                                    "..."}
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
                                <td>{renderPostStatus(post.status)}</td>
                                <td>
                                    <div className="flex items-center text-gray-500 gap-x-3">
                                        <ActionView
                                            onClick={() =>
                                                navigate(`/${post.slug}`)
                                            }
                                        ></ActionView>

                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-post?id=${post.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() =>
                                                handleDeletePost(post.id)
                                            }
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {postList.length < totalPost && (
                <div className="mt-10 mx-auto w-[250px]">
                    <Button onClick={handleLoadmore}> Load more</Button>
                </div>
            )}
        </div>
    );
};

export default PostManage;
