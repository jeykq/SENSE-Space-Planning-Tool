import React, { useState } from 'react';

const AddObjDropdown = ({ closeDropdown }) => {
    const handleDragStart = (event, modelPath, materialPath) => {
        event.dataTransfer.setData('modelPath', modelPath);
        event.dataTransfer.setData('materialPath', materialPath);
    };

    const [lrExpand, setLrExpand] = useState(false);
    const [brExpand, setBrExpand] = useState(false);
    const [kExpand, setKExpand] = useState(false);
    const [srExpand, setSrExpand] = useState(false);

    return (
        <div className="w-full mt-2 bg-white p-4 rounded shadow-lg">
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-black">
                <h3 className="text-sm font-semibold uppercase">Object categories</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-400 py-1 px-2 rounded text-sm"
                        style={{ width: '100px' }}
                    />
                    <button onClick={closeDropdown} className="text-black" style={{ marginLeft: '8px' }}>
                        &times;
                    </button>
                </div>
            </div>
            <div onClick={() => setLrExpand(!lrExpand)} className="bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                Sofa
            </div>
            {lrExpand && 
                <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {/* first item */}
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div
                                draggable
                                onDragStart={(event) => handleDragStart(event, 'sofa.obj', 'sofa.mtl')}
                                className="mb-2 cursor-pointer"
                            >
                                Sofa
                            </div>
                            <div className="mt-auto mb-1 text-sm">
                                Sofa
                            </div>
                        </div>
                        {/* first item end */}
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div onClick={() => setBrExpand(!brExpand)} className="bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                Table
            </div>
            {brExpand && 
                <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {/* first item */}
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div
                                draggable
                                onDragStart={(event) => handleDragStart(event, 'table.obj', 'table.mtl')}
                                className="mb-2 cursor-pointer"
                            >
                                Table
                            </div>
                            <div className="mt-auto mb-1 text-sm">
                                Table
                            </div>
                        </div>
                        {/* first item end */}
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div onClick={() => setKExpand(!kExpand)} className="bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                Chair
            </div>
            {kExpand && 
                <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {/* first item */}
                         <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div
                                draggable
                                onDragStart={(event) => handleDragStart(event, 'chair.obj', 'chair.mtl')}
                                className="mb-2 cursor-pointer"
                            >
                                Chair
                            </div>
                            <div className="mt-auto mb-1 text-sm">
                                Chair
                            </div>
                        </div>
                        {/* first item end */}
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div onClick={() => setSrExpand(!srExpand)} className="bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                Lamp
            </div>
            {srExpand && 
                <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-2 p-2">
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default AddObjDropdown;