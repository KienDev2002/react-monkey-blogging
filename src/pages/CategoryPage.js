import { async } from "@firebase/util";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthorBox from "~/components/author/AuthorBox";
import { db } from "~/components/firebase/firebase-config";
import Heading from "~/components/layout/Heading";
import Layout from "~/components/layout/Layout";
import PostCategory from "~/module/post/PostCategory";
import PostImage from "~/module/post/PostImage";
import PostItem from "~/module/post/PostItem";
import PostMeta from "~/module/post/PostMeta";
import PostRelated from "~/module/post/PostRelated";

const CategoryPage = () => {
    const param = useParams();
    const [posts, setPost] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const docRef = query(
                collection(db, "posts"),
                where("category.slug", "==", param.slug)
            );
            onSnapshot(docRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setPost(results);
            });
        }
        fetchData();
    }, [param.slug]);

    if (posts.length <= 0) return null;
    return (
        <Layout>
            <div className="container">
                <div className="pt-10"></div>
                <Heading>Danh mục {param.slug}</Heading>
                <div className="grid-layout grid-layout--primary">
                    {posts &&
                        posts.map((post) => (
                            <PostItem key={post.id} data={post}></PostItem>
                        ))}
                </div>
            </div>
        </Layout>
    );
};

export default CategoryPage;
