import '../styles/pages/AccountPage.scss';
import React, {useState} from "react";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserAdmin, setUserAuthorized} from "../slices/userSlice.ts";
import axios from "axios";
import Cookies from "js-cookie";

const AccountPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const {authorized, admin} = useSelector((state: RootState) => state.user);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const logout = async (event: any) => {
        event.preventDefault();
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setUserAuthorized(false));
        dispatch(setUserAdmin(false));
    }

    return (
        <div className="AccountPage">
            <div className='topbar'>
                <div className='left'/>
                <div className='center'/>
                <div className='right'/>
                <div className='title'>
                    <h1>Account</h1>
                </div>
            </div>
            <div className='frame'>
                <div className='content'>
                    <div className='form'>
                        <div className='title'>
                            <p>Username</p>
                        </div>
                        <div className='field'>
                            <input
                                type='text'
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form'>
                        <div className='title'>
                            <p>Password</p>
                        </div>
                        <div className='field'>
                            <input
                                type='password'
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='form'>
                        <button
                            className='submit'
                            type="submit"
                            onClick={logout}
                        >
                            Logout
                        </button>
                        <button
                            className='submit'
                            type="submit"
                            onClick={logout}
                        >
                            Reset
                        </button>
                        <button
                            className='submit'
                            type="submit"
                            onClick={logout}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AccountPage;
