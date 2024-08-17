import '../styles/pages/TablePage.scss';
import React from "react";
import {useParams} from "react-router-dom";

const TablePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className='TablePage'>
            Table ID: {id}
        </div>
    )
}
export default TablePage;
