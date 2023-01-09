import axios from "axios";
import { query } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "~/components/layout/Heading";
import Layout from "~/components/layout/Layout";
import PostItem from "~/module/post/PostItem";

const BlogPage = () => {
    const [postList, setPostList] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const response = await axios(
                "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/posts"
            );
            setPostList(response.data.data);
        }
        fetchData();
    }, []);

    if (postList.length <= 0) return null;
    return (
        <Layout>
            <div className="container">
                <div className="pt-10"></div>
                <Heading>Bài viết</Heading>
                <div className="grid-layout grid-layout--primary">
                    {postList &&
                        postList.map((post) => (
                            <PostItem key={post.id} data={post}></PostItem>
                        ))}
                </div>
            </div>
        </Layout>
    );
};

export default BlogPage;
