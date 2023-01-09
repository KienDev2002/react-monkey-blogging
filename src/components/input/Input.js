import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputStyles = styled.div`
    position: relative;
    width: 100%;
    input {
        width: 100%;
        padding: 20px;
        padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
        background-color: ${(props) => props.theme.grayLight};
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s linear;
        border: 1px solid transparent;
    }

    input:focus {
        background-color: #fff;
        border-color: ${(props) => props.theme.primary};
    }

    input::placeholder {
        color: #84878b;
    }

    .input-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
`;

const Input = ({
    name = "",
    type = "",
    children,
    disabled,
    control,
    ...props
}) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <InputStyles hasIcon={children ? true : false}>
            <input
                className={`${disabled === true ? "opacity-25" : ""} `}
                id={name}
                disabled={disabled}
                type={type}
                {...field}
                {...props}
            ></input>
            {children ? <div className="input-icon">{children}</div> : null}
        </InputStyles>
    );
};

Input.propsTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    control: PropTypes.any.isRequired,
};

export default Input;
