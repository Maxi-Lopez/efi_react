// src/components/RegisterForm.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css"

// Validaciones
const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
})

export default function RegisterForm() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: "user" // el endpoint solo permite crear usuarios normales
                })
            })

            if (response.ok) {
                const data = await response.json()
                toast.success(`Usuario registrado correctamente (ID: ${data.user_id})`)
                resetForm()
                setTimeout(() => navigate('/'), 1500)
            } else {
                const errData = await response.json()
                toast.error(`Error al registrar: ${errData.error || 'Revisar los datos'}`)
            }
        } catch (error) {
            toast.error(`Error de servidor: ${error.message}`)
        }
    }

    return (
        <div className='register-container'>
            <h2>Crear cuenta</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Nombre</label>
                            <Field as={InputText} name='name' />
                            <ErrorMessage name='name' component='small' className='error' />
                        </div>
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
                            <Button type='submit' label={isSubmitting ? "Registrando..." : "Registrarse"} />
                            <Button type='button' label="Cancelar" className='p-button-secondary' onClick={() => navigate('/')} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
