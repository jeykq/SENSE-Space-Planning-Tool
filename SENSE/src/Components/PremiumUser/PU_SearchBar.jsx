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
    <div style={{ display: "flex", alignItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          className="border"
          style={{ borderRadius: "5px", padding: "8px 5px", marginRight: "5px", width: "250px" }}
        />
        <label style={{ marginRight: "20px", color: "black", padding: "20px 10px", borderRadius: "2px" }}>Filter by:</label>
        <select className="border rounded text-black" onChange={handleTypeChange} value={searchType} style={{padding: "5px 5px", marginRight: "5px" }}>
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

export default PU_SearchBar;
