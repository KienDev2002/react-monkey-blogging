import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputStyles = styled.div`
    position: relative;
    width: 100%;
    textarea {
        width: 100%;
        padding: 20px;
        padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
        background-color: ${(props) => props.theme.grayLight};
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s linear;
        border: 1px solid transparent;
        resize: none;
        min-height: 200px;
    }

    textarea:focus {
        background-color: #fff;
        border-color: ${(props) => props.theme.primary};
    }

    textarea::placeholder {
        color: #84878b;
    }

    .textarea-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
`;

const Textarea = ({ name = "", type = "", children, control, ...props }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <InputStyles hasIcon={children ? true : false}>
            <textarea id={name} type={type} {...field} {...props}></textarea>
            {children ? <div className="input-icon">{children}</div> : null}
        </InputStyles>
    );
};

Textarea.propsTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default Textarea;
