import '../styles/components/DialogGroupList.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {User} from "../pages/UsersPage.tsx";
import {Group} from "../pages/GroupsPage.tsx";
import {useDispatch} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";

interface DialogGroupListProps {
    cancel: () => void;
    id: number;
}

const DialogGroupList: React.FC<DialogGroupListProps> = (props: DialogGroupListProps) => {
    const dispatch = useDispatch();

    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);

    const getUser = () => {
        axios.get<User>(baseUrl + '/security/user', {
            params: {id: props.id}
        }).then(response => {
            setUserGroups(response.data.userGroups);
        });
    }

    const getGroups = () => {
        axios.get<Group[]>(baseUrl + '/security/group', {}).then(response => {
            setGroups(response.data);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const addGroup = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.post(baseUrl + '/security/user/group', {
            groupId: groupId,
            userId: props.id,
        }).then(_response => {
            getUser();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const removeGroup = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/security/user/group', {
            data: {
                userId: props.id,
                groupId: groupId,
            }
        }).then(response => {
            console.log(response);
            getUser();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    useEffect(() => {
        dispatch(setUserLoading(true));
        getUser();
        getGroups();
    }, []);

    return (
        <div className='DialogGroupList' onClick={props.cancel}>
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
                        {userGroups.map((group: any) => {
                            return (
                                <div key={group.groupId} className='row'>
                                    <div className={'left'}>
                                        <p>{group.groupName}</p>
                                    </div>
                                    <div className={'right'}>
                                        <button
                                            onClick={() => removeGroup(group.groupId)}
                                        >
                                            remove
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={'right'}>
                        {groups.map((group: any) => {
                            return (
                                <div key={group.id} className='row'>
                                    <div className={'left'}>
                                        <p>{group.name}</p>
                                    </div>
                                    <div className={'right'}>
                                        <button
                                            onClick={() => addGroup(group.id)}
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
export default DialogGroupList
