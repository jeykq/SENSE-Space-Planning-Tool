import React, { useRef, useEffect, useState } from "react";
import Swiper from "swiper";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import Footer from "../Landing/Footer";

const SystemAdminHomepage = () => {
  const swiperContainer1 = useRef(null);
  const swiperContainer2 = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (swiperContainer1.current) {
      new Swiper(swiperContainer1.current, {
        slidesPerView: 3,
        spaceBetween: 20,
      });
    }

    if (swiperContainer2.current) {
      new Swiper(swiperContainer2.current, {
        slidesPerView: 3,
        spaceBetween: 20,
      });
    }

    const handleScroll = () => {
      if (showDropdown) {
        const rect = swiperContainer2.current.getBoundingClientRect();
        setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showDropdown]);

  const toggleDropdown = (event) => {
    setShowDropdown(!showDropdown);
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div style={{ paddingTop: "30px", paddingLeft: "20px", fontSize: "20px", fontWeight: "500", display: "flex", alignItems: "center" }}>
        <div className={"mt-20 ml-5"}>
          <p>Search Users</p>
        </div>
        <div style={{ marginTop: "80px", marginLeft: "20px" }}>
          <SearchBar />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default SystemAdminHomepage;