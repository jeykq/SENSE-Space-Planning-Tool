import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDPreview from './ThreeDPreview';
import Topbar from '../BusinessUser/Topbar';
import { getHeaders } from '../../../apiUtils';
import AlertPopup from '../UI/AlertPopup';
import axios from 'axios';

const BU_ImportObjects = ({ submit }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [objectName, setObjectName] = useState('');
    const [objectCat, setObjectCat] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [productDescription, setProductDescription] = useState('');
    const [showTags, setShowTags] = useState(false);
    const [objFile, setObjFile] = useState(null);
    const [objFileName, setObjFileName] = useState('');
    const [mtlFile, setMtlFile] = useState(null);
    const [mtlFileName, setMtlFileName] = useState('');
    const fileInputRef = useRef(null);
    const [objUrl, setObjUrl] = useState('');
    const [mtlUrl, setMtlUrl] = useState('');
    const [nameError, setNameError] = useState('');
    const [fileContent, setFileContent] = useState(null);
    const [screenshotDataUrl, setScreenshotDataUrl] = useState('');

    let previewUploadUrl;
    let headers;

    const navigate = useNavigate();
    const handleGoBack = () => {
        setShowAlert(false);
        window.location.href = "/BusinessUserHomepage";
    };

    useEffect(() => {
        fetchCategoriesAndTags();
        window.scrollTo(0, 0);
    }, []);

    const checkObjectName = async (name) => {
        try {
            headers = getHeaders();
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
            headers = getHeaders();
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

        if (objFile && mtlFile && isObjectNameFilled) {
            try {
                const headers = getHeaders();

                const data = {
                    name: objectName,
                    product_description: { "description.a": productDescription },
                    category_ids: [objectCat],
                    tag_ids: selectedTags,
                    filenames: [objFileName, mtlFileName]
                };

                // Step 1: Import object metadata and get object_id
                const importResponse = await axios.post(
                    'https://api.sensespacesplanningtool.com/object/import',
                    data,
                    { headers }
                );

                const objectId = importResponse.data.body.id;
                console.log('Object ID:', objectId);

                // Step 2: Upload .obj file to S3 with dynamic folder path
                const objUpdateUrl = importResponse.data.body.object_files[objFileName];

                await axios.put(
                    objUpdateUrl,
                    objFile,
                    {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': 'attachment',
                            ...headers
                        },
                    }
                );

                console.log("Uploaded .obj file successfully");

                // Step 3: Upload .mtl file to S3 with dynamic folder path
                const mtlUpdateUrl = importResponse.data.body.object_files[mtlFileName];
                previewUploadUrl = importResponse.data.body.object_media.preview;

                await axios.put(
                    mtlUpdateUrl,
                    mtlFile,
                    {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': 'attachment',
                            ...headers
                        },
                    }
                );

                console.log("Uploaded .mtl file successfully");

                setObjUrl(objUpdateUrl);
                setMtlUrl(mtlUpdateUrl);

                // Step 4: Capture screenshot and upload to S3
                await captureScreenshotAndUpload(previewUploadUrl);

                console.log("Upload complete", importResponse.data);
                setShowAlert(true);

            } catch (error) {
                console.error('Error uploading files:', error);
            }
        } else {
            alert('Please select both .obj and .mtl files to upload.');
        }
    };

    const handleOK = () => {
        setShowAlert(false);
        window.location.href = "/BusinessUserHomepage";
    };
    

    const handleImportClick = () => {
        if (!objectName.trim()) {
            alert('Please enter an object name first.');
            return;
        }
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        let objFile = null;
        let mtlFile = null;
        let objFileName = '';
        let mtlFileName = '';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                if (fileExtension === 'obj') {
                    objFile = file;
                    objFileName = file.name;
                    setObjFile(objFile);
                    setObjFileName(objFileName);
                    setFileContent(content);
                    setObjUrl(content);
                } else if (fileExtension === 'mtl') {
                    mtlFile = file;
                    mtlFileName = file.name;
                    setMtlFile(mtlFile);
                    setMtlFileName(mtlFileName);
                    setMtlUrl(content);
                } else {
                    alert('Only .obj and .mtl files are allowed');
                    fileInputRef.current.value = '';
                    return;
                }
            };

            reader.readAsDataURL(file);
        }

        if (objFile && mtlFile) {
            setObjFile(objFile);
            setObjFileName(objFileName);
            setMtlFile(mtlFile);
            setMtlFileName(mtlFileName);
            // Set objUrl and mtlUrl immediately upon file selection
            const objUrl = URL.createObjectURL(objFile);
            const mtlUrl = URL.createObjectURL(mtlFile);
            setObjUrl(objUrl);
            setMtlUrl(mtlUrl);
        } else {
            alert('Please select both .obj and .mtl files.');
            fileInputRef.current.value = '';
        }
    };

    const isObjectNameFilled = objectName.trim() !== '';

    const captureScreenshotAndUpload = async (previewUploadUrl) => {
        try {
            const canvas = document.querySelector('canvas');

            await new Promise((resolve) => {
                let frames = 5;
                const waitForFrames = () => {
                    if (frames > 0) {
                        frames--;
                        requestAnimationFrame(waitForFrames);
                    } else {
                        resolve();
                    }
                };
                requestAnimationFrame(waitForFrames);
            });

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('file', blob, 'Preview.png');
                await axios.put(previewUploadUrl, blob, {
                    headers: {
                        'Content-Type': 'image/png',
                        'Content-Disposition': 'attachment',
                        ...headers
                    },
                });

                console.log("Uploaded screenshot successfully");
            }, 'image/png');
        } catch (error) {
            console.error('Error capturing or uploading screenshot:', error);
        }
    };

    const handleRenderComplete = async () => {
        console.log("Render complete, capturing screenshot...");
        await captureScreenshotAndUpload(previewUploadUrl);
    };

    return (
        <div>
            <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                <Topbar title="Import Objects" onClick={handleGoBack} />
            </div>
            <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-10">
                <form onSubmit={handleSubmit} className="w-full max-w-4xl p-8">
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 flex flex-col justify-center items-end">
                            <label htmlFor="obj_name" className="font-bold">Object Name:</label>
                        </div>
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Enter Object name..."
                                className="border border-gray-400 w-full py-2 px-3 rounded"
                                value={objectName}
                                onChange={handleObjectNameChange}
                                required
                            />
                            {nameError && (
                                <p className="text-left text-red-500 mt-1">{nameError}</p>
                            )}
                        </div>
                        <div className="col-span-1 flex flex-col justify-center items-end">
                            <label htmlFor="obj_cat" className="font-bold">Category:</label>
                        </div>
                        <div className="col-span-3">
                            <select
                                className="border border-gray-400 w-full py-2 px-3 rounded"
                                value={objectCat}
                                onChange={(e) => setObjectCat(e.target.value)}
                                disabled={!isObjectNameFilled}
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
                        <div className="col-span-1 flex flex-col justify-center items-end">
                            <label htmlFor="tags" className="font-bold">Tags:</label>
                        </div>
                        <div className="col-span-3">
                            <button
                                type="button"
                                onClick={() => setShowTags(!showTags)}
                                className="text-blue-500"
                                disabled={!isObjectNameFilled}
                            >
                                <span className="mr-2">Select Tags</span>
                                <span className={`transform ${showTags ? 'rotate-90' : ''}`}>▶</span>
                            </button>
                            {selectedTags.length > 0 && (
                                <span className="ml-2">
                                    ({selectedTags.map(tagId => tags.find(tag => tag.id.toString() === tagId)?.name).join(', ')})
                                </span>
                            )}
                            {showTags && (
                                <ul className="list-none mt-2 border border-gray-400 p-2 rounded w-full">
                                    {tags.map((tag) => (
                                        <li key={tag.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                value={tag.id}
                                                checked={selectedTags.includes(tag.id.toString())}
                                                onChange={handleTagChange}
                                                className="mr-2"
                                                disabled={!isObjectNameFilled}
                                            />
                                            {tag.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="col-span-4 flex flex-col items-center mt-6">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".obj,.mtl"
                                multiple
                                disabled={!isObjectNameFilled}
                            />
                            <button
                                type="button"
                                className="bg-orange-500 text-white py-2 px-6 mt-5 uppercase rounded hover:bg-orange-600 transition-all"
                                onClick={handleImportClick}
                            >
                                Import Object
                            </button>
                            <p className="text-gray-500 mt-2">Please select both *.obj and *.mtl files to import object.</p>
                            <p className="text-xs text-gray-500">*Only file format *.obj and *.mtl is accepted</p>
                            {objFileName && <p className="mt-2 text-sm">Selected OBJ file: {objFileName}</p>}
                            {mtlFileName && <p className="mt-2 text-sm">Selected MTL file: {mtlFileName}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-bold mb-2">Product Description</label>
                            <textarea
                                className="bg-white h-40 rounded-md p-4 border border-gray-400 w-full"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                placeholder="Enter product description..."
                                disabled={!isObjectNameFilled}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-bold mb-2">Object Preview</label>
                            <div className="rounded-md border border-gray-400" style={{ height: '300px', width: '100%' }}>
                                {objUrl && mtlUrl ? (
                                    <ThreeDPreview objUrl={objUrl} mtlUrl={mtlUrl} onRenderComplete={handleRenderComplete} />
                                ) : (
                                    <p className="text-center p-4 text-gray-500">Select .obj and .mtl files to see the preview.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-all cursor-pointer"
                            disabled={!isObjectNameFilled || !objFile || !mtlFile}
                        >
                            Save
                        </button>
                    </div>
                </form>
                {showAlert && (
                    <AlertPopup
                        title="Success"
                        text="New Object has been imported successfully."
                        onClose={() => setShowAlert(false)}
                        onOk={handleOK}
                    />
                )}
            </div>
        </div>
    );
};

export default BU_ImportObjects;