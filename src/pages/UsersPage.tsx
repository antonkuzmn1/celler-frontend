import '../styles/pages/UsersPage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import Dialog from "../components/Dialog.tsx";
import DialogConfirm from "../components/DialogConfirm.tsx";

export interface User {
    id: number;
    created: string;
    updated: string;
    name: string;
    title: string;
    username: string;
    password: string;
    admin: boolean;
}

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, loading} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<User[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogDataId, setDialogDataId] = useState<number>(0);
    const [dialogDataCreated, setDialogDataCreated] = useState<string>('');
    const [dialogDataUpdated, setDialogDataUpdated] = useState<string>('');
    const [dialogDataName, setDialogDataName] = useState<string>('');
    const [dialogDataTitle, setDialogDataTitle] = useState<string>('');
    const [dialogDataUsername, setDialogDataUsername] = useState<string>('');
    const [dialogDataAdmin, setDialogDataAdmin] = useState<boolean>(false);
    const [dialogDataPassword1, setDialogDataPassword1] = useState<string>('');
    const [dialogDataPassword2, setDialogDataPassword2] = useState<string>('');
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);


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
            setDialogDataUsername('');
            setDialogDataAdmin(false)
            setDialogDataPassword1('');
            setDialogDataPassword2('');
            dispatch(setUserLoading(false));
        } else {
            axios.get<User>(baseUrl + '/security/user', {
                params: {id}
            }).then(response => {
                setDialogDataId(response.data.id);
                setDialogDataCreated(response.data.created);
                setDialogDataUpdated(response.data.updated);
                setDialogDataName(response.data.name);
                setDialogDataTitle(response.data.title);
                setDialogDataUsername(response.data.username);
                setDialogDataAdmin(response.data.admin)
                setDialogDataPassword1('');
                setDialogDataPassword2('');
                dispatch(setUserLoading(false));
            });
        }
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    const deleteUser = () => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/security/user', {
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

    const confirmUser = () => {
        const id = dialogDataId;
        const admin = dialogDataAdmin;
        const username = dialogDataUsername;
        const password = dialogDataPassword1;
        const password2 = dialogDataPassword2;
        const name = dialogDataName;
        const title = dialogDataTitle;

        if ((password || password2) && password !== password2) {
            return;
        }

        dispatch(setUserLoading(true));
        if (id === 0) {
            axios.post(baseUrl + '/security/user', {
                admin, username, password, name, title
            }).then(response => {
                console.log(response);
                closeDialog();
                getTable();
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        } else {
            axios.put(baseUrl + '/security/user', {
                id, admin, username, password, name, title
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

    const sortTable = (column: keyof User, asc: boolean) => {
        const sortedUsers = [...users];
        sortedUsers.sort((a, b): number => {
            ``
            if (a[column] > b[column]) return asc ? 1 : -1;
            if (a[column] < b[column]) return asc ? -1 : 1;
            return 0;
        });
        setUsers(sortedUsers);
        setFilteredTables(sortedUsers.filter((table: User) => {
            return (
                table.username.includes(search) ||
                table.title.includes(search) ||
                table.name.includes(search)
            );
        }));
    };

    const getTable = () => {
        dispatch(setUserLoading(true));
        axios.get(baseUrl + '/security').then((response) => {
            setName(response.data.name);
            axios.get<User[]>(baseUrl + '/security/user').then((response) => {
                setUsers(response.data);
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
        setFilteredTables(users.filter((table: User) => {
            return (
                table.username.includes(search) ||
                table.title.includes(search) ||
                table.name.includes(search)
            );
        }));
    }, [users, search]);

    return (
        <div className="UsersPage">
            <div className='topbar'>
                <div className='left'>
                    <button onClick={backToTableList}>Back to table list</button>
                </div>
                <div className='center'/>
                <div className='right'>
                    <button onClick={goToAccount}>{name}</button>
                </div>
                <div className='title'>
                    <p>{filteredTables.length.toString()} rows</p>
                    <input
                        type='search'
                        placeholder='Enter table name'
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
                                <th className='medium'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('username', true)}>A</button>
                                        <button onClick={() => sortTable('username', false)}>D</button>
                                    </div>
                                    Username
                                </th>
                                <th className='small'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('admin', true)}>A</button>
                                        <button onClick={() => sortTable('admin', false)}>D</button>
                                    </div>
                                    Admin
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
                                                onClick={() => {
                                                }}
                                            >
                                                Groups
                                            </button>
                                        </td>
                                        <td className='small'>{table.id}</td>
                                        <td className='medium'>{table.username}</td>
                                        <td className='small'>{table.admin}</td>
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
                    title={dialogDataId > 0 ? 'Edit User' : 'New User'}
                    close={closeDialog}
                    delete={dialogDataId > 0 ? dialogConfirmShow : undefined}
                    confirm={confirmUser}
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
                                <p>Full Name</p>
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
                        <div className='field'>
                            <div className='left'>
                                <p>Username</p>
                            </div>
                            <div className='right'>
                                <input
                                    placeholder='Required'
                                    type='text'
                                    value={dialogDataUsername}
                                    onChange={(e) => setDialogDataUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <div className='left'>
                                <p>Admin</p>
                            </div>
                            <div className='right'>
                                <input
                                    placeholder='Required'
                                    type='checkbox'
                                    checked={dialogDataAdmin}
                                    onChange={(e) => setDialogDataAdmin(e.target.checked)}
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <div className='left'>
                                <p>Password</p>
                            </div>
                            <div className='right'>
                                <input
                                    placeholder='Required'
                                    type='password'
                                    value={dialogDataPassword1}
                                    onChange={(e) => setDialogDataPassword1(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='field'>
                            <div className='left'>
                                <p>Retype password</p>
                            </div>
                            <div className='right'>
                                <input
                                    placeholder='Required'
                                    type='password'
                                    value={dialogDataPassword2}
                                    onChange={(e) => setDialogDataPassword2(e.target.value)}
                                />
                            </div>
                        </div>
                    </>)
                    : <></>}
                </Dialog>
                : <></>}
            {dialogConfirmOpen
                ? <DialogConfirm
                    text={'Are you sure?'}
                    cancel={dialogConfirmClose}
                    confirm={deleteUser}
                />
                : <></>}
        </div>
    )
}
export default UsersPage;
