import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "~/components/firebase/firebase-config";

const HomePage = () => {
    const handleSignOut = () => {
        signOut(auth);
    };
    return (
        <div>
            <button onClick={handleSignOut}>Sign out</button>
        </div>
    );
};

export default HomePage;
