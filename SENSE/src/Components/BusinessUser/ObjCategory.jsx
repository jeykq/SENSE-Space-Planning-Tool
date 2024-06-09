import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ObjPreview from './ObjPreview';

const ObjCategory = ({ name, catId }) => {
    const navigate = useNavigate();
    const [expand, setIsExpand] = useState(false);

    const [postData, setPostData] = useState({ });
    const [objectListData, setObjectListData] = useState(null);
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
            'https://api.sensespacesplanningtool.com/object/list', 
            {},
            { headers: headers }
        )
        .then(response => {
            setObjectListData(response.data);
            setError(null); // Reset error state if the request is successful
        })
        .catch(err => {
            setError(err.message || 'Something went wrong');
            setObjectListData(err.message); // Reset response state if the request fails
        })
        .finally(() => {
            setLoading(false);
        });
    }, [postData]);

    // console.log(objectListData);

    const matchingObj = objectListData?.body?.filter(obj => obj.category_ids?.includes(catId));
    // console.log(matchingObj);

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
                        {matchingObj?.map((obj) => (
                            <div className="bg-gray-200 rounded-md aspect-square flex flex-col text-center" key={obj.id} >
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
                            </div>
                        ))}
                    </div>
                </div>
            </>
        }
    </>
  );
};

export default ObjCategory;