import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import Footer from "../Landing/Footer";
import AlertPopup from '../UI/AlertPopup'; 
import { getHeaders } from '../../../apiUtils'; 
import { DataArrayTexture } from 'three/src/Three.js';

const BU_UpdateObjectInfo = () => {
    const [objectName, setObjectName] = useState('');
    const [objectCat, setObjectCat] = useState('');
    const [categories, setCategories] = useState([]);
    const [tagList, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagName, setTagNames] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [productDescription, setProductDescription] = useState('');
    const [nameError, setNameError] = useState('');

    const [showAlert, setShowAlert] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const { id, name, categoryID, productDesc, tags, objURL } = location.state || {};

    useEffect(() => {
        setObjectName(name);
        setObjectCat(categoryID[0] || '');
        setSelectedTags(tags.map(tag => tag.toString()) || []);
        setProductDescription(productDesc);
        fetchCategoriesAndTags();
    }, []);

    const checkObjectName = async (name) => {
        try {
            const headers = getHeaders();
            const response = await axios.post('https://api.sensespacesplanningtool.com/object/list', {}, { headers });
            const objects = response.data.body;
            const duplicate = objects.some(object => object.name.toLowerCase() === name.toLowerCase());
    
            if (duplicate) {
                setNameError('Name already exists! Please choose another name');
            } else {
                setNameError('');
            }
        } catch (error) {
            console.error('Error checking object name:', error);
        }
    };

    const handleObjectNameChange = (e) => {
        setObjectName(e.target.value);
        checkObjectName(e.target.value);
    };

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

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        const newSelectedTags = checked
          ? [...selectedTags, value]
          : selectedTags.filter(tag => tag !== value);
        setSelectedTags(newSelectedTags);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const headers = getHeaders();
            const data = {
                id: id,
                name: objectName,
                category_ids: [parseInt(objectCat)],
                tag_ids: selectedTags.map(tag => parseInt(tag)),
                product_description: {
                    "description.a": productDescription
                }
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
        
        navigate('/BU_ViewObjectsInfo', {
            state: {
                id,
                name: objectName,
                categoryID: [parseInt(objectCat)],
                product_description: productDescription,
                tags: selectedTags.map(tag => parseInt(tag)),
                objURL
            }
        });
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
                            value={objectName}
                            onChange={handleObjectNameChange}
                            required
                        />
                        {nameError && (
                            <p className="text-left text-red-500 mt-1">{nameError}</p>
                        )}
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
                            <div className="border border-gray-400 w-full py-1 px-2 rounded">
                                {tagList.map((tag) => (
                                    <label key={tag.id} className="block">
                                        <input
                                            type="checkbox"
                                            value={tag.id}
                                            checked={selectedTags.includes(tag.id.toString())}
                                            onChange={handleCheckboxChange}
                                            className="mr-2"
                                        />
                                        {tag.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2 flex justify-center font-semibold">
                            <span className="self-end">Product Description</span>
                        </div>
                        <div className="col-span-2 flex justify-center font-semibold">
                            <div className="flex">
                                <span className="self-end">Object Preview</span>
                            </div>
                        </div>
                        <div className="col-span-2 mx-8 -translate-y-2">
                            <textarea
                                className="bg-white h-40 rounded-md p-4 border border-gray-400 w-full"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                rows="4"
                            />
                        </div>
                        <div className="col-span-2 mx-8 -translate-y-4 rounded-md border border-gray-400">
                            <img src={objURL} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                        </div>
                        <div className="col-span-4 flex justify-center">
                            <button
                                type="submit"
                                className="max-w-min text-nowrap bg-blue-500 px-8 py-2 mb-2 text-white mt-5 uppercase rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
                {showAlert && (
                    <AlertPopup
                        title="Success"
                        text="Object Information has been updated successfully!"
                        onClose={handleCloseAlert}
                        onOk={handleCloseAlert}
                    />
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BU_UpdateObjectInfo;