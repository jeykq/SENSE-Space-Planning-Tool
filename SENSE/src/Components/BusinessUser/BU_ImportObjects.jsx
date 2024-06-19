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
    const [fileContent, setFileContent] = useState(null);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

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
    
        if (objFile && mtlFile && isObjectNameFilled) {
            try {
                const headers = getHeaders(); // Ensure this function correctly retrieves headers with authentication tokens or other necessary data
    
                // Prepare the data object to be sent
                const data = {
                    name: objectName,
                    product_description: { "description.a": productDescription },
                    category_ids: [objectCat], // Assuming objectCat is a single category ID
                    tag_ids: selectedTags, // Assuming selectedTags is an array of tag IDs
                    filenames: [objFileName, mtlFileName] // Assuming objFileName and mtlFileName are the filenames
                };
    
                // Step 1: Import object metadata and get object_id
                const importResponse = await axios.post(
                    'https://api.sensespacesplanningtool.com/object/import',
                    data,
                    { headers }
                );
    
                const objectId = importResponse.data.body.id; // Extract object ID from response
                console.log('Object ID:', objectId);
    
                // Step 2: Upload .obj file to S3 with dynamic folder path
                const objUpdateUrl = `https://sense-wholly-locally-top-blowfish.s3.ap-southeast-1.amazonaws.com/object/${objectId}/${objFileName}`;
                
                await axios.put(
                    objUpdateUrl,
                    objFile,
                    {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': 'attachment',
                            ...headers // Include all headers required for this request
                        },
                    }
                );
    
                console.log("Uploaded .obj file successfully");
    
                // Step 3: Upload .mtl file to S3 with dynamic folder path
                const mtlUpdateUrl = `https://sense-wholly-locally-top-blowfish.s3.ap-southeast-1.amazonaws.com/object/${objectId}/${mtlFileName}`;
    
                await axios.put(
                    mtlUpdateUrl,
                    mtlFile,
                    {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': 'attachment',
                            ...headers // Include all headers required for this request
                        },
                    }
                );
    
                console.log("Uploaded .mtl file successfully");
    
                setObjUrl(objUpdateUrl);
                setMtlUrl(mtlUpdateUrl);
    
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
        navigate("/BusinessUserHomepage");
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
                    setObjUrl(content); // For preview
                } else if (fileExtension === 'mtl') {
                    mtlFile = file;
                    mtlFileName = file.name;
                    setMtlFile(mtlFile);
                    setMtlFileName(mtlFileName);
                    setMtlUrl(content); // For preview
                } else {
                    alert('Only .obj and .mtl files are allowed');
                    fileInputRef.current.value = '';
                    return;
                }
            };

            reader.readAsDataURL(file); // Read the file as a data URL
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

    return (
        <div>
            <Topbar title="Import Objects" onClick={handleGoBack} />
            <div className='mt-10'></div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 text-center self-center">
                        <label htmlFor="obj_name">Object Name:</label>
                    </div>
                    <div className="col-span-3">
                        <input
                            type="text"
                            placeholder="Enter Object name..."
                            className="border border-gray-400 w-3/4 py-1 px-2 rounded"
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
                            className="border border-gray-400 w-3/4 py-1 px-2 rounded"
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
                        {selectedTags && <span className="ml-2">({selectedTags.join(', ')})</span>}
                        {showTags && (
                            <ul className="list-none mt-2 border border-gray-400 p-2 rounded w-3/4">
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
                    <div className="col-span-4 flex flex-col items-center justify-center">
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
                            className="max-w-min text-nowrap bg-orange-500 px-8 py-1 text-white mt-5 uppercase rounded"
                            onClick={handleImportClick}
                        >
                            Import Object
                        </button>
                        <p>Please select both *.obj and *.mtl files to import object.</p>
                        <span className="text-xs">*Only file format *.obj and *.mtl is accepted</span>
                        {objFileName && <p className="mt-2 text-sm">Selected OBJ file: {objFileName}</p>}
                        {mtlFileName && <p className="mt-2 text-sm">Selected MTL file: {mtlFileName}</p>}
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
                    <div className="col-span-2 mx-8 -translate-y-2 rounded-md border border-gray-400" style={{ height: '300px', width: '400px' }}>
                        {/* Render 3D Preview here */}
                        {objUrl && mtlUrl ? (
                            <ThreeDPreview objUrl={objUrl} mtlUrl={mtlUrl} />
                        ) : (
                            <p>Select .obj and .mtl files to see the preview.</p>
                        )}
                    </div>
                </div>

                <div className="col-span-4 flex justify-center">
                    <button
                        type="submit"
                        className="max-w-min text-nowrap bg-blue-500 px-8 py-2 text-white mt-5 uppercase rounded"
                        disabled={!isObjectNameFilled || !objFile || !mtlFile}
                    >
                        Submit
                    </button>
                </div>
            </form>
            {showAlert && (
                <AlertPopup
                    title="New Object imported successfully!"
                    text="New Object has been imported successfully."
                    onClose={() => setShowAlert(false)}
                    onOk={handleOK}
                />
            )}
        </div>
    );
};

export default BU_ImportObjects;
