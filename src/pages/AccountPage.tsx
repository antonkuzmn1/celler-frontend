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
    const [created, setCreated] = useState('');
    const [updated, setUpdated] = useState('');

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
                setCreated(response.data.created);
                setUpdated(response.data.updated);
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
                    <div className='form'>
                        <div className='title'>
                            <p>Created at</p>
                        </div>
                        <div className='field'>
                            <p>{created}</p>
                        </div>
                    </div>
                    <div className='form'>
                        <div className='title'>
                            <p>Updated at</p>
                        </div>
                        <div className='field'>
                            <p>{updated}</p>
                        </div>
                    </div>
                    <div className='form'>
                        <div className='title'>
                            <p>Admin</p>
                        </div>
                        <div className='field'>
                            <p>{admin ? 'True' : 'False'}</p>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AccountPage;
