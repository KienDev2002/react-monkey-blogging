import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { db } from "~/components/firebase/firebase-config";
import Heading from "~/components/layout/Heading";
import PostFeatureItem from "../post/PostFeatureItem";
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const colRef = collection(db, "posts");
        const queries = query(
            colRef,
            limit(3),
            where("status", "==", 1),
            where("hot", "==", true)
        );
        onSnapshot(queries, (snapShot) => {
            const results = [];
            snapShot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(results);
        });
    }, []);
    if (posts.length <= 0) return null;

    return (
        <HomeFeatureStyles className="home-block">
            <div className="container">
                <Heading>Bài viết nổi bật</Heading>
                <div className="grid-layout">
                    {posts.map((post) => (
                        <PostFeatureItem
                            key={post.id}
                            data={post}
                        ></PostFeatureItem>
                    ))}
                </div>
            </div>
        </HomeFeatureStyles>
    );
};

export default HomeFeature;
