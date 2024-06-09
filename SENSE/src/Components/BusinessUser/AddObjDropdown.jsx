import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ObjCategory from './ObjCategory'
import ObjPreview from './ObjPreview';

const AddObjDropdown = ({ closeDropdown }) => {
    const handleDragStart = (event, modelPath, materialPath) => {
        event.dataTransfer.setData('modelPath', modelPath);
        event.dataTransfer.setData('materialPath', materialPath);
    };

    const [postData, setPostData] = useState({});
    const [categoryData, setCategoryData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'sense-token': token
        };
        setLoading(true);

        axios.post(
            'https://api.sensespacesplanningtool.com/category/list',
            {},
            { headers: headers }
        )
            .then(response => {
                setCategoryData(response.data);
                setError(null); // Reset error state if the request is successful
            })
            .catch(err => {
                setError(err.message || 'Something went wrong');
                setCategoryData(err.message); // Reset response state if the request fails
            })
            .finally(() => {
                setLoading(false);
            });
    }, [postData]);

    // console.log(categoryData);

    return (
        <div className="w-full mt-2 bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold uppercase pb-1 mb-2 border-b border-black">Object catalogue</h3>
            {/* <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-gray-400 py-1 px-2 rounded text-sm"
                    style={{ width: '100px' }}
                />
                <button onClick={closeDropdown} className="text-black" style={{ marginLeft: '8px' }}>
                    &times;
                </button>
            </div> */}
            {loading && <p>Loading...</p>}
            {categoryData?.body?.map((cat) => (
                <ObjCategory name={cat.name} catId={cat.id} key={cat.id} />
            ))}
            {/* testing item preview start */}
            <div className="grid grid-cols-3 gap-2 p-2">
                <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center" >
                    <div
                        draggable
                        onDragStart={(event) => handleDragStart(event, 'table.obj', 'table.mtl')}
                        className="mb-2 cursor-pointer"
                    >
                        <ObjPreview objUrl="/3Dmodels/table.obj" mtlUrl="/3Dmodels/table.mtl" />
                    </div>
                    <div className="mt-auto mb-1 text-sm w-full break-words px-1">
                        testing_preview_lol3
                    </div>
                </div>
            </div>
            {/* testing end */}
        </div>
    );
};

export default AddObjDropdown;