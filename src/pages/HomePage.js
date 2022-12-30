import { signOut } from "firebase/auth";
import React from "react";
import styled from "styled-components";
import { auth } from "~/components/firebase/firebase-config";
import Header from "~/components/layout/Header";
import Layout from "~/components/layout/Layout";
import HomeBanner from "~/module/home/HomeBanner";
import HomeFeature from "~/module/home/HomeFeature";
import HomeNewest from "~/module/home/HomeNewest";

const HomePageStyles = styled.div``;

const HomePage = () => {
    const handleSignOut = () => {
        signOut(auth);
    };
    return (
        <HomePageStyles>
            <Layout>
                <HomeBanner></HomeBanner>
                <HomeFeature></HomeFeature>
                <HomeNewest></HomeNewest>
            </Layout>
        </HomePageStyles>
    );
};

export default HomePage;
