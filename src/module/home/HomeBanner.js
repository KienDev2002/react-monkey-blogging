import React from "react";
import styled from "styled-components";

import { Button } from "~/components/button";

const HomeBannerStyles = styled.div`
    height: 520px;
    background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
    );

    .banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-content {
            max-width: 600px;
            color: #fff;
        }
        &-heading {
            font-size: 3.6rem;
            margin-bottom: 20px;
        }
        &-desc {
            margin-bottom: 40px;
            line-height: 1.75;
        }
    }
`;

const HomeBanner = () => {
    return (
        <HomeBannerStyles>
            <div className="container">
                <div className="banner">
                    <div className="banner-content">
                        <h1 className="banner-heading">Monkey Blogging</h1>
                        <p className="banner-desc">
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Minus quibusdam consequatur architecto dolores
                            nostrum quas, a, eius ad, minima voluptates sunt at!
                            Adipisci eveniet facilis unde nulla. Dolore, nemo
                            soluta!
                        </p>
                        <Button kind="secondary" to="/sign-up">
                            Get Started
                        </Button>
                    </div>
                    <div className="banner-img">
                        <img src="/img-banner.png" alt="" />
                    </div>
                </div>
            </div>
        </HomeBannerStyles>
    );
};

export default HomeBanner;
