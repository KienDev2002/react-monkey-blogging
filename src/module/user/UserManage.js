import React from "react";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import UserTable from "./UserTable";

const UserManage = () => {
    return (
        <div>
            <DashboardHeading
                title="Users"
                desc="Manage your user"
            ></DashboardHeading>
            <UserTable></UserTable>
        </div>
    );
};

export default UserManage;
