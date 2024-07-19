import React, { useState } from "react";

const SearchBar = ({ handleSearch }) => {
  const [searchType, setSearchType] = useState("name");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
    handleSearch(searchType); // Ensures search is updated when type changes
  };

  const handleSearchChange = (e) => {
    handleSearch(e.target.value, searchType);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          style={{ borderRadius: "20px", padding: "5px 10px", marginRight: "5px" }}
        />
        <label style={{ marginRight: "5px", color: "white", backgroundColor: "black", padding: "5px 10px", borderRadius: "20px" }}>Filter by:</label>
        <select onChange={handleTypeChange} value={searchType} style={{ borderRadius: "20px", padding: "5px 10px", marginRight: "5px" }}>
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
        <button type="submit" style={{ border: "none", borderRadius: "40px", background: "white", cursor: "pointer", padding: "5px 10px" }}>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
