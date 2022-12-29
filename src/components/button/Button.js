import React, { Children } from "react";
import styled from "styled-components";
import LoadingSpinner from "../loading/LoadingSpinner";
import Loading from "../loading/LoadingSpinner";

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
    width: 100%;

    &:disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`;

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

export default Button;
