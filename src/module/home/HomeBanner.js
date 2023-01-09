import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";

import { Button } from "~/components/button";
import { useAuth } from "~/contexts/auth-context";

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
    const { userInfo } = useAuth();
    return (
        <HomeBannerStyles>
            <div className="container">
                <div className="banner">
                    <div className="banner-content">
                        <h1 className="banner-heading">Monkey Blogging</h1>
                        <p className="banner-desc">
                            If you've ever read a blog post, that is you
                            received content from a judicial leader Think of
                            themselves as experts in their industry. It could be
                            if blog posts are well written, you will gain useful
                            knowledge and positive opinions about the writer or
                            brand that produced the content.
                        </p>
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                            {userInfo ? (
                                ""
                            ) : (
                                <Button kind="secondary" to="/sign-up">
                                    Get Started
                                </Button>
                            )}
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
