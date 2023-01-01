import React from "react";
import { Button } from "~/components/button";
import DashboardHeading from "~/module/dashboard/DashboardHeading";
import UserTable from "./UserTable";

const UserManage = () => {
    return (
        <div>
            <div className="flex justify-between">
                <DashboardHeading
                    title="Users"
                    desc="Manage your user"
                ></DashboardHeading>
                <Button kind="ghost" to="/manage/add-user">
                    Create new user
                </Button>
            </div>
            <UserTable></UserTable>
        </div>
    );
};

export default UserManage;
