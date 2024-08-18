import '../styles/components/DialogUserList.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {User} from "../pages/UsersPage.tsx";
import {Group} from "../pages/GroupsPage.tsx";
import {useDispatch} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";

interface DialogUserListProps {
    cancel: () => void;
    id: number;
}

const DialogUserList: React.FC<DialogUserListProps> = (props: DialogUserListProps) => {
    const dispatch = useDispatch();

    const [groupUsers, setGroupUsers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const getGroup = () => {
        axios.get<User>(baseUrl + '/security/group', {
            params: {id: props.id}
        }).then(response => {
            setGroupUsers(response.data.userGroups);
        });
    }

    const getUsers = () => {
        axios.get<Group[]>(baseUrl + '/security/user', {}).then(response => {
            setUsers(response.data);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const addUser = (userId: number) => {
        dispatch(setUserLoading(true));
        axios.post(baseUrl + '/security/group/user', {
            userId: userId,
            groupId: props.id,
        }).then(_response => {
            getGroup();
            getUsers();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const removeUser = (userId: number) => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/security/group/user', {
            data: {
                groupId: props.id,
                userId: userId,
            }
        }).then(response => {
            console.log(response);
            getGroup();
            getUsers();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    useEffect(() => {
        dispatch(setUserLoading(true));
        getGroup();
        getUsers();
    }, []);

    return (
        <div className='DialogUserList' onClick={props.cancel}>
            <div
                className='window'
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className='top'>
                    <div className='left'>
                        <p>User Groups</p>
                    </div>
                    <div className='right'>
                        <button
                            onClick={props.cancel}
                        >Close
                        </button>
                    </div>
                </div>
                <div className='center'>
                    <div className={'left'}>
                        {groupUsers.map((user: any) => {
                            console.log(user);
                            return (
                                <div key={user.user.id} className='row'>
                                    <div className={'left'}>
                                        <p>{user.user.username}</p>
                                    </div>
                                    <div className={'right'}>
                                        <button
                                            onClick={() => removeUser(user.user.id)}
                                        >
                                            remove
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={'right'}>
                        {users.map((user: any) => {
                            return (
                                <div key={user.id} className='row'>
                                    <div className={'left'}>
                                        <p>{user.username}</p>
                                    </div>
                                    <div className={'right'}>
                                        <button
                                            onClick={() => addUser(user.id)}
                                        >
                                            add
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='bottom'>
                    <button onClick={props.cancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default DialogUserList
