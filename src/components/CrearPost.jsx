import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/RegisterForm.css";

const validationSchema = Yup.object({
  title: Yup.string().required("El título es obligatorio"),
  content: Yup.string().required("El contenido es obligatorio"),
});

export default function CreatePost() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Debes iniciar sesión");
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviamos el JWT
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Post creado con éxito");
        resetForm();
        console.log(data);
      } else if (response.status === 403) {
        toast.error("No autorizado");
      } else {
        toast.error("Error al crear el post");
      }
    } catch (err) {
      toast.error(`Error en el servidor: ${err.message}`);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <h2>Crear Post</h2>
      <Formik
        initialValues={{ title: "", content: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <div className="form-field">
              <label>Título</label>
              <Field as={InputText} id="title" name="title" />
              <ErrorMessage name="title" component="small" className="error" />
            </div>
            <div className="form-field">
              <label>Contenido</label>
              <Field as="textarea" id="content" name="content" rows="5" />
              <ErrorMessage
                name="content"
                component="small"
                className="error"
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                type="submit"
                label={isSubmitting ? "Creando..." : "Crear Post"}
              />
              <Button
                type="button"
                label="Cancelar"
                className="p-button-secondary"
                onClick={() => navigate("/dashboard")}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
