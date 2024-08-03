import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from '../BusinessUser/Topbar';
import Footer from "../Landing/Footer";
import axios from 'axios';
import { getHeaders } from '../../../apiUtils';

const BU_ViewObjectsInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tagsList, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tagName, setTagNames] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [productDesc, setProductDesc] = useState("");

  const { id, name, categoryID, product_description, tags, objURL } = location.state || {};

  useEffect(() => {
    setProductDesc(product_description);
    fetchCategoriesAndTags();
  });

  const fetchCategoriesAndTags = async () => {
    try {
      const headers = getHeaders();
      const categoriesResponse = await axios.post('https://api.sensespacesplanningtool.com/category/list', {}, { headers });
      const tagsResponse = await axios.post('https://api.sensespacesplanningtool.com/tag/list', {}, { headers });
  
      const categories = categoriesResponse.data.body;
      const tagList = tagsResponse.data.body;
  
      setCategories(categories);
      setTags(tagList);
  
      const category = categories.find(cat => cat.id === categoryID[0]);
      const categoryName = category ? category.name : 'Unknown Category';
      setCategoryName(categoryName);

      const tagNames = tags.map(tagID => {
        const tag = tagList.find(t => t.id === tagID);
        return tag ? tag.name : 'Unknown Tag';
      });
      setTagNames(tagNames);
  
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
    }
  };

  const updateObjectInfo = () => {
    navigate('/BU_UpdateObjectInfo', {
      state: {
        id,
        name,
        categoryID,
        productDesc,
        tags,
        objURL
      }
    });
  };

  return (
      <div>
          <Topbar title="View Object Information" onClick={() => navigate(-3)} />
          <div className="mt-8 flex flex-col items-center">
              <form className="w-3/4">
                  <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-right self-center font-semibold">
                          <label htmlFor="objectName">Object Name:</label>
                      </div>
                      <div className="col-span-3">
                          <input
                              type="text"
                              className="border border-gray-400 w-full py-1 px-2 rounded"
                              value={name}
                              readOnly
                          />
                      </div>
                      <div className="col-span-1 text-right self-center font-semibold">
                          <label htmlFor="objectCat">Category:</label>
                      </div>
                      <div className="col-span-3">
                          <input
                              type="text"
                              className="border border-gray-400 w-full py-1 px-2 rounded"
                              value={categoryName}
                              readOnly
                          />
                      </div>
                      <div className="col-span-1 text-right self-center font-semibold">
                          <label htmlFor="tags">Tags:</label>
                      </div>
                      <div className="col-span-3">
                          <input
                              type="text"
                              className="border border-gray-400 w-full py-1 px-2 rounded"
                              value={tagName.join(", ")}
                              readOnly
                          />
                      </div>
                      <div className="col-span-2 flex justify-center font-semibold">
                          <span className="self-end">Product Description</span>
                      </div>
                      <div className="col-span-2 flex justify-center font-semibold">
                          <div className="flex">
                              <span className="self-end">Object Preview</span>
                          </div>
                      </div>
                      <div className="col-span-2 mx-8 -translate-y-4">
                          <textarea
                              className="bg-white h-40 rounded-md p-4 border border-gray-400 w-full"
                              value={productDesc}
                              readOnly
                              rows="4"
                          />
                      </div>
                      <div className="col-span-2 mx-8 -translate-y-4 rounded-md border border-gray-400">
                          <img src={objURL} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                      </div>
                      <div className="col-span-4 flex justify-center">
                          <button
                              type="button"
                              onClick={updateObjectInfo}
                              className="max-w-min text-nowrap bg-blue-500 px-8 py-2 text-white mt-5 uppercase rounded"
                          >
                              Edit
                          </button>
                      </div>
                  </div>
              </form>
          </div>
          <Footer />
      </div>
  );
};

export default BU_ViewObjectsInfo;