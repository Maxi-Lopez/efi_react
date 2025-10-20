import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export default function CreateCategory() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("You must be logged in to create a category");
        navigate("/login");
        return;
      }

      const res = await api.post("/categories", { name }, token);
      
      toast.success("Category created successfully!");
      
      const categoryId = res.id || res.data?.id || res.category_id;
      navigate(`/posts/create/${categoryId}`);
      
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(`Error creating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Category name
          </label>
          <input
            type="text"
            placeholder="Ex: Technology, Sports, Cooking..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={2}
            maxLength={50}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex-1"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}