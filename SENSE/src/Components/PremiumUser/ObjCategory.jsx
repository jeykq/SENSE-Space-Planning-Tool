import React, { useEffect, useState } from "react";
import ObjPreview from './ObjPreview';
import { getHeaders } from '../../../apiUtils';
import axios from 'axios';

const ObjCategory = ({ name, catId, objectListData }) => {
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);

    const handleDragStart = (event, id, modelPath, materialPath) => {
        event.dataTransfer.setData('id', id);
        event.dataTransfer.setData('modelPath', modelPath);
        event.dataTransfer.setData('materialPath', materialPath);
    };
    const [expand, setIsExpand] = useState(false);
    const [showInfo, setShowInfo] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const matchingObj = objectListData?.body?.filter(obj => obj.category_ids?.includes(catId));
    // console.log(matchingObj);

    const handleHover = (id) => {
        setShowInfo(id);
        // console.log(id);
    };

    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
            const headers = getHeaders();
            const response = await axios.post(
                'https://api.sensespacesplanningtool.com/tag/list',
                {},
                { headers }
            );
    
            if (!response.data || !response.data.body) {
                throw new Error('No tags data returned');
            }

            // console.log("Tags: ", response.data);
            setTags(response.data.body);
            // console.log(tags);

            } catch (error) {
            console.error('Error fetching tags:', error);
            setError(error.message);
            }
        };

        fetchTags();
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const getTagName = (tagID) => {
        const tag = tags.find(tag => tag.id === tagID);
        return tag ? capitalizeFirstLetter(tag.name) : 'Unknown Tag';
    };

    return (
        <div>
            {matchingObj?.length > 0 &&
                <div onClick={() => setIsExpand(!expand)} className="flex bg-gray-200 dark:bg-zinc-500 text-black dark:text-white px-3 py-2 rounded-lg mb-2 cursor-pointer">
                    <div>{name}</div>
                </div>
            }
            {expand &&
                <>
                    <div className="bg-gray-100 dark:bg-zinc-500 mb-2 rounded-lg max-h-[320px] overflow-y-scroll">
                        <div className="grid grid-cols-3 gap-2 p-2">
                            {matchingObj &&
                                <>
                                    {matchingObj.map((obj) => (
                                        <div 
                                            key={obj.id} 
                                            className="bg-gray-200 dark:bg-zinc-400 rounded-md aspect-square flex flex-col text-center hover:bg-gray-300" 
                                            onMouseEnter={() => handleHover(obj.id)}
                                            onMouseMove={handleMouseMove} 
                                            onMouseLeave={() => setShowInfo(0)} 
                                            >
                                                <div
                                                    draggable
                                                    onDragStart={(event) => handleDragStart(event, obj.id, Object.keys(obj.object_files)[1], Object.keys(obj.object_files)[0])}
                                                    className="mb-2 cursor-pointer"
                                                >
                                                    <img src={obj?.object_media?.preview} className="w-20 h-20" alt={obj.name} />
                                                </div>
                                                <div className="mt-auto mb-1 text-sm w-full break-words px-1 h-[45px] flex items-center justify-center">
                                                    {obj.name}
                                                </div>
                                                {showInfo === obj.id && (
                                                    <div 
                                                        className="fixed bg-white p-4 rounded-lg shadow-lg w-64"
                                                        style={{
                                                            left: `${mousePosition.x + 10}px`,
                                                            top: `${mousePosition.y}px`,
                                                            zIndex: 1000
                                                        }}
                                                    >
                                                        <h3 className="text-lg font-bold">Description: </h3> 
                                                        <p className="text-sm mb-2">{obj?.product_description['description.a']}</p>
                                                        <hr/>
                                                        <h3 className="text-lg font-bold mb-2">Tags: </h3>
                                                        <ul className="text-sm mb-2">
                                                        {obj?.tag_ids.map(tagId => (
                                                            <li
                                                                key={tagId}
                                                                className="border border-black rounded-full px-3 py-1 mb-2 inline-block mr-1"
                                                            >
                                                                {getTagName(tagId)}
                                                            </li>
                                                        ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default ObjCategory;
