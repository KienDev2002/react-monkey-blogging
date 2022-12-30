import { signOut } from "firebase/auth";
import React from "react";
import styled from "styled-components";
import { auth } from "~/components/firebase/firebase-config";
import Header from "~/layout/Header";

const HomePageStyles = styled.div``;

const HomePage = () => {
    const handleSignOut = () => {
        signOut(auth);
    };
    return (
        <HomePageStyles>
            <Header></Header>
        </HomePageStyles>
    );
};

export default HomePage;
