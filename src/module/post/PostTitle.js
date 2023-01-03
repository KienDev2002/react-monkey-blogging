import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostTitleStyles = styled.h3`
    font-weight: 600;
    line-height: 1.5;
    a {
        display: block;
    }
    ${(props) =>
        props.size === "normal" &&
        css`
            font-size: 1.8rem;
        `};
    ${(props) =>
        props.size === "big" &&
        css`
            font-size: 2.2rem;
        `};
`;

const PostTitle = ({ children, className = "", size = "normal", to = "/" }) => {
    return (
        <PostTitleStyles size={size} className={`post-title ${className}`}>
            <Link to={`/${to}`}>{children}</Link>
        </PostTitleStyles>
    );
};

export default PostTitle;
