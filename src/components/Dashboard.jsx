// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { toast } from "react-toastify";
import api from "../api";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadCategories();
  }, []);

  const loadUser = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get("/categories", { headers });
      setCategories(response.data || response);
    } catch (error) {
      toast.error("Error loading categories");
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPostsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${categoryId}/posts`);
      setPosts(response.data || response);
    } catch (error) {
      toast.error("Error loading posts for this category");
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    loadPostsByCategory(category.id);
  };

  const handleCreatePost = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to create a post");
      navigate("/login");
      return;
    }
    if (!selectedCategory) {
      toast.warning("Please select a category first");
      return;
    }
    navigate(`/posts/create/${selectedCategory.id}`);
  };

  const handleCreateCategory = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to create a category");
      navigate("/login");
      return;
    }
    navigate("/categories/create");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <i className="pi pi-spin pi-spinner text-4xl"></i>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header fijo */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {!user ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  label="Register"
                  className="p-button-outlined p-button-secondary"
                  onClick={() => navigate("/register")}
                />
                <Button
                  label="Login"
                  className="p-button-success"
                  onClick={() => navigate("/login")}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span className="font-medium text-gray-700">
                  Hello, {user.username}
                </span>
                <Button
                  icon="pi pi-sign-out"
                  label="Logout"
                  className="p-button-outlined p-button-danger p-button-sm"
                  onClick={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ marginTop: "100px", padding: "1.5rem" }}>
        <Card className="shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Categories</h3>

          {categories.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No categories available</p>
              {user && (
                <Button
                  label="Create Category"
                  icon="pi pi-folder-plus"
                  className="mt-3"
                  onClick={handleCreateCategory}
                />
              )}
            </div>
          ) : (
            <div className="grid gap-3 mb-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 border-round cursor-pointer transition-colors ${
                    selectedCategory?.id === category.id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border-1 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex align-items-center justify-content-between">
                    <div className="flex align-items-center gap-2">
                      <i className="pi pi-folder"></i>
                      <span>{category.name}</span>
                    </div>
                    {selectedCategory?.id === category.id && (
                      <i className="pi pi-check text-green-500"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mostrar posts solo si se seleccionó una categoría */}
          {selectedCategory && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">
                Posts in "{selectedCategory.name}"
              </h3>
              {posts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    No posts in this category yet
                  </p>
                  {user && (
                    <Button
                      label="Create Post"
                      icon="pi pi-plus"
                      onClick={handleCreatePost}
                      className="mt-3"
                    />
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {posts.map((post) => (
                    <Card key={post.id} className="mb-3">
                      <h4 className="font-bold mb-1">{post.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {post.content}
                      </p>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span>By: {post.author?.username || "Unknown"}</span>
                        <span>•</span>
                        <span>Category: {post.category?.name}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Acciones adicionales si está logueado */}
          {user && (
            <div className="flex justify-content-end gap-2 mt-6 border-top-1 pt-4 border-gray-200">
              <Button
                label="Create Category"
                icon="pi pi-folder-plus"
                className="p-button-outlined"
                onClick={handleCreateCategory}
              />
              <Button
                label="Create Post"
                icon="pi pi-plus"
                onClick={handleCreatePost}
                disabled={!selectedCategory}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
