import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api'

export default function SelectCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res))
      .catch(() => alert("Error loading categories"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Select Category</h2>

      <ul className="mb-4 space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            onClick={() => navigate(`/posts/create/${cat.id}`)}
            className="border p-2 rounded cursor-pointer hover:bg-gray-100"
          >
            {cat.name}
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/categories/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create new category
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}