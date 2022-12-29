import React from "react";
import styled from "styled-components";

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
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
