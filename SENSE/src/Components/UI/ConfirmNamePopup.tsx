import React, { useState } from 'react';
import { Oval } from 'react-loader-spinner';

const ConfirmNamePopup = ({ title, onClose, onOk, isTemplateValid, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        onOk(inputValue);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/30 flex">
            <div className="relative p-8 bg-white w-[90%] max-w-md m-auto flex-col flex rounded-lg items-center">
                <div className="text-black text-xl p-2 font-bold">{title}</div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border p-2 w-full rounded-md my-2"
                    placeholder="Enter name"
                />
                {isTemplateValid === false && (
                    <p className="text-center text-red-500">
                        Name already exists! 
                        Please choose another name
                    </p>
                )}
                <span className="absolute top-0 right-0 p-4">
                    <button
                        onClick={onClose}
                        className="focus:outline-none focus:border-none hover:bg-gray-300 hover:bg-opacity-25 py-1 px-2 inline-flex items-center"
                    >
                        x
                    </button>
                </span>
                <div className="flex flex-row py-2 mt-2">
                    <div className="mx-auto">
                        <button 
                            onClick={handleSubmit}
                            className={`bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded flex items-center ${isLoading ? 'bg-gray-500' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Oval
                                        height={20}
                                        width={20}
                                        color="#ffffff"
                                        ariaLabel='oval-loading'
                                        secondaryColor="#ffffff"
                                        strokeWidth={2}
                                        strokeWidthSecondary={2}
                                    />
                                    <span className="ml-2">Loading...</span>
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmNamePopup;