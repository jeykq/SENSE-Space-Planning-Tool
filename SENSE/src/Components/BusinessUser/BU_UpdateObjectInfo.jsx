import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import ThreeDPreview from './ThreeDPreview';
import AlertPopup from '../UI/AlertPopup'; 
import { getHeaders } from '../../../apiUtils'; 

const BU_UpdateObjectInfo = () => {
    const [objectName, setObjectName] = useState('');
    const [objectCat, setObjectCat] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [productDescription, setProductDescription] = useState('');
    const [objUrl, setObjUrl] = useState('');
    const [mtlUrl, setMtlUrl] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategoriesAndTags();
    }, []);

    const fetchCategoriesAndTags = async () => {
        try {
            const headers = getHeaders();
            const categoriesResponse = await axios.post('https://api.sensespacesplanningtool.com/category/list', {}, { headers });
            const tagsResponse = await axios.post('https://api.sensespacesplanningtool.com/tag/list', {}, { headers });

            setCategories(categoriesResponse.data.body);
            setTags(tagsResponse.data.body);
            console.log('Categories:', categoriesResponse.data.body);
            console.log('Tags:', tagsResponse.data.body);
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
                object_preview: objUrl,  // Assuming object_preview should be set from objUrl
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
            <div className="mt-10"></div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="objectName">Object Name:</label>
                    </div>
                    <div className="col-span-3">
                        <input
                            type="text"
                            className="border border-gray-400 w-3/4 py-1 px-2 rounded"
                            value={objectName}
                            onChange={(e) => setObjectName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="objectCat">Category:</label>
                    </div>
                    <div className="col-span-3">
                        <select
                            className="border border-gray-400 w-3/4 py-1 px-2 rounded"
                            value={objectCat}
                            onChange={(e) => setObjectCat(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="tags">Tags:</label>
                    </div>
                    <div className="col-span-3">
                        <div className="border border-gray-400 rounded p-2">
                            {tags.map((tag) => (
                                <label key={tag.id} className="block">
                                    <input
                                        type="checkbox"
                                        value={tag.id}
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={handleTagChange}
                                    />
                                    {tag.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex col-span-2 mx-8">
                        <span className="self-end">Product Description</span>
                    </div>
                    <div className="col-span-2 mx-8">
                        <div className="flex">
                            <span className="self-end">Object Preview</span>
                        </div>
                    </div>
                    <div className="col-span-2 mx-8 -translate-y-2">
                        <textarea
                            className="bg-white h-40 rounded-md p-4 border border-gray-400 w-full"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                            rows="4"
                        />
                    </div>
                    <div className="col-span-2 mx-8 -translate-y-2 rounded-md border border-gray-400" style={{ height: '300px', width: '400px' }}>
                        {/* Render 3D Preview here */}
                        {objUrl && mtlUrl ? (
                            <ThreeDPreview objUrl={objUrl} mtlUrl={mtlUrl} background="light" lighting="soft" />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p>No preview available.</p>
                            </div>
                        )}
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
    );
};

export default BU_UpdateObjectInfo;