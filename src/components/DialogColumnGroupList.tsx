import '../styles/components/DialogColumnGroupList.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {Group} from "../pages/GroupsPage.tsx";
import {useDispatch} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import {useParams} from "react-router-dom";
import {Column} from "../pages/ColumnsPage.tsx";

interface DialogColumnGroupListProps {
    cancel: () => void;
    id: number;
}

const DialogColumnGroupList: React.FC<DialogColumnGroupListProps> = (props: DialogColumnGroupListProps) => {
    const table = useParams<{ id: string }>();
    const dispatch = useDispatch();

    const [columnGroups, setColumnGroups] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);

    const getColumn = () => {
        axios.get<Column>(baseUrl + '/table/column', {
            params: {id: props.id, tableId: table.id}
        }).then(response => {
            setColumnGroups(response.data.columnGroups);
        });
    }

    const getGroups = () => {
        axios.get<Group[]>(baseUrl + '/security/group', {}).then(response => {
            setGroups(response.data);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const addGroup = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.post(baseUrl + '/table/column/group', {
            groupId: groupId,
            columnId: props.id,
        }).then(_response => {
            getColumn();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const removeGroup = (groupId: number) => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table/column/group', {
            data: {
                columnId: props.id,
                groupId: groupId,
            }
        }).then(response => {
            console.log(response);
            getColumn();
            getGroups();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    useEffect(() => {
        dispatch(setUserLoading(true));
        getColumn();
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
                        <p>Column Groups</p>
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
                        {columnGroups.map((columnGroup: any) => {
                            console.log(columnGroup.group);
                            return (
                                <div key={columnGroup.group.id} className='row'>
                                    <div className={'left'}>
                                        <p>{columnGroup.group.name}</p>
                                    </div>
                                    <div className={'right'}>
                                        <button
                                            onClick={() => removeGroup(columnGroup.group.id)}
                                        >
                                            remove
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={'right'}>
                        {groups.map((group: any, index) => {
                            return (
                                <div key={index} className='row'>
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
export default DialogColumnGroupList
