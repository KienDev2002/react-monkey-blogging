import React from "react";
import styled from "styled-components";
import { Button } from "~/components/button";

const menuLinks = [
    {
        url: "/#",
        title: "Home",
    },
    {
        url: "/#",
        title: "Blog",
    },
    {
        url: "/#",
        title: "Contact",
    },
];
const HeaderStyles = styled.header`
    padding: 40px 0;
    .header-main {
        display: flex;
        align-items: center;
    }

    .logo {
        display: block;
        max-width: 50px;
    }

    .menu {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-left: 40px;
        list-style: none;
    }

    .search {
        position: relative;
        padding: 15px 25px;
        border: 1px solid #eee;
        border-radius: 8px;
        width: 100%;
        max-width: 320px;
        margin-left: auto;
        display: flex;
        align-items: center;
    }

    .search-input {
        flex: 1;
        padding-right: 45px;
    }
    .search-icon {
        position: absolute;
        top: 50%;
        right: 25px;
        transform: translateY(-50%);
    }
    .header-button {
        margin-left: 20px;
    }
`;

const Header = () => {
    return (
        <HeaderStyles>
            <div className="container">
                <div className="header-main">
                    <a href="/">
                        <img
                            className="logo"
                            srcSet="/logo.png 2x"
                            alt="Monkey blogging"
                        />
                    </a>
                    <ul className="menu">
                        {menuLinks.map((item) => (
                            <li className="menu-item" key={item.title}>
                                <a href={item.url} className="menu-link">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="search">
                        <input
                            placeholder="Search posts"
                            type="text"
                            className="search-input"
                        />
                        <div className="search-icon">
                            <svg
                                width="18"
                                height="17"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <ellipse
                                    cx="7.66669"
                                    cy="7.05161"
                                    rx="6.66669"
                                    ry="6.05161"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <Button
                        style={{ maxWidth: "200px" }}
                        className="header-button"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </HeaderStyles>
    );
};

export default Header;
