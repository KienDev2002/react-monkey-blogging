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
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import PostTitle from "~/module/post/PostTitle";
import { db } from "../firebase/firebase-config";
import Heading from "./Heading";

const FooterStyles = styled.div`
    margin-top: 40px;
    height: 300px;
    padding: 20px;
    display: flex;
    color: #fff;
    justify-content: space-between;
    background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
    );
    .left {
    }
`;

const menuLinks = [
    {
        url: "/",
        title: "Home",
    },
    {
        url: "/blog",
        title: "Blog",
    },
    {
        url: "/feedback",
        title: "Feedback",
    },
];
const Footer = () => {
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
        <FooterStyles className="">
            <div className="container flex justify-around">
                <div className="left w-[200px]">
                    <div className="">
                        <img srcSet="/logo.png 2x" alt="" />
                    </div>
                </div>
                <div className="flex-1 center">
                    <Heading className="text-white">Featured Posts</Heading>
                    {posts.length > 0 &&
                        posts.map((post) => (
                            <PostTitle
                                key={post.title}
                                size="small"
                                to={post.slug}
                                className="mb-10 text-xs"
                            >
                                {post.title}
                            </PostTitle>
                        ))}
                </div>
                <div className="w-[400px] flex flex-col items-center">
                    <Heading>Pages</Heading>
                    <ul className=" menu">
                        {menuLinks.map((item) => (
                            <li className="mb-10 menu-item" key={item.title}>
                                <NavLink
                                    to={item.url}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "menu-link text-blue-500"
                                            : "menu-link"
                                    }
                                >
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-[400px] flex flex-col items-center">
                    <Heading>Contact us</Heading>
                    <div className="flex items-center justify-center gap-x-3">
                        <span>Email: </span>
                        <span>ngotrungkien158@gmail.com</span>
                    </div>
                    <div className="flex items-center justify-center my-10 gap-x-3">
                        <span>Hotline: </span>
                        <span>08923479892</span>
                    </div>
                </div>
            </div>
        </FooterStyles>
    );
};

export default Footer;
