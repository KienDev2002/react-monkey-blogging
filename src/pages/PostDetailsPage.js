/* eslint-disable array-callback-return */
import styled from "styled-components";
import React from "react";
import PostRelated from "~/module/post/PostRelated";
import PostMeta from "~/module/post/PostMeta";
import PostImage from "~/module/post/PostImage";
import PostCategory from "~/module/post/PostCategory";
import parse from "html-react-parser";
import NotFoundPage from "./NotFoundPage";
import * as yup from "yup";
import Swal from "sweetalert2";
import Layout from "~/components/layout/Layout";
import AuthorBox from "~/components/author/AuthorBox";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { db } from "~/components/firebase/firebase-config";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { Field } from "~/components/field";
import { Label } from "~/components/label";
import { Input } from "~/components/input";
import { Button } from "~/components/button";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "~/contexts/auth-context";
import axios from "axios";
import Heading from "~/components/layout/Heading";
const PostDetailsPageStyles = styled.div`
    .post {
        &-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 40px;
            margin: 40px 0;
        }
        &-feature {
            width: 100%;
            max-width: 640px;
            height: 466px;
            border-radius: 20px;
        }
        &-heading {
            font-weight: bold;
            font-size: 36px;
            margin-bottom: 16px;
        }
        &-info {
            flex: 1;
        }
        &-content {
            max-width: 700px;
            margin: 80px auto;
        }
    }
    .author {
        margin-top: 40px;
        display: flex;
        border-radius: 20px;
        background-color: ${(props) => props.theme.grayF3};
        &-image {
            width: 200px;
            height: 200px;
            flex-shrink: 0;
            border-radius: inherit;
        }
        &-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: inherit;
        }
        &-content {
            flex: 1;
            padding: 20px;
        }
        &-name {
            font-weight: bold;
            margin-bottom: 20px;
            font-size: 20px;
        }
        &-desc {
            font-size: 14px;
            line-height: 2;
        }
    }
`;

const schema = yup.object({
    comment: yup.string().required("please enter your comment"),
});

const PostDetailsPage = () => {
    const { userInfo } = useAuth();
    const { slug } = useParams();
    const [updateComment, setUpdateComment] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [postInfo, setPostInfo] = useState({});
    useEffect(() => {
        async function fetchData() {
            if (!slug) return;
            const colRef = query(
                collection(db, "posts"),
                where("slug", "==", slug)
            );
            onSnapshot(colRef, (snapshot) => {
                snapshot.forEach((doc) => {
                    setPostInfo(doc.data());
                });
            });
        }
        fetchData();
    }, [slug]);
    const {
        handleSubmit,
        control,
        reset,
        formState: { isValid, errors, isSubmitting },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    useEffect(() => {
        document.body.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [slug]);

    const date = postInfo?.createdAt?.seconds
        ? new Date(postInfo?.createdAt?.seconds * 1000)
        : new Date();
    const formatDate = new Date(date).toLocaleDateString("vi-VI");

    useEffect(() => {
        const arrError = Object.values(errors);
        if (arrError.length > 0) {
            toast.error(arrError[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
    const handleSubmitComment = async (values) => {
        if (!isValid) return;
        const data = {
            comment: values.comment,
            user: {
                id: userInfo.id || "",
                fullname: userInfo.fullname || "admin",
                email: userInfo.email || "admin@***",
                password: userInfo.password || "********",
                username: userInfo.username || "admin",
                avatar:
                    userInfo.avatar ||
                    "https://tse1.mm.bing.net/th?id=OIP.MMjgXw0k06T087lG4CcNXAHaHa&pid=Api&P=0",
                status: userInfo.status || 1,
                role: userInfo.role || 1,
                description: userInfo.description || "database administrator",
                createdAt: userInfo.createdAt || "***",
            },
        };

        // const formDataJsonString = JSON.stringify(data);

        // const fetchOptions = {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Accept: "application/json",
        //     },
        //     body: formDataJsonString,
        // };

        // const response = await fetch(
        //     "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/comments/create",
        //     fetchOptions
        // );

        // if (!response.ok) {
        //     const errorMessage = await response.text();
        //     throw new Error(errorMessage);
        //  }

        const dataPost = {
            ...postInfo,
            comment: [
                ...postInfo?.comment,
                {
                    ...data,
                    createAt: Date.now(),
                },
            ],
        };
        const formDataJsonStringPost = JSON.stringify(dataPost);

        const Post = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: formDataJsonStringPost,
        };

        const responsePost = await fetch(
            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/posts/update/${postInfo.id}`,
            Post
        );

        if (!responsePost.ok) {
            const errorMessage = await responsePost.text();
            throw new Error(errorMessage);
        }
        toast.success("comment successfully");
        reset({
            comment: "",
        });
    };
    const [indexComment, setIndexComment] = useState();
    const [commentId, setCommentId] = useState();
    if (!slug) return <NotFoundPage></NotFoundPage>;
    if (!postInfo.title) return null;
    const handleEditComment = async function (commentId, index) {
        postInfo.comment.map((comment) => {
            if (comment.createAt === commentId) {
                setIndexComment(index);
                setCommentId(commentId);
                reset({
                    comment: comment.comment,
                });
            }
        });
        setUpdateComment(!updateComment);
    };

    const handleSubmitUpdateComment = async (values) => {
        postInfo.comment.splice(indexComment, 1);
        if (!isValid) return;
        const data = {
            comment: values.updateComment,
            createAt: commentId,
            user: {
                id: userInfo.id || "",
                fullname: userInfo.fullname || "admin",
                email: userInfo.email || "admin@***",
                password: userInfo.password || "********",
                username: userInfo.username || "admin",
                avatar:
                    userInfo.avatar ||
                    "https://tse1.mm.bing.net/th?id=OIP.MMjgXw0k06T087lG4CcNXAHaHa&pid=Api&P=0",
                status: userInfo.status || 1,
                role: userInfo.role || 1,
                description: userInfo.description || "database administrator",
                createdAt: userInfo.createdAt || "***",
            },
        };
        postInfo.comment.splice(indexComment, 0, data);

        setUpdateComment(!updateComment);
        const formDataJsonStringPost = JSON.stringify(postInfo);

        const Post = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: formDataJsonStringPost,
        };

        const responsePost = await fetch(
            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/posts/update/${postInfo.id}`,
            Post
        );

        if (!responsePost.ok) {
            const errorMessage = await responsePost.text();
            throw new Error(errorMessage);
        }
        toast.success("edit comment successfully");
        reset({
            comment: "",
        });
    };

    const handleDeleteComment = async (index) => {
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
                postInfo.comment.splice(index, 1);
                const formDataJsonStringPost = JSON.stringify(postInfo);

                const Post = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: formDataJsonStringPost,
                };

                const responsePost = await fetch(
                    `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/posts/update/${postInfo.id}`,
                    Post
                );

                if (!responsePost.ok) {
                    const errorMessage = await responsePost.text();
                    throw new Error(errorMessage);
                }

                Swal.fire(
                    "Deleted!",
                    "Your comment has been deleted.",
                    "success"
                );
            }
        });
    };
    return (
        <PostDetailsPageStyles>
            <Layout>
                <div className="container">
                    <div className="post-header">
                        <PostImage
                            url={postInfo.image}
                            className="post-feature"
                        ></PostImage>
                        <div className="post-info">
                            <PostCategory
                                className="mb-6"
                                to={postInfo.category.slug}
                            >
                                {postInfo.category?.name}
                            </PostCategory>
                            <h1 className="post-heading">{postInfo.title}</h1>
                            <PostMeta
                                to={slugify(postInfo.user?.username || "", {
                                    lower: true,
                                })}
                                authorName={postInfo.user?.fullname}
                                date={formatDate}
                            ></PostMeta>
                        </div>
                    </div>

                    <div className="post-content">
                        <div className="entry-content">
                            {parse(postInfo.content || "")}
                        </div>

                        <AuthorBox userId={postInfo.user.id}></AuthorBox>

                        <Heading className="mt-20">Comments</Heading>
                        <div className="mt-20 border-t-2 border-t-gray-300 comment">
                            {postInfo.comment.length > 0 &&
                                postInfo.comment.map(function (comment, index) {
                                    if (comment.comment !== undefined) {
                                        return (
                                            <div
                                                key={comment.createAt}
                                                className="flex flex-col mb-10"
                                            >
                                                <div className="flex p-5 gap-x-3">
                                                    <div className="avatar w-[54px] h-[56px] rounded-full">
                                                        <img
                                                            src={
                                                                comment.user
                                                                    ?.avatar
                                                            }
                                                            alt=""
                                                            className="object-cover rounded-full"
                                                        />
                                                    </div>
                                                    <div className="flex justify-between flex-1 p-5 bg-gray-200 rounded-lg comment-info">
                                                        <div>
                                                            <h3 className="font-bold">
                                                                {
                                                                    comment.user
                                                                        ?.fullname
                                                                }
                                                            </h3>
                                                            <div>
                                                                <p className="font-normal text-gray-500">
                                                                    {
                                                                        comment.comment
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="time">
                                                            <p className="font-normal text-gray-500">
                                                                Date:{" "}
                                                                {new Date(
                                                                    comment.createAt
                                                                ).toLocaleDateString(
                                                                    "vi"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {comment?.user?.email ===
                                                userInfo.email ? (
                                                    <div className="flex ml-auto mr-10 gap-x-3">
                                                        <span
                                                            onClick={() =>
                                                                handleEditComment(
                                                                    comment?.createAt,
                                                                    index
                                                                )
                                                            }
                                                            className="cursor-pointer hover:text-green-400"
                                                        >
                                                            Edit
                                                        </span>
                                                        <span
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    index
                                                                )
                                                            }
                                                            className="cursor-pointer hover:text-green-400"
                                                        >
                                                            Delete
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    }
                                })}
                        </div>
                        {!updateComment ? (
                            <form
                                className="mt-20 form"
                                onSubmit={handleSubmit(handleSubmitComment)}
                            >
                                <Field>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Input
                                        control={control}
                                        type="text"
                                        name="comment"
                                        placeholder="Enter your comment"
                                    />
                                </Field>

                                <Button
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full max-w-[350px] mx-auto"
                                >
                                    Comment
                                </Button>
                            </form>
                        ) : (
                            <form
                                className="mt-20 form"
                                onSubmit={handleSubmit(
                                    handleSubmitUpdateComment
                                )}
                            >
                                <Field>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Input
                                        control={control}
                                        type="text"
                                        name="updateComment"
                                        placeholder="Enter your comment"
                                    />
                                </Field>

                                <Button
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full max-w-[350px] mx-auto"
                                >
                                    Update Comment
                                </Button>
                            </form>
                        )}
                    </div>
                    <PostRelated
                        categoryId={postInfo.category.id}
                    ></PostRelated>
                </div>
            </Layout>
        </PostDetailsPageStyles>
    );
};

export default PostDetailsPage;
