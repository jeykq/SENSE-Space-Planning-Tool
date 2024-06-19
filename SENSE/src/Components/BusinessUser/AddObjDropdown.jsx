import React, { useState, useEffect } from 'react';
import ObjCategory from './ObjCategory'
import ObjPreview from './ObjPreview';

const AddObjDropdown = ({ closeDropdown, categoryData, objectListData }) => {
    const handleDragStart = (event, modelPath, materialPath) => {
        event.dataTransfer.setData('modelPath', modelPath);
        event.dataTransfer.setData('materialPath', materialPath);
    };

    return (
        <div className="w-full mt-2 bg-white p-4 rounded shadow-lg overflow-y-scroll max-h-[85vh]">
            <div className="flex pb-1 mb-2 border-b border-black">
                <h3 className="text-lg font-semibold uppercase">Object catalogue</h3>
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
            </div>
            {/* {loading && <p>Loading...</p>} */}
            {categoryData?.body?.map((cat) => (
                <ObjCategory name={cat.name} catId={cat.id} key={cat.id} objectListData={objectListData} />
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
                        testing_table_preview
                    </div>
                </div>
            </div>
            {/* testing end */}

             {/* testing second item preview start */}
             <div className="grid grid-cols-3 gap-2 p-2">
                <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center" >
                    <div
                        draggable
                        onDragStart={(event) => handleDragStart(event, 'DesignChair1.obj', 'DesignChair1.mtl')}
                        className="mb-2 cursor-pointer"
                    >
                        <ObjPreview objUrl="/3Dmodels/DesignChair1.obj" mtlUrl="/3Dmodels/DesignChair1.mtl" />
                    </div>
                    <div className="mt-auto mb-1 text-sm w-full break-words px-1">
                        design_chair_preview
                    </div>
                </div>
            </div>
            {/* testing end */}

        </div>
    );
};

export default AddObjDropdown;