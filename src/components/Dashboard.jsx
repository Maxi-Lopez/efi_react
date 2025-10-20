// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { toast } from "react-toastify";
import api from "../api";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.get("/categories", token);
      
      console.log("Response from /categories:", data);
      
      setCategories(data);
    } catch (error) {
      toast.error("Error loading categories");
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!selectedCategory) {
      toast.warning("Please select a category first");
      return;
    }
    navigate(`/posts/create/${selectedCategory.id}`);
  };

  const handleCreateCategory = () => {
    navigate("/categories/create");
  };

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <Button 
        label="Create Category" 
        icon="pi pi-plus" 
        onClick={handleCreateCategory}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        {header}
        <div className="text-center py-8">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <p className="mt-2">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card header={header} className="shadow-lg">
        <div className="grid">
          <div className="col-12 md:col-8">
            <h3 className="text-xl font-semibold mb-4">Select a Category</h3>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <i className="pi pi-inbox text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">No categories available</p>
                <Button 
                  label="Create First Category" 
                  className="mt-3" 
                  onClick={handleCreateCategory}
                />
              </div>
            ) : (
              <div className="grid gap-3">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className={`p-4 border-round cursor-pointer transition-colors transition-duration-200 ${
                      selectedCategory?.id === category.id 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-100 border-1 border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex align-items-center">
                      <i className="pi pi-folder text-xl mr-3"></i>
                      <div>
                        <h4 className="font-bold mb-1">
                          {category.name || `Category ${category.id}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ID: {category.id}
                        </p>
                      </div>
                      {selectedCategory?.id === category.id && (
                        <i className="pi pi-check ml-auto text-green-500"></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-12 md:col-4">
            <div className="p-4 bg-gray-50 border-round">
              <h4 className="font-bold mb-4">Actions</h4>
              
              <div className="flex flex-column gap-3">
                <Button 
                  label="Create Post in Selected Category" 
                  icon="pi pi-plus" 
                  disabled={!selectedCategory}
                  onClick={handleCreatePost}
                  className="w-full"
                />
                
                <Button 
                  label="Create New Category" 
                  icon="pi pi-folder-plus" 
                  className="p-button-outlined w-full"
                  onClick={handleCreateCategory}
                />

                <div className="mt-4 p-3 bg-blue-50 border-round">
                  <h5 className="font-bold mb-2">Selected Category:</h5>
                  {selectedCategory ? (
                    <div className="flex align-items-center">
                      <i className="pi pi-folder mr-2"></i>
                      <span>{selectedCategory.name || `Category ${selectedCategory.id}`}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">None selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-content-between mt-6 pt-4 border-top-1 border-gray-200">
          <Button 
            label="Back to Home" 
            icon="pi pi-home" 
            className="p-button-secondary"
            onClick={() => navigate("/")}
          />
          
          <div className="flex gap-2">
            <Button 
              label="Reload Categories" 
              icon="pi pi-refresh" 
              className="p-button-outlined"
              onClick={loadCategories}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}