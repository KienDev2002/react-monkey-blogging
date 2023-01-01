import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

import LoadingSpinner from "../loading/LoadingSpinner";
import { NavLink } from "react-router-dom";

const ButtonStyles = styled.button`
    cursor: pointer;
    padding-right: 25px;
    padding-left: 25px;
    line-height: 1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 1.8rem;
    font-weight: 600;
    height: ${(props) => props.height || "66px"};
    ${(props) =>
        props.kind === "secondary" &&
        css`
            background-color: #fff;
            color: ${(props) => props.theme.primary};
        `};
    ${(props) =>
        props.kind === "primary" &&
        css`
            color: #fff;
            background-image: linear-gradient(
                to right bottom,
                ${(props) => props.theme.primary},
                ${(props) => props.theme.secondary}
            );
        `};
    ${(props) =>
        props.kind === "ghost" &&
        css`
            color: ${(props) => props.theme.primary};
            background-color: rgba(29, 192, 113, 0.1);
        `};

    &:disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`;

/**
 *
 * @param {*} onClick handler onClick
 * @requires
 * @param {string} type Type of button or submit
 */

const Button = ({
    type = "button",
    onClick = () => {},
    children,
    kind = "primary",
    ...props
}) => {
    const { isLoading, to } = props;
    const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    if (to !== "" && typeof to === "string") {
        return (
            <NavLink to={to} style={{ display: "inline-block" }}>
                <ButtonStyles type={type} kind={kind} {...props}>
                    {child}
                </ButtonStyles>
            </NavLink>
        );
    }
    return (
        <ButtonStyles type={type} kind={kind} onClick={onClick} {...props}>
            {child}
        </ButtonStyles>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit"]),
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default Button;
