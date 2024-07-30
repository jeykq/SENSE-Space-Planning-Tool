import React, { useState, useEffect } from 'react';
import ObjCategory from './ObjCategory';
import axios from 'axios';

const AddObjDropdown = ({ closeDropdown, objectListData, handleDragStart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredObjects, setFilteredObjects] = useState(objectListData);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [authError, setAuthError] = useState(null); // To track auth errors

    useEffect(() => {
        fetchCategoriesAndTags();
    }, []);

    const getHeaders = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found in localStorage');
            return null;
        }
        console.log('Auth token:', token);  // Debugging: log the token
        return {
            'Content-Type': 'application/json',
            'sense-token': token
        };
    };

    const fetchCategoriesAndTags = async () => {
        try {
            const headers = getHeaders();
            if (!headers) {
                setAuthError('No auth token found. Please log in again.');
                return;
            }

            console.log('Request headers:', headers);  // Debugging: log the headers

            const categoriesResponse = await axios.post('https://api.sensespacesplanningtool.com/category/list', {}, { headers });
            const tagsResponse = await axios.post('https://api.sensespacesplanningtool.com/tag/list', {}, { headers });

            setCategories(categoriesResponse.data.body);
            setTags(tagsResponse.data.body);
            console.log('Categories:', categoriesResponse.data.body);
            console.log('Tags:', tagsResponse.data.body);
        } catch (error) {
            console.error('Error fetching categories and tags:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);

                // Check if the error is due to authorization
                if (error.response.status === 403) {
                    setAuthError('User not authorized. Please check your token or login again.');
                    // Optionally, redirect to login or refresh token
                }
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTags((prevSelectedTags) => {
            if (checked) {
                return [...prevSelectedTags, value];
            } else {
                return prevSelectedTags.filter((tagId) => tagId !== value);
            }
        });
    };

    useEffect(() => {
        filterObjects();
    }, [searchTerm, selectedTags, objectListData]);

    const filterObjects = () => {
        if (!objectListData || !Array.isArray(objectListData)) {
            console.error('objectListData is not an array:', objectListData);
            return;
        }

        let filtered = objectListData;
        if (searchTerm) {
            filtered = filtered.filter(obj => 
                obj.name && obj.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedTags.length > 0) {
            filtered = filtered.filter(obj => 
                selectedTags.every(tag => obj.tag_ids.includes(parseInt(tag)))
            );
        }

        setFilteredObjects(filtered);
    };

    return (
        <div className="w-full mt-2 bg-white p-4 rounded shadow-lg max-h-[85vh] overflow-y-scroll">
            <div className="flex pb-1 mb-2 border-b border-black justify-between items-center">
                <h3 className="text-lg font-semibold uppercase">Object catalogue</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-400 py-1 px-2 rounded text-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: '150px' }}
                    />
                    <button onClick={closeDropdown} className="text-black text-lg">
                        &times;
                    </button>
                </div>
            </div>
            {authError && <div className="text-red-500 mb-2">{authError}</div>} {/* Display auth error */}
            <div className="mb-2">
                <h4 className="text-sm font-semibold">Filter by tags</h4>
                <div className="flex flex-wrap">
                    {tags.map(tag => (
                        <label key={tag.id} className="mr-2 mb-2 flex items-center">
                            <input
                                type="checkbox"
                                value={tag.id}
                                onChange={handleTagChange}
                                className="mr-1"
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>
            </div>
            {categories.map((cat) => (
                <ObjCategory 
                    name={cat.name} 
                    catId={cat.id} 
                    key={cat.id} 
                    objectListData={filteredObjects} 
                    handleDragStart={handleDragStart}
                />
            ))}
        </div>
    );
};

export default AddObjDropdown;
