import '../styles/pages/TablesPage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {setUserLoading} from "../slices/userSlice.ts";
import Dialog from "../components/Dialog.tsx";
import DialogConfirm from "../components/DialogConfirm.tsx";
import {User} from "./UsersPage.tsx";
import DialogTableGroupList from "../components/DialogTableGroupList.tsx";

export interface Table {
    id: number;
    created: string;
    name: string;
    title: string;
    tableGroups: any[];
    tableGroupsCreate: any[];
    tableGroupsDelete: any[];
}

const TablesPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, admin, loading} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [tables, setTables] = useState<Table[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogDataId, setDialogDataId] = useState<number>(0);
    const [dialogDataCreated, setDialogDataCreated] = useState<string>('');
    const [dialogDataUpdated, setDialogDataUpdated] = useState<string>('');
    const [dialogDataName, setDialogDataName] = useState<string>('');
    const [dialogDataTitle, setDialogDataTitle] = useState<string>('');
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);
    const [dialogTableGroupOpen, setDialogTableGroupOpen] = useState<boolean>(false);

    const [menuDropdownActive, setMenuDropdownActive] = useState<boolean>(false)

    const toggleDropdown = () => {
        setMenuDropdownActive(!menuDropdownActive);
    }

    const goToAccount = () => {
        navigate('/account');
    }

    const goToUsers = () => {
        navigate('/users');
    }

    const goToGroups = () => {
        navigate('/groups');
    }

    const goToLogs = () => {
        navigate('/logs');
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
            axios.get<User>(baseUrl + '/table', {
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

    const deleteUser = () => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table', {
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
        const name = dialogDataName;
        const title = dialogDataTitle;

        dispatch(setUserLoading(true));
        if (id === 0) {
            axios.post(baseUrl + '/table', {
                name, title
            }).then(response => {
                console.log(response);
                closeDialog();
                getTable();
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        } else {
            axios.put(baseUrl + '/table', {
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

    const dialogGroupsShow = (id: number) => {
        setDialogTableGroupOpen(true);
        setDialogDataId(id);
    }

    const dialogGroupsClose = () => {
        setDialogTableGroupOpen(false);
    }

    const sortTable = (column: keyof Table, asc: boolean) => {
        const sorted = [...tables];
        sorted.sort((a, b): number => {
            if (a[column] > b[column]) return asc ? 1 : -1;
            if (a[column] < b[column]) return asc ? -1 : 1;
            return 0;
        });
        setTables(sorted);
        setFilteredTables(sorted.filter((table: Table) => {
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
            axios.get<Table[]>(baseUrl + '/table').then((response) => {
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
        setFilteredTables(tables.filter((table: Table) => {
            return (
                table.name.includes(search) ||
                table.title.includes(search)
            );
        }));
    }, [tables, search]);

    return (
        <div className="TablesPage">
            <div className='topbar'>
                <div className='left'>
                    {admin
                        ? <button onClick={toggleDropdown}>Menu</button>
                        : <></>
                    }
                    {menuDropdownActive
                        ? <div className='dropdown'>
                            <button onClick={goToUsers}>Users</button>
                            <button onClick={goToGroups}>Groups</button>
                            <button onClick={goToLogs}>Logs</button>
                        </div>
                        : <></>
                    }
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
                                                onClick={() => dialogGroupsShow(table.id)}
                                            >
                                                Groups
                                            </button>
                                            <button>Columns</button>
                                            <button>Open</button>
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
                    title={dialogDataId > 0 ? 'Edit Table' : 'New Table'}
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
            {dialogTableGroupOpen
                ? <DialogTableGroupList
                    cancel={dialogGroupsClose}
                    id={dialogDataId}
                />
                : <></>}
        </div>
    )
}
export default TablesPage;
