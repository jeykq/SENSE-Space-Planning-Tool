import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImportRoomForm = ({submit}) => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

  return (
    <>
        <form onSubmit={submit}>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-center self-center">
                    <label for="obj_name">Object Name:</label>
                </div>
                <div className="col-span-3">
                    <input type="text" placeholder="Enter Object name..." className="border border-gray-400 w-full py-1 px-2" value={email} required />
                </div>
                <div className="col-span-1 text-center self-center">
                    <label for="room_type">Room Type:</label>
                </div>
                <div className="col-span-3">
                    <input type="text" placeholder="Enter Object name..." className="border border-gray-400 w-full py-1 px-2" value={email} required />
                </div>
                <div className="col-span-1 text-center self-center">
                    <label for="room_type">Tags:</label>
                </div>
                <div className="col-span-3">
                    <select id="industry" name="industry" defaultValue={0} className="border border-gray-400 py-1 px-1 w-full text-sm" required >
                        <option value="0">-</option>
                        <option value="1">tag1</option>
                        <option value="2">tag2</option>
                        <option value="3">tag3</option>
                        <option value="4">tag4</option>
                    </select>
                </div>
                <div className="col-span-4 flex flex-col items-center justify-center">
                    <button type="button" className="max-w-min text-nowrap bg-orange-500 px-8 py-1 text-white mt-5 uppercase">
                        Import Object
                    </button>
                    <span className="text-xs">*Only file format *png, *jpeg is accepted</span>
                </div>
                <div className="flex col-span-2 mx-8">
                    <span className="self-end">Product Description</span>
                </div>
                <div className="col-span-2 mx-8">
                    <div className="flex">
                        <span className="self-end">Object Preview</span>
                        <div className="flex flex-col ml-auto items-center">
                            <span className="text-xs">*Only file format *png, *jpeg is accepted</span>
                            <button type="button" className="max-w-min text-nowrap bg-purple-500 px-8 py-1 text-white uppercase">
                                Import Image
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 mx-8 -translate-y-2">
                    <div className="bg-white h-40 rounded-md p-4">
                        [prod description]
                    </div>
                </div>
                <div className="col-span-2 mx-8 -translate-y-2">
                    <div className="bg-white h-40 rounded-md p-4">
                        [obj preview]
                    </div>
                </div>
                </div>
                <div className="col-span-4 flex items-center justify-center">
                    <button className="w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
                        Create
                    </button>
                </div>
        </form>
    </>
  );
}

export default ImportRoomForm;