import '../styles/pages/ColumnsPage.scss';
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import Dialog from "../components/Dialog.tsx";
import DialogConfirm from "../components/DialogConfirm.tsx";

export type Dropdown = { id: number, text: string };

export interface Column {
    id: number
    created: string,
    updated: string,
    name: string,
    title: string,
    type: string,
    dropdown: Dropdown[],
    order: number
}

interface ColumnsPageProps {
}

const ColumnsPage: React.FC<ColumnsPageProps> = (props: ColumnsPageProps) => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {authorized, loading} = useSelector((state: RootState) => state.user);

    const [name, setName] = useState<string>('');
    const [tables, setTables] = useState<Column[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filteredTables, setFilteredTables] = useState<Column[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogDataId, setDialogDataId] = useState<number>(0);
    const [dialogDataCreated, setDialogDataCreated] = useState<string>('');
    const [dialogDataUpdated, setDialogDataUpdated] = useState<string>('');
    const [dialogDataName, setDialogDataName] = useState<string>('');
    const [dialogDataTitle, setDialogDataTitle] = useState<string>('');
    const [dialogDataOrder, setDialogDataOrder] = useState<number>(0);
    const [dialogDataType, setDialogDataType] = useState<string>('');
    const [dialogDataDropdown, setDialogDataDropdown] = useState<Dropdown[]>([]);
    const [dialogDataDropdownText, setDialogDataDropdownText] = useState<string>('');
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);

    const openDialog = (columnId: number = 0) => {
        setDialogOpen(true);
        dispatch(setUserLoading(true));
        if (columnId === 0) {
            setDialogDataId(0);
            setDialogDataCreated('');
            setDialogDataUpdated('');
            setDialogDataName('');
            setDialogDataTitle('');
            setDialogDataOrder(0);
            setDialogDataType('');
            setDialogDataDropdown([]);
            dispatch(setUserLoading(false));
        } else {
            axios.get<Column>(baseUrl + '/table/column', {
                params: {tableId: id, id: columnId}
            }).then(response => {
                setDialogDataId(response.data.id);
                setDialogDataCreated(response.data.created);
                setDialogDataUpdated(response.data.updated);
                setDialogDataName(response.data.name);
                setDialogDataTitle(response.data.title);
                setDialogDataOrder(response.data.order);
                setDialogDataType(response.data.type);
                setDialogDataDropdown(response.data.dropdown ? response.data.dropdown : []);
                dispatch(setUserLoading(false));
            });
        }
    }

    const deleteColumn = () => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table/column', {
            data: {id: dialogDataId}
        }).then(response => {
            console.log(response);
            setDialogOpen(false);
            getTable();
        }).finally(() => {
            dispatch(setUserLoading(false));
            setDialogConfirmOpen(false);
        });
    }

    const confirmColumn = () => {
        const name = dialogDataName;
        const title = dialogDataTitle;
        const order = dialogDataOrder;
        const type = dialogDataType
        const dropdown = dialogDataDropdown;
        const tableId = id;

        dispatch(setUserLoading(true));
        if (dialogDataId === 0) {
            axios.post(baseUrl + '/table/column', {
                name,
                title,
                order,
                type,
                tableId,
                dropdown,
            }).then(response => {
                console.log(response);
                setDialogOpen(false);
                getTable();
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        } else {
            axios.put(baseUrl + '/table/column', {
                id: dialogDataId,
                name,
                title,
                order,
                type,
                dropdown,
                tableId,
            }).then(response => {
                console.log(response);
                setDialogOpen(false);
                getTable();
            }).finally(() => {
                dispatch(setUserLoading(false));
            });
        }
    }

    const addItemDropdown = () => {
        const oldDropdown: Dropdown[] = dialogDataDropdown;
        console.log(oldDropdown);
        const id: number = oldDropdown.length;
        const text: string = dialogDataDropdownText;
        const newDropdown = [...oldDropdown, {id, text}];
        setDialogDataDropdown(newDropdown);
    }

    const removeItemDropdown = (id: number) => {
        const newDropdown = dialogDataDropdown.filter(item => item.id !== id);
        setDialogDataDropdown(newDropdown);
    }

    const sortTable = (column: keyof Column, asc: boolean) => {
        const sorted = [...tables];
        sorted.sort((a, b): number => {
            if (a[column] > b[column]) return asc ? 1 : -1;
            if (a[column] < b[column]) return asc ? -1 : 1;
            return 0;
        });
        setTables(sorted);
        setFilteredTables(sorted.filter((table: Column) => {
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
        setFilteredTables(tables.filter((table: Column) => {
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
                        onClick={() => openDialog(0)}
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
                                <th className='small'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('order', true)}>A</button>
                                        <button onClick={() => sortTable('order', false)}>D</button>
                                    </div>
                                    Order
                                </th>
                                <th className='small'>
                                    <div className='buttons'>
                                        <button onClick={() => sortTable('type', true)}>A</button>
                                        <button onClick={() => sortTable('type', false)}>D</button>
                                    </div>
                                    Type
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
                                    table.type === 'action'
                                        ? <></>
                                        : <tr key={index}>
                                            <td className='action'>
                                                <button
                                                    onClick={() => openDialog(table.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    // onClick={() => dialogGroupsShow(table.id)}
                                                >
                                                    Groups
                                                </button>
                                            </td>
                                            <td className={'small'}>{table.id}</td>
                                            <td className={'small'}>{table.order}</td>
                                            <td className={'small'}>{table.type}</td>
                                            <td className={'large'}>{table.name}</td>
                                            <td className={'large'}>{table.title}</td>
                                            <td className={'medium'}>{created.toDateString()}</td>
                                        </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        : <></>
                    }
                </div>
            </div>
            {dialogOpen && <Dialog
                title={dialogDataId > 0 ? 'Edit Column' : 'New Column'}
                close={() => setDialogOpen(false)}
                delete={dialogDataId > 0 ? () => setDialogConfirmOpen(true) : undefined}
                confirm={confirmColumn}
            >{!loading && <>
                {dialogDataId > 0 && <>
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
                </>}
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
                <div className='field'>
                    <div className='left'>
                        <p>Order</p>
                    </div>
                    <div className='right'>
                        <input
                            placeholder='Required'
                            type='number'
                            value={dialogDataOrder}
                            onChange={(e) => setDialogDataOrder(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className='field'>
                    <div className='left'>
                        <p>Type</p>
                    </div>
                    <input
                        type={'radio'}
                        id={'radio_integer'}
                        name={'radio_group'}
                        value={'integer'}
                        onChange={e => setDialogDataType(e.target.value)}
                        checked={dialogDataType === 'integer'}
                    />
                    <label htmlFor={'radio_integer'}>Integer</label>
                    <input
                        type={'radio'}
                        id={'radio_string'}
                        name={'radio_group'}
                        value={'string'}
                        onChange={e => setDialogDataType(e.target.value)}
                        checked={dialogDataType === 'string'}
                    />
                    <label htmlFor={'radio_string'}>String</label>
                    <input
                        type={'radio'}
                        id={'radio_boolean'}
                        name={'radio_group'}
                        value={'boolean'}
                        onChange={e => setDialogDataType(e.target.value)}
                        checked={dialogDataType === 'boolean'}
                    />
                    <label htmlFor={'radio_boolean'}>Boolean</label>
                    <input
                        type={'radio'}
                        id={'radio_date'}
                        name={'radio_group'}
                        value={'date'}
                        onChange={e => setDialogDataType(e.target.value)}
                        checked={dialogDataType === 'date'}
                    />
                    <label htmlFor={'radio_date'}>Date</label>
                    <input
                        type={'radio'}
                        id={'radio_list'}
                        name={'radio_group'}
                        value={'list'}
                        onChange={e => setDialogDataType(e.target.value)}
                        checked={dialogDataType === 'list'}
                    />
                    <label htmlFor={'radio_list'}>List</label>
                </div>
                {dialogDataType === 'list' && <div className='items'>
                    {dialogDataDropdown.map((item, index) => {
                        return (<div
                                className='item'
                                key={index}
                            >
                                <div className={'left'}>
                                    <p>{item.text}</p>
                                </div>
                                <div className={'right'}>
                                    <button
                                        onClick={() => removeItemDropdown(item.id)}
                                        children={'Remove'}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    <div className={'item'}>
                        <div className={'left'}>
                            <input
                                type={'text'}
                                placeholder={'Enter text'}
                                value={dialogDataDropdownText}
                                onChange={e => setDialogDataDropdownText(e.target.value)}
                            />
                        </div>
                        <div className={'right'}>
                            <button
                                onClick={addItemDropdown}
                                children={'Add'}
                            />
                        </div>
                    </div>
                </div>
                }
            </>}
            </Dialog>}
            {dialogConfirmOpen && <DialogConfirm
                text={'Are you sure?'}
                cancel={() => setDialogConfirmOpen(false)}
                confirm={deleteColumn}
            />}
        </div>
    )
}
export default ColumnsPage
