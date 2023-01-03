import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const PostMetaStyles = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    color: inherit;
    .post {
        &-time {
        }
        &-dot {
            display: inline-block;
            width: 4px;
            height: 4px;
            background-color: currentColor;
            border-radius: 100rem;
        }
        &-author {
        }
    }
`;

const PostMeta = ({
    date = "Mar 23",
    authorName = "Andiez Le",
    className = "",
    to = "",
}) => {
    return (
        <PostMetaStyles className={className}>
            <span className="post-time">{date}</span>
            <span className="post-dot"></span>
            <Link to={`/user/${to}`}>
                <span className="post-author">{authorName}</span>
            </Link>
        </PostMetaStyles>
    );
};

export default PostMeta;
