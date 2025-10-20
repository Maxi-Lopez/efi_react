// src/components/RegisterForm.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../api'  
import "../styles/RegisterForm.css"

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required")
})

export default function RegisterForm() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const data = await api.post('/register', {
                name: values.name,
                email: values.email,
                password: values.password,
                role: "user"  
            })

            toast.success(`User registered successfully (ID: ${data.user_id})`)
            resetForm()
            setTimeout(() => navigate('/'), 1500)
            
        } catch (error) {
            toast.error(`Error registering: ${error.message}`)
        }
    }

    return (
        <div className='register-container'>
            <h2>Create Account</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Name</label>
                            <Field as={InputText} name='name' />
                            <ErrorMessage name='name' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Email</label>
                            <Field as={InputText} name='email' />
                            <ErrorMessage name='email' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Password</label>
                            <Field as={InputText} name='password' type='password' />
                            <ErrorMessage name='password' component='small' className='error' />
                        </div>
                        <div className='form-buttons' style={{ display: 'flex', gap: '1rem' }}>
                            <Button 
                                type='submit' 
                                label={isSubmitting ? "Registering..." : "Register"} 
                                disabled={isSubmitting}
                            />
                            <Button 
                                type='button' 
                                label="Cancel" 
                                className='p-button-secondary' 
                                onClick={() => navigate('/')} 
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}