import { async } from "@firebase/util";
import axios from "axios";
import {
    collection,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { debounce } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "~/components/button";
import { db } from "~/components/firebase/firebase-config";
import { useAuth } from "~/contexts/auth-context";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import { userRole } from "~/utils/constants";
import UserTable from "./UserTable";

const USER_PER_PAGE = 2;

const UserManage = () => {
    const [filter, setFilter] = useState("");
    const [userList, setUserList] = useState();
    const [lastDoc, setLastDoc] = useState();
    const [totalUser, setTotalUser] = useState();

    const handleFilterInput = debounce((e) => {
        setFilter(e.target.value);
    }, 500);

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "users");
            onSnapshot(colRef, (snapshot) => {
                setTotalUser(snapshot.size);
            });
            const newRef = query(
                colRef,
                where("username", ">=", filter),
                where("username", "<=", filter + "utf8")
            );

            onSnapshot(newRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setUserList(results);
            });
            if (filter === "") {
                setFilter("");
                const response = await axios.get(
                    "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/users"
                );
                setUserList(response.data.data);
            }
        }
        fetchData();
    }, [filter]);

    // const handleLoadmoreUser = async () => {
    //     const nextRef = query(
    //         collection(db, "users"),
    //         startAfter(lastDoc || 0),
    //         limit(USER_PER_PAGE)
    //     );
    //     onSnapshot(nextRef, (snapshot) => {
    //         const results = [];
    //         snapshot.forEach((doc) => {
    //             results.push({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             });
    //         });
    //         setUserList([...userList, ...results]);
    //     });
    //     const documentSnapshots = await getDocs(nextRef);

    //     // Get the last visible document
    //     const lastVisible =
    //         documentSnapshots.docs[documentSnapshots.docs.length - 1];
    //     setLastDoc(lastVisible);
    // };

    const { userInfo } = useAuth();
    if (userInfo?.email !== "admin@admin.com") return null;

    return (
        <div>
            <div className="flex justify-between">
                <DashboardHeading
                    title="Users"
                    desc="Manage your user"
                ></DashboardHeading>
                <div className="flex flex-col gap-y-20">
                    <Button kind="ghost" to="/manage/add-user">
                        Create new user
                    </Button>
                    <input
                        onChange={handleFilterInput}
                        type="text"
                        placeholder="Search username..."
                        className="px-5 py-4 my-10 border border-gray-300 rounded-lg outline-none"
                    />
                </div>
            </div>
            <UserTable totalUser={totalUser} userList={userList}></UserTable>
        </div>
    );
};

export default UserManage;
