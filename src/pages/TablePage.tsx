import '../styles/pages/TablePage.scss';
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../utils/store.ts";
import {setUserLoading} from "../slices/userSlice.ts";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {Table} from "./TablesPage.tsx";
import Dialog from "../components/Dialog.tsx";
import DialogConfirm from "../components/DialogConfirm.tsx";
import {ColumnType} from "./ColumnsPage.tsx";

const TablePage: React.FC = () => {
    const {tableId} = useParams<{ tableId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState<string>('');
    const {authorized, admin} = useSelector((state: RootState) => state.user);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogDataId, setDialogDataId] = useState<number>(0);
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);
    const [dialogConfirmDeleteOpen, setDialogConfirmDeleteOpen] = useState(false);
    const [dialogFields, setDialogFields] = useState<any[]>([]);

    const [table, setTable] = useState<Table>();

    const createRow = () => {
        dispatch(setUserLoading(true));
        axios.post(baseUrl + '/table/row', {
            tableId: tableId,
        }).then((_response) => {
            setDialogConfirmOpen(false);
            getTable();
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const openDialog = (rowId: number = 0) => {
        setDialogOpen(true);
        dispatch(setUserLoading(true));
        if (rowId === 0) {
            setDialogDataId(0);
            dispatch(setUserLoading(false));
        } else {
            axios.get<any>(baseUrl + '/table/row', {
                params: {tableId, rowId}
            }).then(response => {
                setDialogDataId(response.data.id);
                setDialogFields(response.data.cells);
            }).finally(() => dispatch(setUserLoading(false)));
        }
    }

    const handlerDialogFields = (cellId: number, cellType: ColumnType, e: any) => {
        // console.log('\n\ncellId:', cellId);
        // console.log('cellType:', cellType);
        // console.log(e.currentTarget.value, e.currentTarget.checked);

        const newDialogFields = [...dialogFields];
        // console.log('dialogFields:', newDialogFields);

        const index = newDialogFields.findIndex((cell) => cell.id === cellId);
        if (index !== -1) {
            switch (cellType) {
                case 'string':
                    newDialogFields[index] = {...newDialogFields[index], valueString: e.currentTarget.value};
                    break;
                case 'integer':
                    newDialogFields[index] = {...newDialogFields[index], valueInt: Number(e.currentTarget.value)};
                    break;
                case 'boolean':
                    newDialogFields[index] = {...newDialogFields[index], valueBoolean: e.currentTarget.checked};
                    break;
                case 'date':
                    newDialogFields[index] = {...newDialogFields[index], valueDate: e.currentTarget.value};
                    break;
                case 'list':
                    newDialogFields[index] = {...newDialogFields[index], valueDropdown: e.currentTarget.value};
                    break;
                default:
                    break;
            }
            setDialogFields(newDialogFields);
        }
    }

    const confirmRow = () => {
        dialogFields.forEach((cell) => {
            const id = cell.id;
            const valueInt = cell.valueInt;
            const valueString = cell.valueString;
            const valueDate = cell.valueDate;
            const valueBoolean = cell.valueBoolean;
            const valueDropdown = cell.valueDropdown;

            if (cell.column.type !== 'action') {
                dispatch(setUserLoading(true));
                axios.put(baseUrl + '/table/cell', {
                    id, valueInt, valueString, valueDate, valueBoolean, valueDropdown
                }).then((_response) => {
                }).finally(() => {
                    setDialogOpen(false);
                    getTable();
                    dispatch(setUserLoading(false))
                });
            }
        })
    }

    const deleteRow = () => {
        dispatch(setUserLoading(true));
        axios.delete(baseUrl + '/table/row', {
            data: {id: dialogDataId},
        }).then((_response) => {
            setDialogOpen(false);
            getTable();
        }).finally(() => {
            dispatch(setUserLoading(false))
            setDialogConfirmDeleteOpen(false);
        });
    }

    const getUser = () => {
        dispatch(setUserLoading(true));
        axios.get(baseUrl + '/security').then((response) => {
            setName(response.data.name);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    const getTable = () => {
        dispatch(setUserLoading(true));
        axios.get(baseUrl + '/table', {
            params: {id: tableId}
        }).then((response) => {
            setTable(response.data);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    useEffect(() => {
        if (authorized) {
            getUser();
            getTable();
        }
    }, [authorized, admin]);

    return (
        <div className='TablePage'>
            <div className='topbar'>
                <div className='left'>
                    <button
                        onClick={() => navigate('/tables')}
                        children={'Back to table list'}
                    />
                </div>
                <div className='center'/>
                <div className='right'>
                    <button onClick={() => navigate('/account')}>{name}</button>
                </div>
                <div className='title'>
                    <p>{table?.name}</p>
                    <p>-</p>
                    <p>{table?.rows.length.toString()} rows</p>
                    <button
                        // onClick={() => openDialog(0)}
                        children={'Filters'}
                    />
                    <button
                        onClick={() => setDialogConfirmOpen(true)}
                        children={'New'}
                    />
                </div>
            </div>
            <div className='frame'>
                <div className='content'>
                    <table>
                        <thead>
                        <tr>
                            <th className='action'>Settings</th>
                            {table?.columns
                                .sort((a, b) => a.order - b.order)
                                .map((column, index) => {
                                    if (column.type !== 'action') {
                                        return (
                                            <th key={index} style={{width: column.width}}>
                                                <div className='buttons'>
                                                    <button
                                                        // onClick={() => sortTable('id', true)}
                                                    >
                                                        A
                                                    </button>
                                                    <button
                                                        // onClick={() => sortTable('id', false)}
                                                    >
                                                        D
                                                    </button>
                                                </div>
                                                {column.name}
                                            </th>
                                        )
                                    }
                                })
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {table?.rows.map((row, index) => {
                            const sortedCells = [...row.cells].sort((a, b) => a.column.order - b.column.order);
                            return (
                                <tr key={index}>
                                    <td className={'action'}>
                                        <button
                                            onClick={() => openDialog(row.id)}
                                            children={'Edit'}
                                        />
                                    </td>
                                    {sortedCells.map((cell, index) => {
                                        if (cell.column.order !== 0) {
                                            let content;

                                            switch (cell.column.type) {
                                                case 'string':
                                                    content = cell.valueString;
                                                    break;
                                                case 'integer':
                                                    content = cell.valueInt;
                                                    break;
                                                case 'boolean':
                                                    content = cell.valueBoolean ? 'True' : 'False';
                                                    break;
                                                case 'date':
                                                    const date = new Date(cell.valueDate);
                                                    content = date.getFullYear() > 1970 ? date.toDateString() : '';
                                                    break;
                                                case 'list':
                                                    const ddKey = cell.valueDropdown;
                                                    const dropdowns = cell.column.dropdown
                                                    const dropdown = dropdowns.find((dropdown: {id: number, text: string}) => dropdown.id === ddKey);
                                                    const ddText = dropdown.text;
                                                    content = ddText;
                                                    break;
                                                default:
                                                    content = '???';
                                            }

                                            return (
                                                <td key={index}
                                                    style={{width: cell.column.width}}
                                                    children={content}
                                                />
                                            )
                                        }
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            {dialogOpen && <Dialog
                title={dialogDataId > 0 ? 'Edit Row' : 'New Row'}
                close={() => setDialogOpen(false)}
                delete={dialogDataId > 0 ? () => setDialogConfirmDeleteOpen(true) : undefined}
                confirm={confirmRow}
            >
                {dialogFields.map((cell, index) => {
                    if (cell.column.type !== 'action') {
                        let inputElement;
                        switch (cell.column.type) {
                            case "string":
                                inputElement = (
                                    <input
                                        placeholder={'Enter value'}
                                        type={'text'}
                                        value={cell.valueString || ''}
                                        onChange={(e) => handlerDialogFields(cell.id, cell.column.type, e)}
                                    />
                                );
                                break;
                            case "integer":
                                inputElement = (
                                    <input
                                        placeholder={'Enter value'}
                                        type={'number'}
                                        value={cell.valueInt || 0}
                                        onChange={(e) => handlerDialogFields(cell.id, cell.column.type, e)}
                                    />
                                );
                                break;
                            case "boolean":
                                inputElement = (
                                    <input
                                        placeholder={'Enter value'}
                                        type={'checkbox'}
                                        checked={cell.valueBoolean || false}
                                        onChange={(e) => handlerDialogFields(cell.id, cell.column.type, e)}
                                    />
                                );
                                break;
                            case "date":
                                const formattedDate = cell.valueDate ? cell.valueDate.split('T')[0] : '';
                                inputElement = (
                                    <input
                                        placeholder={'Enter value'}
                                        type={'date'}
                                        value={formattedDate}
                                        onChange={(e) => handlerDialogFields(cell.id, cell.column.type, e)}
                                    />
                                );
                                break;
                            case "list":
                                // const ddKey = cell.valueDropdown;
                                // const dropdowns = cell.column.dropdown
                                // const dropdown = dropdowns.find((dropdown: {id: number, text: string}) => dropdown.id === ddKey);
                                // const ddText = dropdown.text;
                                // console.log('ddKey:', ddKey);
                                // console.log('ddText:', ddText);
                                inputElement = (
                                    <select
                                        value={cell.valueDropdown}
                                        onChange={(e) => handlerDialogFields(cell.id, cell.column.type, e)}
                                        children={
                                            cell.column.dropdown.map((item: {
                                                id: number,
                                                text: string
                                            }, index: number) => (
                                                <option
                                                    key={index}
                                                    value={item.id}
                                                    children={item.text}
                                                />
                                            ))
                                        }
                                    />
                                    // <input
                                    //     placeholder={'Enter value'}
                                    //     type={'text'}
                                    //     // value={field.column.type}
                                    //     // onChange={(e) => handlerDialogFields(cell.id, cell.column.type, e)}
                                    // />
                                );
                                break;
                            default:
                                break;
                        }

                        return (
                            <div className={'field'} key={index}>
                                <div className={'left'}>
                                    <p>{cell.column.name}</p>
                                </div>
                                <div className={'right'}>
                                    {inputElement}
                                </div>
                            </div>
                        )
                    }
                })}
            </Dialog>}
            {dialogConfirmOpen && <DialogConfirm
                text={'Are you sure?'}
                cancel={() => setDialogConfirmOpen(false)}
                confirm={createRow}
            />}
            {dialogConfirmDeleteOpen && <DialogConfirm
                text={'Are you sure?'}
                cancel={() => setDialogConfirmDeleteOpen(false)}
                confirm={deleteRow}
            />}
        </div>
    )
}
export default TablePage;
