import '../styles/components/Auth.scss';
import React, {useState} from "react";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserAdmin, setUserAuthorized, setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import Cookies from "js-cookie";
import {baseUrl} from "../utils/baseUrl.ts";

const AuthPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const {loading} = useSelector((state: RootState) => state.user);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async (event: any) => {
        event.preventDefault();
        if (!username || !password) {
            return;
        }
        dispatch(setUserLoading(true));
        try {
            const response = await axios.post(baseUrl + '/security', {
                username, password
            });
            const token = response.data.token;
            const admin = response.data.user.admin;
            Cookies.set('token', token, {expires: 0.5});
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            dispatch(setUserAuthorized(true));
            dispatch(setUserAdmin(!!admin));
            dispatch(setUserLoading(false));
        } catch (error) {
            Cookies.remove('token');
            delete axios.defaults.headers.common['Authorization'];
            dispatch(setUserAuthorized(false));
            dispatch(setUserAdmin(false));
            dispatch(setUserLoading(false));
        }
    };

    return (
        <div className="Auth">
            <div className='topbar'>
                <div className='left'/>
                <div className='center'/>
                <div className='right'/>
                <div className='title'>
                    <h1>Authorization</h1>
                </div>
            </div>
            <div className='frame'>
                <form onSubmit={login} className='content'>
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
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AuthPage;
