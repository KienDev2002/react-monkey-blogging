import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Heading from "~/components/layout/Heading";
import { useAuth } from "~/contexts/auth-context";
import PostItem from "../post/PostItem";

const HomeAllPost = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
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

    return (
        <div className="container mb-10">
            <Heading>All Posts</Heading>
            <div className="postList">
                <Swiper
                    grabCursor={"true"}
                    slidesPerView="auto"
                    spaceBetween={27}
                >
                    {postList.length > 0 &&
                        postList.map((item) => (
                            <SwiperSlide key={item.id}>
                                <PostItem data={item}></PostItem>
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
};

export default HomeAllPost;
