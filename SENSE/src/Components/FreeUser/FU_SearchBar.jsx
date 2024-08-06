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
          className="border rounded px-2 py-1 mr-1.5 w-[250px]"
        />
        <label className="mr-5 text-black px-2.5 py-5 rounded">Filter by:</label>
        <select
          className="border rounded text-black px-1.5 py-1 mr-1.5"
          onChange={handleTypeChange}
          value={searchType}
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
        <button
          type="submit"
          className="border-none rounded-full bg-white cursor-pointer px-2 py-1"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </form>
    </div>

  );
};

export default PU_SearchBar;
