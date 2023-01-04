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
import PostItem from "../post/PostItem";
import PostNewestItem from "../post/PostNewestItem";
import PostNewestLarge from "../post/PostNewestLarge";
import { v4 } from "uuid";

const HomeNewestStyles = styled.div`
    .layout {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-gap: 40px;
        margin-bottom: 64px;
        align-items: start;
    }
    .sidebar {
        padding: 28px 20px;
        background-color: #f3edff;
        border-radius: 16px;
    }
`;

const HomeNewest = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const colRef = collection(db, "posts");
        const queries = query(
            colRef,
            limit(4),
            where("status", "==", 1),
            where("hot", "==", false)
        );
        onSnapshot(queries, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(results);
        });
    }, []);

    if (posts.length <= 0) return;
    const [first, ...other] = posts;

    return (
        <HomeNewestStyles className="home-block">
            <div className="container">
                <Heading>Mới nhất</Heading>
                <div className="layout">
                    <PostNewestLarge data={first}></PostNewestLarge>
                    <div className="sidebar">
                        {other.length > 0 &&
                            other.map((post) => (
                                <PostNewestItem
                                    key={v4()}
                                    data={post}
                                ></PostNewestItem>
                            ))}
                    </div>
                </div>
                <div className="grid-layout grid-layout--primary">
                    <PostItem></PostItem>
                    <PostItem></PostItem>
                    <PostItem></PostItem>
                </div>
            </div>
        </HomeNewestStyles>
    );
};

export default HomeNewest;
