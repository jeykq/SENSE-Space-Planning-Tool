import React from 'react';

interface SaveDialogPopupProps {
    onClose: () => void;
    onSaveAsDraft: () => void;
    onPublishTemplate: () => void;
}

const SaveDialogPopup = ({ onClose, onSaveAsDraft, onPublishTemplate }: SaveDialogPopupProps) => {
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/30 flex">
            <div className="relative p-8 bg-white w-[90%] max-w-md m-auto flex-col flex rounded-lg items-center">
                <div className="text-black text-xl p-2 font-bold">What do you want to do with this room?</div>
                <span className="absolute top-0 right-0 p-4">
                    <button
                        onClick={onClose}
                        className="focus:outline-none focus:border-none hover:bg-gray-300 hover:bg-opacity-25 py-1 px-2 inline-flex items-center text-xl"
                    >
                        &times;
                    </button>
                </span>
                <div className="flex flex-row py-4 mt-4">
                    <button
                        onClick={onSaveAsDraft}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 mx-6 rounded"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={onPublishTemplate}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 mx-6 rounded"
                    >
                        Publish Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveDialogPopup;