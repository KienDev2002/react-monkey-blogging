import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestLargeStyles = styled.div`
    .post {
        &-image {
            display: block;
            margin-bottom: 16px;
            height: 433px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 16px;
            }
        }
        &-category {
            margin-bottom: 10px;
        }

        &-title {
            margin-bottom: 12px;
        }
    }
`;

const PostNewestLarge = () => {
    return (
        <PostNewestLargeStyles>
            <div className="post-image">
                <img
                    src="https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2294&q=80"
                    alt=""
                />
            </div>
            <PostCategory>Kiến thức</PostCategory>
            <PostTitle size="big">
                Hướng dẫn setup phòng cực chill dành cho người mới toàn tập
            </PostTitle>
            <PostMeta></PostMeta>
        </PostNewestLargeStyles>
    );
};

export default PostNewestLarge;
