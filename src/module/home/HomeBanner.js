import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";

import { Button } from "~/components/button";

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" className="p-5 bg-red-100">
            <p className="text-red-600">
                Không thể lấy data do components bị lỗi
            </p>
        </div>
    );
}

const HomeBannerStyles = styled.div`
    height: 520px;
    background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
    );
    margin-bottom: 60px;

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
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                            <Button kind="secondary" to="/sign-up">
                                Get Started
                            </Button>
                        </ErrorBoundary>
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
