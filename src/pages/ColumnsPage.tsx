import '../styles/pages/ColumnsPage.scss';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {Group} from "./GroupsPage.tsx";

export interface Column {
    id: number
    created: string,
    updated: string,
    name: string,
    title: string,
    type: string,
    dropdown: any[],
    order: number
}

interface ColumnsPageProps {
}

const ColumnsPage = (props: ColumnsPageProps) => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, loading} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [tables, setTables] = useState<Column[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<Group[]>([]);

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
            axios.get<Column[]>(baseUrl + '/table/column', {
                params: {tableId: id}
            }).then((response) => {
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
        <div className={'ColumnsPage'}>
            <div className='topbar'>
                <div className='left'>
                    <button onClick={() => navigate('/tables')}>Back to table list</button>
                </div>
                <div className='center'/>
                <div className='right'>
                    <button onClick={() => navigate('/account')}>{name}</button>
                </div>
                <div className='title'>
                    <p>{filteredTables.length.toString()} rows</p>
                    <input
                        type='search'
                        placeholder='Enter table name'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        // onClick={() => openDialog(0)}
                    >
                        New
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
                                                // onClick={() => openDialog(table.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                // onClick={() => dialogGroupsShow(table.id)}
                                            >
                                                Groups
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
        </div>
    )
}
export default ColumnsPage
