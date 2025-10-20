// src/components/CreatePost.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export default function CreatePost() {
  const { categoryId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get(`/categories/${categoryId}`, token)
      .then((res) => {
        setCategoryName(res.name || "Category");
      })
      .catch((error) => {
        console.error("Error loading category:", error);
        setCategoryName("Unknown category");
      });
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("You must be logged in to create a post");
        navigate("/login");
        return;
      }

      const postData = {
        title: title,
        content: content,
        category_id: parseInt(categoryId)
      };

      console.log("Sending post data:", postData);

      await api.post("/posts", postData, token);

      toast.success("Post created successfully!");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(`Error creating post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Create Post in <span className="text-blue-600">{categoryName}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            placeholder="Write the post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={10}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}