import React, { useState, useEffect, useRef } from 'react';
import ObjCategory from './ObjCategory';
import axios from 'axios';

const AddObjDropdown = ({ closeDropdown, categoryData, objectListData }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [authError, setAuthError] = useState(null);
    const dropdownRef = useRef(null);

    const retry = async (fn, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setAuthError('No auth token found. Please log in again.');
                    return;
                }

                const response = await retry(() => axios.post('https://api.sensespacesplanningtool.com/tag/list', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'sense-token': token
                    }
                }));

                setTags(response.data.body);
                setAuthError(null);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setAuthError('Failed to fetch tags. Please check your token or login again.');
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setAuthError('No auth token found. Please log in again.');
                    return;
                }

                const response = await retry(() => axios.post('https://api.sensespacesplanningtool.com/category/list', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'sense-token': token
                    }
                }));

                setCategories(response.data.body);
                setAuthError(null);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setAuthError('Failed to fetch categories. Please check your token or login again.');
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTags((prevSelectedTags) => {
            if (checked) {
                return [...prevSelectedTags, value];
            } else {
                return prevSelectedTags.filter(tagId => tagId !== value);
            }
        });
    };

    const filteredObjectListData = {
        ...objectListData,
        body: objectListData?.body?.filter(obj => 
            obj.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedTags.length === 0 || selectedTags.every(tag => obj.tag_ids.includes(parseInt(tag))))
        )
    };

    const getTagNames = () => {
        return selectedTags
            .map(tagId => {
                const tag = tags.find(tag => tag.id === parseInt(tagId));
                return tag ? tag.name : '';
            })
            .filter(tagName => tagName !== '');
    };

    return (
        <div className="w-full mt-2 bg-white p-4 rounded shadow-lg max-h-[85vh] overflow-y-scroll">
            <div className="flex pb-1 mb-2 border-b border-black justify-between items-center">
                <h3 className="text-lg font-semibold uppercase">Object catalogue</h3>
                <button onClick={closeDropdown} className="text-black text-lg">
                    &times;
                </button>
            </div>
            {authError && <div className="text-red-500 mb-2">{authError}</div>}
            <div className="relative mb-4" ref={dropdownRef}>
                <input
                    type="text"
                    placeholder="Search objects by name..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold">Filter by tags</h4>
                    </div>
                    <div className="flex flex-wrap mt-2 overflow-y-auto max-h-24">
                        {getTagNames().map(tagName => (
                            <span key={tagName} className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded">
                                {tagName}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-col mt-2">
                        {tags.map(tag => (
                            <label key={tag.id} className="mb-2 flex items-center">
                                <input
                                    type="checkbox"
                                    value={tag.id}
                                    onChange={handleTagChange}
                                    className="mr-1"
                                    checked={selectedTags.includes(tag.id.toString())}
                                />
                                {tag.name}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {filteredObjectListData.body && filteredObjectListData.body.length > 0 ? (
                <div className="mt-4">
                    {categoryData?.body?.map((cat) => (
                        <ObjCategory 
                            name={cat.name} 
                            catId={cat.id} 
                            key={cat.id} 
                            objectListData={filteredObjectListData} 
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-4 text-center text-gray-500">
                    No objects found, try searching another object.
                </div>
            )}
        </div>
    );
};

export default AddObjDropdown;
