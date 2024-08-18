import '../styles/pages/GroupsPage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import Dialog from "../components/Dialog.tsx";
import DialogConfirm from "../components/DialogConfirm.tsx";
import {User} from "./UsersPage.tsx";
import DialogUserList from "../components/DialogUserList.tsx";

export interface Group {
    id: number;
    created: string;
    updated: string;
    name: string;
    title: string;
}

const GroupsPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, loading} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [tables, setTables] = useState<Group[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<Group[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogDataId, setDialogDataId] = useState<number>(0);
    const [dialogDataCreated, setDialogDataCreated] = useState<string>('');
    const [dialogDataUpdated, setDialogDataUpdated] = useState<string>('');
    const [dialogDataName, setDialogDataName] = useState<string>('');
    const [dialogDataTitle, setDialogDataTitle] = useState<string>('');
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);
    const [dialogGroupUserOpen, setDialogGroupUserOpen] = useState<boolean>(false);

    const goToAccount = () => {
        navigate('/account');
    }

    const backToTableList = () => {
        navigate('/tables');
    }

    const openDialog = (id: number = 0) => {
        setDialogOpen(true);
        dispatch(setUserLoading(true));
        if (id === 0) {
            setDialogDataId(0);
            setDialogDataCreated('');
            setDialogDataUpdated('');
            setDialogDataName('');
            setDialogDataTitle('');
            dispatch(setUserLoading(false));
        } else {
            axios.get<User>(baseUrl + '/security/group', {
                params: {id}
            }).then(response => {
                console.log(response)
                setDialogDataId(response.data.id);
                setDialogDataCreated(response.data.created);
                setDialogDataUpdated(response.data.updated);
                setDialogDataName(response.data.name);
                setDialogDataTitle(response.data.title);
                dispatch(setUserLoading(false));
            });
        }
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    const deleteGroup = () => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/security/group', {
            data: {id: dialogDataId}
        }).then(response => {
            console.log(response);
            closeDialog();
            getTable();
        }).finally(() => {
            dispatch(setUserLoading(false));
            dialogConfirmClose();
        });
    }

    const confirmGroup = () => {
        const id = dialogDataId;
        const name = dialogDataName;
        const title = dialogDataTitle;

        dispatch(setUserLoading(true));
        if (id === 0) {
            axios.post(baseUrl + '/security/group', {
                name, title
            }).then(response => {
                console.log(response);
                closeDialog();
                getTable();
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        } else {
            axios.put(baseUrl + '/security/group', {
                id, name, title
            }).then(response => {
                console.log(response);
                closeDialog();
                getTable();
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        }
    }

    const dialogConfirmShow = () => {
        setDialogConfirmOpen(true);
    }

    const dialogConfirmClose = () => {
        setDialogConfirmOpen(false);
    }

    const dialogUsersShow = (id: number) => {
        setDialogGroupUserOpen(true);
        setDialogDataId(id);
    }

    const dialogUsersClose = () => {
        setDialogGroupUserOpen(false);
    }

    const sortTable = (column: keyof Group, asc: boolean) => {
        const sorted = [...tables];
        sorted.sort((a, b): number => {
            if (a[column] > b[column]) return asc ? 1 : -1;
            if (a[column] < b[column]) return asc ? -1 : 1;
            return 0;
        });
        setTables(sorted);
        setFilteredTables(sorted.filter((table: Group) => {
            return (
                table.name.includes(search) ||
                table.title.includes(search)
            );
        }));
    };

    const getTable = () => {
        dispatch(setUserLoading(true));
        axios.get(baseUrl + '/security').then((response) => {
            setName(response.data.name);
            axios.get<Group[]>(baseUrl + '/security/group').then((response) => {
                setTables(response.data);
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        }).catch((_error) => {
            dispatch(setUserLoading(false));
        });
    }

    useEffect(() => {
        if (authorized) {
            getTable();
        }
    }, [authorized]);

    useEffect(() => {
        setFilteredTables(tables.filter((table: Group) => {
            return (
                table.name.includes(search) ||
                table.title.includes(search)
            );
        }));
    }, [tables, search]);

    return (
        <div className='GroupsPage'>
            <div className='topbar'>
                <div className='left'>
                    <button onClick={backToTableList}>Back to table list</button>
                </div>
                <div className='center'/>
                <div className='right'>
                    <button onClick={goToAccount}>{name}</button>
                </div>
                <div className='title'>
                    <p>{filteredTables.length.toString()} tables</p>
                    <input
                        type='search'
                        placeholder='Enter group name'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={() => openDialog(0)}
                    >New
                    </button>
                </div>
            </div>
            <div className='frame'>
            <div className='content'>
                    {filteredTables.length > 0
                        ? <table>
                            <thead>
                            <tr>
                                <th className='action'>Settings</th>
                                <th className='small'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('id', true)}>A</button>
                                        <button onClick={() => sortTable('id', false)}>D</button>
                                    </div>
                                    ID
                                </th>
                                <th className='large'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('name', true)}>A</button>
                                        <button onClick={() => sortTable('name', false)}>D</button>
                                    </div>
                                    Name
                                </th>
                                <th className='large'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('title', true)}>A</button>
                                        <button onClick={() => sortTable('title', false)}>D</button>
                                    </div>
                                    Title
                                </th>
                                <th className='medium'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('created', true)}>A</button>
                                        <button onClick={() => sortTable('created', false)}>D</button>
                                    </div>
                                    Created
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTables.map((table, index) => {
                                const created = new Date(table.created);
                                return (
                                    <tr key={index}>
                                        <td className='action'>
                                            <button
                                                onClick={() => openDialog(table.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => dialogUsersShow(table.id)}
                                            >
                                                Users
                                            </button>
                                        </td>
                                        <td className='small'>{table.id}</td>
                                        <td className='large'>{table.name}</td>
                                        <td className='large'>{table.title}</td>
                                        <td className='medium'>{created.toDateString()}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        : <></>
                    }
                </div>
            </div>
            {dialogOpen
                ? <Dialog
                    title={dialogDataId > 0 ? 'Edit Group' : 'New Group'}
                    close={closeDialog}
                    delete={dialogDataId > 0 ? dialogConfirmShow : undefined}
                    confirm={confirmGroup}
                >{!loading
                    ? (<>
                        {dialogDataId > 0 ? <>
                            <div className='field'>
                                <div className='left'>
                                    <p>Created</p>
                                </div>
                                <div className='right'>
                                    <p>{(new Date(dialogDataCreated)).toDateString()}</p>
                                </div>
                            </div>
                            <div className='field'>
                                <div className='left'>
                                    <p>Updated</p>
                                </div>
                                <div className='right'>
                                    <p>{(new Date(dialogDataUpdated)).toDateString()}</p>
                                </div>
                            </div>
                        </> : <></>}
                        <div className='field'>
                            <div className='left'>
                                <p>Name</p>
                            </div>
                            <div className='right'>
                                <input
                                    placeholder='Required'
                                    type='text'
                                    value={dialogDataName}
                                    onChange={(e) => setDialogDataName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <div className='left'>
                                <p>Title</p>
                            </div>
                            <div className='right'>
                                <input
                                    placeholder='Required'
                                    type='text'
                                    value={dialogDataTitle}
                                    onChange={(e) => setDialogDataTitle(e.target.value)}
                                />
                            </div>
                        </div>
                    </>)
                    : <></>}
                </Dialog>
                : <></>}
            {dialogGroupUserOpen
                ? <DialogUserList
                    cancel={dialogUsersClose}
                    id={dialogDataId}
                />
                : <></>}
            {dialogConfirmOpen
                ? <DialogConfirm
                    text={'Are you sure?'}
                    cancel={dialogConfirmClose}
                    confirm={deleteGroup}
                />
                : <></>}
        </div>
    )
}
export default GroupsPage;
