import React, { useState } from 'react';
import ObjPreview from './ObjPreview';

const ObjCategory = ({ name, catId, objectListData }) => {
    const handleDragStart = (event, modelPath, materialPath) => {
        event.dataTransfer.setData('modelPath', modelPath);
        event.dataTransfer.setData('materialPath', materialPath);
    };
    const [expand, setIsExpand] = useState(false);
    const [showInfo, setShowInfo] = useState(0);

    const matchingObj = objectListData?.body?.filter(obj => obj.category_ids?.includes(catId));

    const handleHover = (id) => {
        setShowInfo(id);
    };

    return (
        <>
            {matchingObj?.length > 0 &&
                <div onClick={() => setIsExpand(!expand)} className="flex bg-gray-200 px-3 py-2 rounded-lg mb-2 cursor-pointer">
                    <div>{name}</div>
                    <div className="text-gray-400 ml-auto">(cat_id:{catId})</div>
                </div>
            }
            {expand &&
                <>
                    <div className="bg-gray-100 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                        <div className="grid grid-cols-3 gap-2 p-2">
                            {matchingObj &&
                                <>
                                    {matchingObj.map((obj) => (
                                        <>
                                            <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center hover:bg-gray-300" onMouseEnter={() => handleHover(obj.id)} onMouseLeave={() => setShowInfo(0)} key={obj.id} >
                                                {/* {console.log(Object.keys(obj.object_files))} */}
                                                {/* <div
                                                    draggable
                                                    onDragStart={(event) => handleDragStart(event, Object.keys(obj.object_files)[1], Object.keys(obj.object_files)[0])}
                                                    className="mb-2 cursor-pointer"
                                                > */}
                                                <div
                                                    draggable
                                                    onDragStart={(event) => handleDragStart(event, sofa.obj, sofa.mtl)}
                                                    className="mb-2 cursor-pointer"
                                                >
                                                    {obj.id}
                                                    {/* <ObjPreview objUrl={`/3Dmodels/${Object.keys(obj.object_files)[1]}`} mtlUrl={`/3Dmodels/${Object.keys(obj.object_files)[0]}`}/> */}
                                                </div>
                                                <div className="mt-auto mb-1 text-sm w-full break-words px-1">
                                                    {obj.name}
                                                </div>
                                                {/* {showInfo == obj.id && 
                                                    <div className="fixed bg-white px-3 py-2 rounded-md text-xs -translate-x-20 translate-y-10 max-w-20">
                                                        {obj?.product_description['description.a']}
                                                    </div>
                                                } */}
                                            </div>
                                        </>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default ObjCategory;