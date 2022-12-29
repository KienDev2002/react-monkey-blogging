import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Input } from "~/components/input";
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

    .form {
        max-width: 600px;
        margin: 0 auto;
    }
`;

const SignUpPage = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        watch,
    } = useForm();

    const hanleSignUp = (values) => {
        console.log(values);
    };
    return (
        <SignUpPageStyles>
            <div className="container">
                <img
                    className="logo"
                    srcSet="/logo.png 2x"
                    alt="monkey-blogging"
                />
                <h1 className="heading">Monkey Blogging</h1>
                <form className="form" onSubmit={handleSubmit(hanleSignUp)}>
                    <div className="field">
                        <Label htmlFor="fullname">Fullname</Label>

                        <Input
                            control={control}
                            type="text"
                            name="fullname"
                            placeholder="Enter your fullname"
                            hasIcon
                        ></Input>
                    </div>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
