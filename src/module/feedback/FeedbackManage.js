import axios from "axios";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { debounce } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ActionDelete, ActionEdit, ActionView } from "~/components/action";
import { Button } from "~/components/button";
import { db } from "~/components/firebase/firebase-config";
import { Table } from "~/components/table";
import { useAuth } from "~/contexts/auth-context";
import DashboardHeading from "../dashboard/DashboardHeading";

const FeedbackManage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [posts, setPosts] = useState({});
    const [filter, setFilter] = useState("");
    const [lastDoc, setLastDoc] = useState();
    const [totalPost, setTotalPost] = useState();

    useEffect(() => {
        async function fetchData() {
            if (userInfo?.email === "admin@admin.com") {
                const colRef = collection(db, "feedbacks");
                onSnapshot(colRef, (snapshot) => {
                    setTotalPost(snapshot.size);
                });
                const newRef = query(
                    colRef,
                    where("fullname", ">=", filter),
                    where("fullname", "<=", filter + "utf8")
                );

                onSnapshot(newRef, (snapshot) => {
                    const results = [];
                    snapshot.forEach((doc) => {
                        results.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                    setFeedbacks(results);
                });
                if (filter === "") {
                    setFilter("");
                    const response = await axios(
                        "http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/feedbacks"
                    );
                    setFeedbacks(response.data.data);
                }
            } else {
                if (filter !== "") {
                    const colRef = collection(db, "feedbacks");
                    onSnapshot(colRef, (snapshot) => {
                        setTotalPost(snapshot.size);
                    });
                    const newRef = query(
                        colRef,
                        where("message", ">=", filter),
                        where("message", "<=", filter + "utf8"),
                        where("user.email", "==", userInfo?.email)
                    );

                    onSnapshot(newRef, (snapshot) => {
                        const results = [];
                        snapshot.forEach((doc) => {
                            results.push({
                                id: doc.id,
                                ...doc.data(),
                            });
                        });
                        setFeedbacks(results);
                        console.log(results);
                    });
                    return;
                }
                setFeedbacks("");
                const docRef = query(
                    collection(db, "feedbacks"),
                    where("email", "==", userInfo.email)
                );
                onSnapshot(docRef, (snapshot) => {
                    const results = [];
                    snapshot.forEach((doc) => {
                        results.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                    results.forEach(async (feedback) => {
                        const response = await axios(
                            `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/api/feedbacks/${feedback.id}`
                        );
                        setFeedbacks((prev) => {
                            const newFeedback = [...prev, response.data.data];
                            return newFeedback;
                        });
                    });
                });
            }
        }
        fetchData();
    }, [filter, userInfo.email]);

    const handleDeletePost = (feedbackId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await fetch(
                    `http://127.0.0.1:5001/monkey-bloging-17bb9/us-central1/app/feedbacks/delete/${feedbackId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: null,
                    }
                );

                Swal.fire(
                    "Deleted!",
                    "Your feedback has been deleted.",
                    "success"
                );
            }
        });
    };
    const handleChangeInput = debounce((e) => {
        setFilter(e.target.value);
    }, 500);

    return (
        <div>
            <DashboardHeading title="Feedbacks" desc="Manage your category">
                <Button kind="ghost" height="60px" to="/feedback">
                    Create new feedback
                </Button>
            </DashboardHeading>
            <div className="flex justify-end mb-10">
                <input
                    onChange={handleChangeInput}
                    type="text"
                    placeholder="Search feedback..."
                    className="px-5 py-4 border border-gray-300 rounded-lg outline-none"
                />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>email</th>
                        <th>message</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.length > 0 &&
                        feedbacks.map((feedback) => (
                            <tr key={feedback.id}>
                                <td>{feedback?.id}</td>
                                <td>{feedback?.fullname}</td>
                                <td>{feedback?.email.slice(0, 5) + "..."}</td>
                                <td className="max-w-[300px] w-full  whitespace-normal">
                                    <div className="inline-flex flex-col w-full">
                                        <p className="w-full whitespace-pre-wrap">
                                            {feedback?.message}
                                        </p>

                                        <p className="w-full text-gray-500 opacity-90">
                                            {new Date(
                                                feedback?.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center text-gray-500 gap-x-3">
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-feedback?id=${feedback.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                            onClick={() =>
                                                handleDeletePost(feedback.id)
                                            }
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};
export default FeedbackManage;
