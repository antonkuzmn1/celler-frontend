import axios from "axios";
import Cookies from "js-cookie";
import {AppDispatch} from "../utils/store.ts";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {baseUrl} from "../utils/baseUrl.ts";
import {setUserAdmin, setUserAuthorized, setUserLoading} from "../slices/userSlice.ts";

export const useUserState = () => {
    const dispatch: AppDispatch = useDispatch();

    const clear = () => {
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setUserAuthorized(false));
        dispatch(setUserAdmin(false));
    }

    const check = () => {
        dispatch(setUserLoading(true));
        const token = Cookies.get('token');

        if (token) {
            axios.get(baseUrl + '/security', {
                headers: {'Authorization': `Bearer ${token}`}
            }).then((response) => {
                Cookies.set('token', token, {expires: 1});
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                dispatch(setUserAuthorized(true));
                dispatch(setUserAdmin(!!response.data.admin));
                dispatch(setUserLoading(false));
            }).catch((_error) => {
                console.error(_error);
                clear();
                dispatch(setUserLoading(false));
            });
        } else {
            clear();
            dispatch(setUserLoading(false));
        }
    }

    useEffect(() => {
        check();

        const intervalId = setInterval(() => {
            console.log('check auth');
            check();
        }, 1000 * 60 * 10);

        return () => clearInterval(intervalId);
    }, [dispatch]);
}
