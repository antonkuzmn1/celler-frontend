import '../styles/pages/AccountPage.scss';
import React, {useEffect, useState} from "react";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserAdmin, setUserAuthorized, setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import Cookies from "js-cookie";
import {baseUrl} from "../utils/baseUrl.ts";
import {useNavigate} from "react-router-dom";

const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, admin} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const backToTableList = () => {
        navigate('/tables');
    }

    const logout = async (event: any) => {
        event.preventDefault();
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setUserAuthorized(false));
        dispatch(setUserAdmin(false));
    }

    useEffect(() => {
        if (authorized) {
            dispatch(setUserLoading(true));
            axios.get(baseUrl + '/security').then((response) => {
                setName(response.data.name);
                setTitle(response.data.title);
                setUsername(response.data.username);
                dispatch(setUserLoading(false));
            });
        }
    }, [authorized]);

    return (
        <div className="AccountPage">
            <div className='topbar'>
                <div className='left'>
                    <button onClick={backToTableList}>Back to table list</button>
                </div>
                <div className='center'/>
                <div className='right'>
                    <p>{name}</p>
                </div>
                <div className='title'>
                    <h1>Account</h1>
                </div>
            </div>
            <div className='frame'>
                <div className='content'>
                    <div className='form'>
                        <div className='title'>
                            <p>Name</p>
                        </div>
                        <div className='field'>
                            <p>{name}</p>
                        </div>
                    </div>
                    <div className='form'>
                        <div className='title'>
                            <p>Title</p>
                        </div>
                        <div className='field'>
                            <p>{title}</p>
                        </div>
                    </div>
                    <div className='form'>
                        <div className='title'>
                            <p>Username</p>
                        </div>
                        <div className='field'>
                            <p>{username}</p>
                        </div>
                    </div>
                    {admin
                        ? <>
                            <div className='form'>
                                <div className='title'>
                                    <p>Old password</p>
                                </div>
                                <div className='field'>
                                    <input
                                        type='password'
                                        placeholder="Enter old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='form'>
                                <div className='title'>
                                    <p>New password</p>
                                </div>
                                <div className='field'>
                                    <input
                                        type='password'
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='form'>
                                <div className='title'>
                                    <p>Repeat password</p>
                                </div>
                                <div className='field'>
                                    <input
                                        type='password'
                                        placeholder="Reenter new password"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                        : <></>
                    }
                    <div className='form'>
                        <button
                            className='submit'
                            type="submit"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AccountPage;
