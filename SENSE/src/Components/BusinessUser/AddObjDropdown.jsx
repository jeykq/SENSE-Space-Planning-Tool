import React, { useState } from 'react';
import ObjCategory from './ObjCategory';

const AddObjDropdown = ({ closeDropdown, categoryData, objectListData }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredObjectListData = {
        ...objectListData,
        body: objectListData?.body?.filter(obj => 
            obj.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    };

    return (
        <div className="w-full mt-2 bg-white p-4 rounded shadow-lg max-h-[85vh] overflow-y-scroll">
            <div className="flex pb-1 mb-2 border-b border-black">
                <h3 className="text-lg font-semibold uppercase">Object catalogue</h3>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search objects..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            {categoryData?.body?.map((cat) => (
                <ObjCategory 
                    name={cat.name} 
                    catId={cat.id} 
                    key={cat.id} 
                    objectListData={filteredObjectListData} 
                />
            ))}
        </div>
    );
};

export default AddObjDropdown;