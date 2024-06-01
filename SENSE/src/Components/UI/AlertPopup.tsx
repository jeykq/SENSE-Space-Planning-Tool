import React from 'react';

interface AlertPopupProps {
    title: string;
    text: string;
    onClose: () => void;
    onOk: () => void;
}

const AlertPopup = ({ title, text, onClose, onOk }: AlertPopupProps) => {
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/30 flex">
            <div className="relative p-8 bg-white w-[90%] max-w-md m-auto flex-col flex rounded-lg items-center">
                <div className="text-black text-xl p-2 font-bold">{title}</div>
                <p className="text-black p-2 my-2">{text}</p>
                <span className="absolute top-0 right-0 p-4">
                    <button
                        onClick={() => onClose()}
                        className={`focus:outline-none focus:border-none hover:bg-gray-300 hover:bg-opacity-25 py-1 px-2 inline-flex items-center`}
                    >x
                    </button>
                </span>
                <div className="flex flex-row py-2 mt-2">
                    <div className="mx-auto">
                        <button 
                            onClick={() => onOk()} 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertPopup;