import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registrarse" element={<RegisterForm />} />
      <Route path="/loguearse" element={<LoginForm />} />
    </Routes>
  );
}
