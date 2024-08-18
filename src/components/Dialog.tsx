import '../styles/components/Dialog.scss';
import React, {ReactNode} from "react";

interface DialogProps {
    title: string;
    close: () => void;
    delete?: () => void;
    confirm?: () => void;
    children: ReactNode;
    // fields: {
    //     title: string,
    //     type: 'text' | 'number' | 'boolean' | 'date' | 'list' | 'password',
    //     required: boolean,
    //     placeholder: string,
    // }[]
}

const Dialog: React.FC<DialogProps> = (props: DialogProps) => {
    return (
        <div className='Dialog' onClick={props.close}>
            <div
                className='window'
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                }}
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
                    {props.children}
                </div>
                <div className='bottom'>
                    <button
                        onClick={props.close}
                    >Cancel
                    </button>
                    {props.delete && (
                        <button onClick={props.delete}>Delete</button>
                    )}
                    {props.confirm && (
                        <button onClick={props.confirm}>Confirm</button>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Dialog
