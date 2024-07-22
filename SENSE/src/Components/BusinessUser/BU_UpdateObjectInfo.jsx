import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import ThreeDPreview from './ThreeDPreview';
import AlertPopup from '../UI/AlertPopup'; 
import { getHeaders } from '../../../apiUtils'; 

const BU_UpdateObjectInfo = () => {
    const [objectName, setObjectName] = useState('');
    const [objectCat, setObjectCat] = useState('');
    const [categories, setCategories] = useState([]);
    const [tagList, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagName, setTagNames] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [productDescription, setProductDescription] = useState('');

    const [showAlert, setShowAlert] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const { name, categoryID, productDesc, tags, objURL } = location.state || {};

    useEffect(() => {
        fetchCategoriesAndTags();
    }, []);

  const fetchCategoriesAndTags = async () => {
        try {
        const headers = getHeaders();
        const categoriesResponse = await axios.post('https://api.sensespacesplanningtool.com/category/list', {}, { headers });
        const tagsResponse = await axios.post('https://api.sensespacesplanningtool.com/tag/list', {}, { headers });
    
        const categories = categoriesResponse.data.body;
        const tagList = tagsResponse.data.body;
    
        setCategories(categories);
        setTags(tagList);
    
        const category = categories.find(cat => cat.id === categoryID[0]);
        const categoryName = category ? category.name : 'Unknown Category';
        console.log('Category Name:', categoryName);
        setCategoryName(categoryName);

        const tagNames = tags.map(tagID => {
            const tag = tagList.find(t => t.id === tagID);
            return tag ? tag.name : 'Unknown Tag';
        });
    
        console.log('Tag Names:', tagNames);
        setTagNames(tagNames);
    
        } catch (error) {
        console.error('Error fetching categories and tags:', error);
        }
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const headers = getHeaders();
            const data = {
                name: objectName,
                product_description: productDescription,
                category_id: objectCat,
                tag_ids: selectedTags,
                object_preview: objUrl,
            };

            const response = await axios.post('https://api.sensespacesplanningtool.com/object/update', data, { headers });
            console.log('Object updated successfully:', response.data);
            setShowAlert(true);
        } catch (error) {
            console.error('Error updating object:', error);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        navigate('/BusinessUserHomepage');
    };

    return (
        <div>
            <Topbar title="Update Object Information" onClick={() => navigate(-1)} />

            <div className="mt-8 flex flex-col items-center">
                <form className="w-3/4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 text-right self-center font-semibold">
                            <label htmlFor="objectName">Object Name:</label>
                        </div>
                        <div className="col-span-3">
                            <input
                                type="text"
                                className="border border-gray-400 w-full py-1 px-2 rounded"
                                value={name}
                                onChange={(e) => setObjectName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-span-1 text-right self-center font-semibold">
                            <label htmlFor="objectCat">Category:</label>
                        </div>
                        <div className="col-span-3">
                            <select
                                className="border border-gray-400 w-full py-1 px-2 rounded"
                                value={objectCat}
                                onChange={(e) => setObjectCat(e.target.value)}
                                required
                            >
                                <option value="">{categoryName}</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-1 text-right self-center font-semibold">
                            <label htmlFor="tags">Tags:</label>
                        </div>
                        <div className="col-span-3">
                            <div>
                            <select
                                className="border border-gray-400 w-full py-1 px-2 rounded"
                                value={selectedTags}
                                onChange={(e) => setSelectedTags(e.target.value)}
                                required
                            >
                                <option value="">{tagName.join(', ')}</option>
                                {tagList.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                            </div>
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <span className="self-end font-semibold">Product Description</span>
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <span className="self-end font-semibold">Object Preview</span>
                        </div>
                        <div className="col-span-2 mx-8 -translate-y-4">
                            <textarea
                                className="bg-white h-40 rounded-md p-4 border border-gray-400 w-full"
                                value={productDesc}
                                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                                rows="4"
                                required
                            />
                        </div>
                        <div className="col-span-2 mx-8 -translate-y-4 rounded-md border border-gray-400">
                            <img src={objURL} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                        </div>
                        <div className="col-span-4 flex justify-center">
                            <button
                                type="submit"
                                className="max-w-min text-nowrap bg-blue-500 px-8 py-2 text-white mt-5 uppercase rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
                {showAlert && (
                    <AlertPopup
                        title="Object has been updated successfully!"
                        onClose={handleCloseAlert}
                    />
                )}
            </div>
        </div>
    );
};

export default BU_UpdateObjectInfo;