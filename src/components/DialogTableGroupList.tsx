import '../styles/components/DialogTableGroupList.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {Group} from "../pages/GroupsPage.tsx";
import {useDispatch} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import {Table} from "../pages/TablesPage.tsx";

// import {Table} from "../pages/TablesPage.tsx";

interface DialogTableGroupListProps {
    cancel: () => void;
    id: number;
}

const DialogTableGroupList: React.FC<DialogTableGroupListProps> = (props: DialogTableGroupListProps) => {
    const dispatch = useDispatch();
    const [groups, setGroups] = useState<any[]>([]);
    const [tableGroups, setTableGroups] = useState<any[]>([]);
    const [tableGroupsCreate, setTableGroupsCreate] = useState<any[]>([]);
    const [tableGroupsDelete, setTableGroupsDelete] = useState<any[]>([]);

    const getGroups = () => {
        axios.get<Group[]>(baseUrl + '/security/group', {}).then(response => {
            setGroups(response.data);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const getTableGroups = () => {
        axios.get<Table>(baseUrl + '/table', {
            params: {id: props.id}
        }).then(response => {
            console.log(response.data);
            setTableGroups(response.data.tableGroups);
            setTableGroupsCreate(response.data.tableGroupsCreate);
            setTableGroupsDelete(response.data.tableGroupsDelete);
        });
    }

    // const getTableGroupsCreate = () => {
    //     axios.get<Table>(baseUrl + '/tableCreate', {
    //         params: {id: props.id}
    //     }).then(response => {
    //         console.log(response.data);
    //         setTableGroupsCreate(response.data.tableGroupsCreate);
    //     });
    // }
    //
    // const getTableGroupsDelete = () => {
    //     axios.get<Table>(baseUrl + '/tableDelete', {
    //         params: {id: props.id}
    //     }).then(response => {
    //         console.log(response.data);
    //         setTableGroupsDelete(response.data.tableGroupsDelete);
    //     });
    // }

    const addTableGroup = (groupId: number) => {
        dispatch(setUserLoading(true));
        console.log(props.id, groupId);
        axios.post(baseUrl + '/table/group', {
            groupId: groupId,
            tableId: props.id,
        }).then(_response => {
            getTableGroups();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const addTableGroupCreate = (groupId: number) => {
        dispatch(setUserLoading(true));
        console.log(props.id, groupId);
        axios.post(baseUrl + '/table/groupCreate', {
            groupId: groupId,
            tableId: props.id,
        }).then(_response => {
            getTableGroups();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const addTableGroupDelete = (groupId: number) => {
        dispatch(setUserLoading(true));
        console.log(props.id, groupId);
        axios.post(baseUrl + '/table/groupDelete', {
            groupId: groupId,
            tableId: props.id,
        }).then(_response => {
            getTableGroups();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const removeTableGroup = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table/group', {
            data: {
                tableId: props.id,
                groupId: groupId,
            }
        }).then(response => {
            console.log(response);
            getTableGroups();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const removeTableGroupCreate = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table/groupCreate', {
            data: {
                tableId: props.id,
                groupId: groupId,
            }
        }).then(response => {
            console.log(response);
            getTableGroups();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const removeTableGroupDelete = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table/groupDelete', {
            data: {
                tableId: props.id,
                groupId: groupId,
            }
        }).then(response => {
            console.log(response);
            getTableGroups();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    useEffect(() => {
        dispatch(setUserLoading(true));
        getTableGroups();
        getGroups();
    }, []);

    return (
        <div className='DialogTableGroupList' onClick={props.cancel}>
            <div
                className='window'
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className='top'>
                    <div className='left'>
                        <p>Table Groups</p>
                    </div>
                    <div className='right'>
                        <button
                            onClick={props.cancel}
                        >Close
                        </button>
                    </div>
                </div>
                <div className='center'>
                    <div className={'field'}>
                        <p className={'title'}>Create</p>
                        <div className={'groups'}>
                            <div className={'left'}>
                                {tableGroups.map((tableGroup: any) => (
                                    <div key={tableGroup.groupId} className={'row'}>
                                        <div className={'left'}>
                                            <p>{tableGroup.group.name}</p>
                                        </div>
                                        <div className={'right'}>
                                            <button
                                                onClick={() => removeTableGroup(tableGroup.groupId)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={'right'}>
                                {groups.map((group: Group) => (
                                    <div key={group.id} className={'row'}>
                                        <div className={'left'}>
                                            <p>{group.name}</p>
                                        </div>
                                        <div className={'right'}>
                                            <button
                                                onClick={() => addTableGroup(group.id)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={'field'}>
                        <p className={'title'}>Edit</p>
                        <div className={'groups'}>
                            <div className={'left'}>
                                {tableGroupsCreate.map((tableGroup: any) => (
                                    <div key={tableGroup.groupId} className={'row'}>
                                        <div className={'left'}>
                                            <p>{tableGroup.group.name}</p>
                                        </div>
                                        <div className={'right'}>
                                            <button
                                                onClick={() => removeTableGroupCreate(tableGroup.groupId)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={'right'}>
                                {groups.map((group: Group) => (
                                    <div key={group.id} className={'row'}>
                                        <div className={'left'}>
                                            <p>{group.name}</p>
                                        </div>
                                        <div className={'right'}>
                                            <button
                                                onClick={() => addTableGroupCreate(group.id)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={'field'}>
                        <p className={'title'}>Delete</p>
                        <div className={'groups'}>
                            <div className={'left'}>
                                {tableGroupsDelete.map((tableGroup: any) => (
                                    <div key={tableGroup.groupId} className={'row'}>
                                        <div className={'left'}>
                                            <p>{tableGroup.group.name}</p>
                                        </div>
                                        <div className={'right'}>
                                            <button
                                                onClick={() => removeTableGroupDelete(tableGroup.groupId)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={'right'}>
                                {groups.map((group: Group) => (
                                    <div key={group.id} className={'row'}>
                                        <div className={'left'}>
                                            <p>{group.name}</p>
                                        </div>
                                        <div className={'right'}>
                                            <button
                                                onClick={() => addTableGroupDelete(group.id)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/*<div className={'left'}>*/}
                    {/*    {tableGroups.map((group: any) => {*/}
                    {/*        return (*/}
                    {/*            <div key={group.groupId} className='row'>*/}
                    {/*                <div className={'left'}>*/}
                    {/*                    <p>{group.groupName}</p>*/}
                    {/*                </div>*/}
                    {/*                <div className={'right'}>*/}
                    {/*                    <button*/}
                    {/*                        onClick={() => removeGroup(group.groupId)}*/}
                    {/*                    >*/}
                    {/*                        remove*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        )*/}
                    {/*    })}*/}
                    {/*</div>*/}
                </div>
                <div className='bottom'>
                    <button onClick={props.cancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default DialogTableGroupList
