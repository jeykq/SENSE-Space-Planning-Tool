import React, { useState } from "react";

const PU_SearchBar = ({ handleSearch }) => {
  const [searchType, setSearchType] = useState("name");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
    handleSearch("", e.target.value); // Reset search query on type change
  };

  const handleSearchChange = (e) => {
    handleSearch(e.target.value, searchType);
  };

  return (
    <div className="flex items-center">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          className="border text-black rounded px-2 py-1 mr-1.5 w-[250px]"
        />
        <label className="mr-5 px-2.5 py-5 text-black dark:text-white rounded">Filter by:</label>
        <select
          className="border rounded text-black px-1.5 py-1 mr-1.5"
          onChange={handleTypeChange}
          value={searchType}
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
      </form>
    </div>

  );
};

export default PU_SearchBar;
