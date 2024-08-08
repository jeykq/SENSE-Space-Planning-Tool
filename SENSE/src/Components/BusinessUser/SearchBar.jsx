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
    <div className="flex items-center w-full">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          className="rounded-full px-4 py-2 mr-2 w-full sm:w-auto"
        />
        <label className="hidden sm:inline-block mr-2 bg-black text-white px-4 py-2 rounded-full">Filter by:</label>
        <select
          onChange={handleTypeChange}
          value={searchType}
          className="rounded-full px-4 py-2 mr-2 w-full sm:w-auto"
        >
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
        <button
          type="submit"
          className="border-none bg-white rounded-full px-4 py-2 cursor-pointer"
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
              stroke="black"
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

export default SearchBar;
