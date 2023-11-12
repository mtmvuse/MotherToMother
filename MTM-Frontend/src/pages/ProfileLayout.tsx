import { Outlet } from "react-router-dom";

export const ProfileLayout = () => {
    return (
        <div>
            <div>
                    <Outlet />
            </div>
        </div>
    );
};
