// src/components/LoginForm.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css"

// Validación de campos
const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
})

export default function LoginForm() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                const data = await response.json()
                // Guardamos el token JWT en localStorage
                localStorage.setItem('token', data.access_token)
                toast.success("Inicio de sesión exitoso")
                resetForm()
                setTimeout(() => navigate('/dashboard'), 1500)
            } else {
                const errData = await response.json()
                toast.error(errData.error || "Credenciales inválidas")
            }
        } catch (error) {
            toast.error(`Error de servidor: ${error.message}`)
        }
    }

    return (
        <div className='register-container'>
            <h2>Iniciar sesión</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Email</label>
                            <Field as={InputText} name='email' />
                            <ErrorMessage name='email' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Contraseña</label>
                            <Field as={InputText} name='password' type='password' />
                            <ErrorMessage name='password' component='small' className='error' />
                        </div>
                        <div className='form-buttons' style={{ display: 'flex', gap: '1rem' }}>
                            <Button type='submit' label={isSubmitting ? "Ingresando..." : "Iniciar sesión"} className='p-button-secondary' />
                            <Button type='button' label='Cancelar' className='p-button-secondary' onClick={() => navigate('/')} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
