import React, { Children } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import LoadingSpinner from "../loading/LoadingSpinner";

const ButtonStyles = styled.button`
    cursor: pointer;
    padding-right: 25px;
    padding-left: 25px;
    line-height: 1;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${(props) => props.height || "66px"};
    background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
    );
    border-radius: 8px;
    font-size: 1.8rem;
    font-weight: 600;

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
    ...props
}) => {
    const { isLoading } = props;
    const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    return (
        <ButtonStyles type={type} onClick={onClick} {...props}>
            {child}
        </ButtonStyles>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit"]).isRequired,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
};

export default Button;
