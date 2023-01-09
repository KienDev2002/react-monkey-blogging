import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../firebase/firebase-config";

const AuthorBox = ({ userId = "" }) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        async function fetchData() {
            const response = await axios(
                `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/users/${userId}`
            );

            setUser(response.data.data);
        }
        fetchData();
    }, [userId]);
    if (!userId) return null;
    return (
        <div className="author">
            <div className="border-r border-r-gray-300 author-image">
                <img src={user?.avatar} alt="" />
            </div>
            <div className="author-content">
                <h3 className="author-name">Author: {user?.fullname}</h3>
                <p className="author-desc">{user?.description || ""}</p>
            </div>
        </div>
    );
};

export default AuthorBox;
