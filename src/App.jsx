// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import CreatePost from "./components/CreatePost";
import ProtectedRoute from "./components/ProtectedRoute";
import SelectCategory from "./components/SelectCategory";
import CreateCategory from "./components/CreateCategory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/select"
          element={
            <ProtectedRoute>
              <SelectCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/create"
          element={
            <ProtectedRoute>
              <CreateCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/create/:categoryId"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}