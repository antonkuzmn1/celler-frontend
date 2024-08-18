import '../styles/components/DialogConfirm.scss';
import React from "react";

interface DialogConfirmProps {
    text: string;
    cancel?: () => void;
    confirm?: () => void;
}

const DialogConfirm: React.FC<DialogConfirmProps> = (props: DialogConfirmProps) => {
    return (
        <div className='DialogConfirm' onClick={props.cancel}>
            <div
                className='window'
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className='center'>
                    <h1>{props.text}</h1>
                </div>
                <div className='bottom'>
                    <button onClick={props.cancel}>Cancel</button>
                    <button onClick={props.confirm}>Confirm</button>
                </div>
            </div>
        </div>
    )
}
export default DialogConfirm
