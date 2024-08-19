import '../styles/components/DialogColumns.scss';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../utils/baseUrl.ts";
import {useDispatch} from "react-redux";
import {setUserLoading} from "../slices/userSlice.ts";
import {Column} from "../pages/ColumnsPage.tsx";



interface DialogColumnsProps {
    title: string;
    close: () => void;
    id: number;
}

const DialogColumns: React.FC<DialogColumnsProps> = (props: DialogColumnsProps) => {
    const dispatch = useDispatch();

    const [columns, setColumns] = useState<Column[]>([]);

    const getColumns = () => {
        dispatch(setUserLoading(true));
        axios.get<Column[]>(baseUrl + '/table/column', {
            params: {tableId: props.id}
        }).then(response => {
            setColumns(response.data);
        }).finally(() => dispatch(setUserLoading(false)));
    }

    useEffect(() => {
        console.log(props.id);
        getColumns();
    }, []);

    return (
        <div className='DialogColumns' onClick={props.close}>
            <div
                className='window'
                onClick={e => e.stopPropagation()}
            >
                <div className='top'>
                    <div className='left'>
                        <p>{props.title}</p>
                    </div>
                    <div className='right'>
                        <button
                            onClick={props.close}
                        >Close
                        </button>
                    </div>
                </div>
                <div className='center'>
                    {columns.map((column: Column) => (
                        <div className={'column'} key={column.id}>
                            <div className={'field'}>
                                <div className={'left'}>
                                    <p>Name</p>
                                </div>
                                <div className={'right'}>
                                    <input
                                        value={column.name}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div className={'field'}>
                                <div className={'left'}>
                                    <p>Title</p>
                                </div>
                                <div className={'right'}>
                                    <input
                                        value={column.title}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                            <div className={'field'}>
                                <div className={'left'}>
                                    <p>Order</p>
                                </div>
                                <div className={'right'}>
                                    <input
                                        value={column.order}
                                        readOnly={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='bottom'>
                    <button
                        onClick={props.close}
                    >Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
export default DialogColumns
