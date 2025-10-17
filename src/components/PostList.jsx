import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import "../styles/RegisterForm.css";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.access_token;
  const userId = userData ? userData.id : null;
  const userRole = userData ? userData.role : null;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error(`Error al cargar posts: ${err.message}`);
    }
  };

  const toggleComments = (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComment((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Crear comentario
  const submitComment = async (postId) => {
    if (!token) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment_text: newComment[postId] }),
        }
      );

      if (res.ok) {
        toast.success("Comentario creado");
        fetchPosts();
        setNewComment((prev) => ({ ...prev, [postId]: "" }));
      } else {
        toast.error("No se pudo crear el comentario");
      }
    } catch (err) {
      toast.error(`Error en el servidor: ${err.message}`);
    }
  };

  // Eliminar post
  const deletePost = async (postId) => {
    if (!token) return toast.error("No autorizado");

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Post eliminado");
        fetchPosts();
      } else {
        toast.error("No autorizado o error al eliminar");
      }
    } catch (err) {
      toast.error(`Error en el servidor: ${err.message}`);
    }
  };

  // Eliminar comentario
  const deleteComment = async (commentId) => {
    if (!token) return toast.error("No autorizado");

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Comentario eliminado");
        fetchPosts();
      } else {
        toast.error("No autorizado o error al eliminar");
      }
    } catch (err) {
      toast.error(`Error en el servidor: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <ToastContainer />
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No hay posts disponibles</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>
              <strong>Autor:</strong> {post.author?.name || "Anónimo"}
            </p>

            {/* Botones editar/eliminar post */}
            {(userRole === "admin" || post.author?.id === userId) && (
              <div style={{ marginBottom: "0.5rem" }}>
                <Button
                  label="Eliminar Post"
                  className="p-button-danger p-button-sm"
                  onClick={() => deletePost(post.id)}
                />
              </div>
            )}

            <Button
              size="small"
              label={
                commentsVisible[post.id] ? "Ocultar Comentarios" : "Ver Comentarios"
              }
              onClick={() => toggleComments(post.id)}
              className="p-button-secondary"
            />

            {commentsVisible[post.id] && (
              <div style={{ marginTop: "1rem" }}>
                <h4>Comentarios</h4>
                {post.comments.length === 0 ? (
                  <p>No hay comentarios aún</p>
                ) : (
                  post.comments.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        borderTop: "1px dashed #ccc",
                        paddingTop: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p>{c.comentario}</p>
                      <p>
                        <strong>Autor:</strong> {c.author?.name || "Anónimo"}
                      </p>

                      {/* Botón eliminar comentario */}
                      {(userRole === "admin" ||
                        userRole === "moderator" ||
                        c.author?.id === userId) && (
                        <Button
                          label="Eliminar Comentario"
                          className="p-button-danger p-button-sm"
                          onClick={() => deleteComment(c.id)}
                        />
                      )}
                    </div>
                  ))
                )}

                {/* Input para nuevo comentario */}
                {token && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={newComment[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <Button
                      label="Comentar"
                      className="p-button-success"
                      onClick={() => submitComment(post.id)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
