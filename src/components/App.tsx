import '../styles/components/App.scss'
import React from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import AccountPage from "../pages/AccountPage.tsx";
import TablesPage from "../pages/TablesPage.tsx";
import UsersPage from "../pages/UsersPage.tsx";
import LogsPage from "../pages/LogsPage.tsx";
import useDeviceSize from "../hooks/useDeviceSize.ts";
import {useSelector} from "react-redux";
import {RootState} from "../utils/store.ts";
import {DeviceSize} from "../slices/deviceSlice.ts";
import TablePage from "../pages/TablePage.tsx";
import GroupsPage from "../pages/GroupsPage.tsx";
import {useUserState} from "../hooks/useUserState.ts";
import Loading from "./Loading.tsx";
import Auth from "./Auth.tsx";
import NotSupported from "./NotSupported.tsx";

const router = createBrowserRouter([
    {path: "*", element: <Navigate to="/account"/>},
    {path: "/account", element: <AccountPage/>},
    {path: "/tables", element: <TablesPage/>},
    {path: "/tables/:id", element: <TablePage/>},
    {path: "/users", element: <UsersPage/>},
    {path: "/groups", element: <GroupsPage/>},
    {path: "/logs", element: <LogsPage/>},
]);

const App: React.FC = () => {
    useUserState();
    useDeviceSize();
    const deviceSize = useSelector((state: RootState) => state.device.size);
    const {loading, authorized} = useSelector((state: RootState) => state.user);

    return (
        <div className='App'>
            {deviceSize !== DeviceSize.Large
                ? <NotSupported/>
                : <RouterProvider router={router}/>
            }
            {authorized ? <></> : <Auth/>}
            {loading ? <Loading/> : <></>}
        </div>
    )
}

export default App
