import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';

const ImportRoomForm = ({ submit }) => {
    const [objectName, setObjectName] = useState('');
    const [roomType, setRoomType] = useState('');
    const [tags, setTags] = useState({
        Depression: false,
        tag2: false,
        tag3: false,
        tag4: false,
    });
    const [productDescription, setProductDescription] = useState(''); // State for product description
    const [showTags, setShowTags] = useState(false); // State for checklist visibility
    const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
    const fileInputRef = useRef(null); // Reference to the hidden file input
    const navigate = useNavigate();

    const handleTagChange = (event) => {
        const { name, checked } = event.target;
        setTags((prevTags) => ({
            ...prevTags,
            [name]: checked,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submit({
            objectName,
            roomType,
            tags: Object.keys(tags).filter((tag) => tags[tag]),
            productDescription, // Include product description in the submit data
            file: selectedFile, // Include the selected file in the submit data
        });
    };

    const handleGoBack = () => {
        navigate('/Room3D'); 
    };

    const handleImportClick = () => {
        fileInputRef.current.click(); // Trigger click on hidden file input
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension !== 'obj') {
                alert('Only .obj files are allowed');
                fileInputRef.current.value = ''; // Reset the file input
                return;
            }
            setSelectedFile(file); // Store the selected file
            console.log('Selected file:', file.name);
        }
    };

    // Generate a string of selected tags
    const selectedTags = Object.keys(tags).filter(tag => tags[tag]).join(', ');

    return (
      <div>
        <Topbar title="Import Room" onClick={handleGoBack} />
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-4 mt-4">
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
                    <label htmlFor="room_type">Room Type:</label>
                </div>
                <div className="col-span-3">
                    <input
                        type="text"
                        placeholder="Enter Room type..."
                        className="border border-gray-400 w-full py-1 px-2"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        required
                    />
                </div>
                <div className="col-span-1 text-center self-center">
                    <label htmlFor="tags">Tags:</label>
                </div>
                <div className="col-span-3">
                    <button
                        type="button"
                        onClick={() => setShowTags(!showTags)}
                        className="flex items-center"
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
                    />
                    <button
                        type="button"
                        className="max-w-min text-nowrap bg-orange-500 px-8 py-1 text-white mt-5 uppercase"
                        onClick={handleImportClick}
                    >
                        Import Object
                    </button>
                    <span className="text-xs">*Only file format *.obj is accepted</span>
                    {selectedFile && <span className="mt-2 text-sm">{selectedFile.name}</span>}
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
                    />
                </div>
                <div className="col-span-2 mx-8 -translate-y-2">
                    <div className="bg-white h-40 rounded-md p-4">
                        {selectedFile ? selectedFile.name : '[obj preview]'}
                    </div>
                </div>
            </div>
            <div className="col-span-4 flex items-center justify-center">
                <button className="w-max-min text-nowrap bg-blue-500 py-3 text-white px-8 mt-5 uppercase">
                    Save
                </button>
            </div>
        </form>
      </div>
    );
};

export default ImportRoomForm;
