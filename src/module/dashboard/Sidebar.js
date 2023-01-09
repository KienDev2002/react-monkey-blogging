import { signOut } from "firebase/auth";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "~/components/firebase/firebase-config";
import { useAuth } from "~/contexts/auth-context";
const SidebarStyles = styled.div`
    width: 300px;
    background: #ffffff;
    box-shadow: 10px 10px 20px rgba(218, 213, 213, 0.15);
    border-radius: 12px;
    .menu-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 14px 20px;
        font-weight: 500;
        color: ${(props) => props.theme.gray80};
        margin-bottom: 20px;
        cursor: pointer;
        &.active,
        &:hover {
            background: #f1fbf7;
            color: ${(props) => props.theme.primary};
        }
    }
    @media screen and (max-width: 1023.98px) {
        display: none;
    }
`;
const sidebarLinks = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
            </svg>
        ),
    },
    {
        title: "Post",
        url: "/manage/post",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>
        ),
    },
    {
        title: "Category",
        url: "/manage/category",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
            </svg>
        ),
    },
    {
        title: "User",
        url: "/manage/user",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
            </svg>
        ),
    },
    {
        title: "Feedback",
        url: "/manage/feedback",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
            </svg>
        ),
    },
    {
        title: "Logout",
        url: "/",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
        ),
        onClick: () => {},
    },
];
const Sidebar = () => {
    const { setUserInfo } = useAuth();
    return (
        <SidebarStyles className="sidebar">
            {sidebarLinks.map((link) => {
                if (link.onClick) {
                    return (
                        <Link key={link.title} to="/sign-in">
                            <div
                                className="menu-item"
                                onClick={() => {
                                    setUserInfo();
                                    signOut(auth);
                                }}
                            >
                                <span className="menu-icon">{link.icon}</span>
                                <span className="menu-text">{link.title}</span>
                            </div>
                        </Link>
                    );
                }
                return (
                    <NavLink
                        to={link.url}
                        className="menu-item"
                        key={link.title}
                    >
                        <span className="menu-icon">{link.icon}</span>
                        <span className="menu-text">{link.title}</span>
                    </NavLink>
                );
            })}
        </SidebarStyles>
    );
};

export default Sidebar;
