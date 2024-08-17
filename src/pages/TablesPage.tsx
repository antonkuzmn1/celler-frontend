import '../styles/pages/TablesPage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {setUserLoading} from "../slices/userSlice.ts";

export interface Table {
    id: number;
    created: string;
    name: string;
    title: string;
}

const TablesPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, admin} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [tables, setTables] = useState<Table[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<Table[]>([]);

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

    useEffect(() => {
        if (authorized) {
            dispatch(setUserLoading(true));
            axios.get(baseUrl + '/security').then((response) => {
                setName(response.data.name);
                axios.get<Table[]>(baseUrl + '/table').then((response) => {
                    setTables(response.data);
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
                                <th className='small'>ID</th>
                                <th className='large'>Name</th>
                                <th className='large'>Title</th>
                                <th className='medium'>Created</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTables.map((table, index) => {
                                const created = new Date(table.created);
                                return (
                                    <tr key={index}>
                                        <td className='action'>
                                            <button>Common</button>
                                            <button>Columns</button>
                                            <button>Access</button>
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
        </div>
    )
}
export default TablesPage;
