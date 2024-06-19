import React, { useState } from "react";

const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm); // Pass the current search term to the parent component
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ borderRadius: "20px", padding: "5px 10px", marginRight: "5px" ,borderWidth: "1px"}}
        />
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
