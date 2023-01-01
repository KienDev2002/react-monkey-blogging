import { collection, onSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionDelete, ActionEdit, ActionView } from "~/components/action";
import { db } from "~/components/firebase/firebase-config";
import { LabelStatus } from "~/components/label";
import { Table } from "~/components/table";
import { userRole, userStatus } from "~/utils/constants";

const UserTable = () => {
    const [userList, setUserList] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const colRef = collection(db, "users");
        onSnapshot(colRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUserList(results);
        });
    }, []);
    const renderLabelStatus = (status) => {
        switch (status) {
            case userStatus.ACTIVE:
                return <LabelStatus type="success">Active</LabelStatus>;
            case userStatus.PENDING:
                return <LabelStatus type="warning">Pending</LabelStatus>;
            case userStatus.BAN:
                return <LabelStatus type="danger">Rejected</LabelStatus>;
            default:
                break;
        }
    };
    const renderRole = (role) => {
        switch (role) {
            case userRole.ADMIN:
                return "Admin";
            case userRole.MOD:
                return "Moderator";
            case userRole.USER:
                return "User";
            default:
                break;
        }
    };
    if (!userList) return;
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Info</th>
                        <th>Username</th>
                        <th>Email address</th>
                        <th>Status</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 &&
                        userList.map((user) => (
                            <tr key={user.id}>
                                <td title={user.id}>
                                    {user?.id.slice(0, 5) + "..."}
                                </td>
                                <td className="whitespace-nowrap">
                                    <div className="flex items-center gap-x-3">
                                        <img
                                            src={user?.avatar}
                                            alt=""
                                            className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3>{user?.fullname}</h3>
                                            <time className="text-xl text-gray-300">
                                                {new Date(
                                                    user?.createdAt?.seconds *
                                                        1000
                                                ).toLocaleDateString("vi-VI")}
                                            </time>
                                        </div>
                                    </div>
                                </td>
                                <td>{user?.username}</td>
                                <td title={user.email}>
                                    {user?.email.slice(0, 5) + "..."}
                                </td>
                                <td>
                                    {renderLabelStatus(Number(user.status))}
                                </td>
                                <td>{renderRole(Number(user.role))}</td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <ActionEdit
                                            onClick={() =>
                                                navigate(
                                                    `/manage/update-user?id=${user.id}`
                                                )
                                            }
                                        ></ActionEdit>
                                        <ActionDelete
                                        // onClick={() =>
                                        //     handleDeleteCategory(
                                        //         category.id
                                        //     )
                                        // }
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

export default UserTable;
