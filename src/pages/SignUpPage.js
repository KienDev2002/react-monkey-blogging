import React from "react";
import styled from "styled-components";
import { Label } from "~/components/label";

const SignUpPageStyles = styled.div`
    min-height: 100vh;
    padding: 40px;

    .logo {
        margin: 0 auto 20px;
    }

    .heading {
        text-align: center;
        color: ${(props) => props.theme.primary};
        font-weight: bold;
        font-size: 4rem;
        margin-bottom: 60px;
    }

    .field {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        align-items: flex-start;
    }

    .input {
        width: 100%;
        padding: 20px;
        background-color: ${(props) => props.theme.grayLight};
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s linear;
        border: 1px solid transparent;
    }

    .input:focus {
        background-color: #fff;
        border-color: ${(props) => props.theme.primary};
    }

    .input::placeholder {
        color: #84878b;
    }

    .form {
        max-width: 600px;
        margin: 0 auto;
    }
`;

const SignUpPage = () => {
    return (
        <SignUpPageStyles>
            <div className="container">
                <img
                    className="logo"
                    srcSet="/logo.png 2x"
                    alt="monkey-blogging"
                />
                <h1 className="heading">Monkey Blogging</h1>
                <form className="form">
                    <div className="field">
                        <Label htmlFor="fullname">Fullname</Label>
                        <input
                            type="text"
                            className="input"
                            id="fullname"
                            placeholder="Enter your fullname"
                        />
                    </div>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
