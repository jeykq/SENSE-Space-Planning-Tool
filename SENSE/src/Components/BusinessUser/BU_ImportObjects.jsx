import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDPreview from './ThreeDPreview';
import Topbar from '../BusinessUser/Topbar';
import axios from 'axios';

const BU_ImportObjects = ({ submit }) => {
    const [objectName, setObjectName] = useState('');
    const [objectCat, setObjectCat] = useState('');
    const [tags, setTags] = useState({
        'Autism Friendly': false,
        'Safe for Kids': false,
        'Colour-blind': false,
        'Therapeutic': false,
    });
    const [productDescription, setProductDescription] = useState('');
    const [showTags, setShowTags] = useState(false);
    const [objFile, setObjFile] = useState(null); // State to store the uploaded OBJ file
    const [objFileName, setObjFileName] = useState(''); // State to store the uploaded OBJ file name
    const [fileContent, setFileContent] = useState(null); // State to store file content
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleTagChange = (event) => {
        const { name, checked } = event.target;
        setTags((prevTags) => ({
            ...prevTags,
            [name]: checked,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (objFile) {
            try {
                // Request a pre-signed URL from the backend
                const { data: presignedData } = await axios.get('https://api.sensespacesplanningtool.com/object/presigned-url', {
                    params: {
                        filename: objFile.name,
                        filetype: objFile.type
                    }
                });

                // Upload the file to S3 using the pre-signed URL
                const formData = new FormData();
                Object.keys(presignedData.fields).forEach(key => {
                    formData.append(key, presignedData.fields[key]);
                });
                formData.append('file', objFile);

                const response = await axios.post(presignedData.url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response.data);
                console.log("Upload complete");

                // Optionally, you can handle the submission success here
                // and navigate or perform additional actions.

            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file');
            }
        } else {
            alert('Please select a file to upload.');
        }
    };

    const handleImportClick = () => {
        if (!objectName.trim()) {
            alert('Please enter an object name first.');
            return;
        }
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension !== 'obj') {
                alert('Only .obj files are allowed');
                fileInputRef.current.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setFileContent(content); // Store the file content
                setObjFile(file); // Store the file itself
                setObjFileName(file.name); // Store the file name
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const selectedTags = Object.keys(tags).filter(tag => tags[tag]).join(', ');

    const isObjectNameFilled = objectName.trim() !== '';

    return (
        <div>
            <Topbar title="Import Objects" />
            <div style={{ marginTop: '20px' }}></div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="obj_name">Object Name:</label>
                    </div>
                    <div className="col-span-3">
                        <input
                            type="text"
                            placeholder="Enter Object name..."
                            className="border border-gray-400 w-full py-1 px-2"
                            value={objectName}
                            onChange={(e) => setObjectName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="obj_cat">Category:</label>
                    </div>
                    <div className="col-span-3">
                        <select
                            className="border border-gray-400 w-full py-1 px-2"
                            value={objectCat}
                            onChange={(e) => setObjectCat(e.target.value)}
                            disabled={!isObjectNameFilled}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Chair">Chair</option>
                            <option value="Table">Table</option>
                            <option value="Decorations">Decorations</option>
                            <option value="Lights">Lights</option>
                            <option value="Sofa">Sofa</option>
                        </select>
                    </div>
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="tags">Tags:</label>
                    </div>
                    <div className="col-span-3">
                        <button
                            type="button"
                            onClick={() => setShowTags(!showTags)}
                            className="flex items-center"
                            disabled={!isObjectNameFilled}
                        >
                            <span className="mr-2">Select Tags</span>
                            <span className={`transform ${showTags ? 'rotate-90' : ''}`}>▶</span>
                        </button>
                        {selectedTags && <span className="ml-2">({selectedTags})</span>}
                        {showTags && (
                            <ul className="list-none mt-2 border border-gray-400 p-2 rounded">
                                {Object.keys(tags).map((tag) => (
                                    <li key={tag} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            name={tag}
                                            checked={tags[tag]}
                                            onChange={handleTagChange}
                                            className="mr-2"
                                            disabled={!isObjectNameFilled}
                                        />
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="col-span-4 flex flex-col items-center justify-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".obj"
                            disabled={!isObjectNameFilled}
                        />
                        <button
                            type="button"
                            className="max-w-min text-nowrap bg-orange-500 px-8 py-1 text-white mt-5 uppercase"
                            onClick={handleImportClick}
                        >
                            Import Object
                        </button>
                        <span className="text-xs">*Only file format *.obj and *.mtl is accepted</span>
                        {objFileName && <p className="mt-2 text-sm">Selected file: {objFileName}</p>}
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
                            placeholder="Enter product description..."
                            disabled={!isObjectNameFilled}
                        />
                    </div>
                    <div className="col-span-2 mx-8 -translate-y-2" style={{ width: '100%' }}>
                        <ThreeDPreview objFile={objFile} />
                    </div>
                </div>
                <div className="col-span-4 flex items-center justify-center">
                    <button
                        className="w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase"
                        disabled={!isObjectNameFilled}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BU_ImportObjects;