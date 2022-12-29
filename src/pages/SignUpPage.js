import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { IconEyeClose, IconEyeOpen } from "~/components/icon";
import { Field } from "~/components/field";

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
                    <Field>
                        <Label htmlFor="fullname">Fullname</Label>
                        <Input
                            control={control}
                            type="text"
                            name="fullname"
                            placeholder="Enter your fullname"
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            control={control}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            control={control}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                        >
                            <IconEyeClose className="input-icon"></IconEyeClose>
                        </Input>
                    </Field>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
