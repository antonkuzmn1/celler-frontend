import '../styles/pages/LogsPage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";

export interface Log {
    id: number;
    created: string;
    action: string;
    newValue: any;
    initiatorId: number;
    initiator: any
    targetId: number;
    target: any;
    groupId: number;
    group: any;
    tableId: number;
    table: number;
    columnId: number;
    column: number
    rowId: number;
    row: number
    cellId: number;
    cell: any
}

const LogsPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [tables, setTables] = useState<Log[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<Log[]>([]);

    const goToAccount = () => {
        navigate('/account');
    }

    const backToTableList = () => {
        navigate('/tables');
    }

    useEffect(() => {
        if (authorized) {
            dispatch(setUserLoading(true));
            axios.get(baseUrl + '/security').then((response) => {
                setName(response.data.name);
                axios.get<Log[]>(baseUrl + '/log').then((response) => {
                    console.log(response.data);
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
        setFilteredTables(tables.filter((table: Log) => {
            return table.initiator.username.includes(search);
        }));
    }, [tables, search]);

    return (
        <div className='LogsPage'>
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
                        placeholder='Search'
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
                                <th className='small'>ID</th>
                                <th className='medium'>Initiator</th>
                                <th className='small'>Action</th>
                                {/*<th className='large'>New value</th>*/}
                                <th className='medium'>Created</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTables.map((table, index) => {
                                const created = new Date(table.created);
                                return (
                                    <tr key={index}>
                                        <td className='small'>{table.id}</td>
                                        <td className='medium'>{table.initiator.username}</td>
                                        <td className='small'>{table.action}</td>
                                        {/*<td className='large'>{table.newValue ? table.newValue.toString() : ''}</td>*/}
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
export default LogsPage;
