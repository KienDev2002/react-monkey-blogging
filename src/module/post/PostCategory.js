import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const PostCategoryStyles = styled.div`
    display: inline-block;
    border-radius: 10px;
    color: ${(props) => props.theme.gray6B};
    font-size: 1.4rem;
    font-weight: 600;
    a {
        padding: 4px 10px;
        display: block;
    }
    ${(props) =>
        props.type === "primary" &&
        css`
            background-color: ${(props) => props.theme.grayF3}; ;
        `};
    ${(props) =>
        props.type === "secondary" &&
        css`
            background-color: #fff;
        `};
`;

const PostCategory = ({
    children,
    type = "primary",
    className = "",
    to = "/",
}) => {
    return (
        <PostCategoryStyles
            type={type}
            className={`post-category ${className}`}
        >
            <Link to={`/category/${to}`}>{children}</Link>
        </PostCategoryStyles>
    );
};

export default PostCategory;
