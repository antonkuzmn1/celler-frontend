import '../styles/pages/UsersPage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";

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
    const {authorized} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<User[]>([]);

    const goToAccount = () => {
        navigate('/account');
    }

    const backToTableList = () => {
        navigate('/tables');
    }

    const sortTable = (column: keyof User, asc: boolean) => {
        const sortedUsers = [...users];
        sortedUsers.sort((a, b): number => {
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

    useEffect(() => {
        if (authorized) {
            dispatch(setUserLoading(true));
            axios.get(baseUrl + '/security').then((response) => {
                setName(response.data.name);
                axios.get<User[]>(baseUrl + '/security/user').then((response) => {
                    setUsers(response.data);
                    dispatch(setUserLoading(false));
                }).catch((_error) => {
                    dispatch(setUserLoading(false));
                });
            }).catch((_error) => {
                dispatch(setUserLoading(false));
            });
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
                    <p>{filteredTables.length.toString()} tables</p>
                    <input
                        type='search'
                        placeholder='Enter table name'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button>New</button>
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
                                            <button>Edit</button>
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
        </div>
    )
}
export default UsersPage;
