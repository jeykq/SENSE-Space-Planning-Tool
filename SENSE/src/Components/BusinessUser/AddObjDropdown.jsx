import React, { useState } from 'react';

const AddObjDropdown = () => {
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
            <h3 className="text-lg font-semibold uppercase pb-1 mb-2 border-b border-black">Object catalogue</h3>
            <div onClick={() => setLrExpand(!lrExpand)} className="bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                Living Room
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
                        {/* second item */}
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
                        {/* second item end */}
                        {/* third item */}
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
                        {/* third item end */}
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
                Bathroom
            </div>
            {brExpand && 
                <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-2 p-2">
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
                Kitchen
            </div>
            {kExpand && 
                <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-2 p-2">
                        {/* one item */}
                        <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center">
                            <div className="">[ obj ]</div>
                            <div className="mt-auto mb-1 text-sm">
                                dummy
                            </div>
                        </div>
                        {/* one item end */}
                    </div>
                </div>
            }
            <div onClick={() => setSrExpand(!srExpand)} className="bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                Study Room
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