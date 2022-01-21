import React from 'react'
import { Formik, Field, Form, FormikProps } from 'formik';
import * as Yup from 'yup'
import { useRegisterMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';

interface IRegisterForm {
    email: string;
    username: string;
    password: string;
    confirmPassword: string
}


export const Register: React.FC<IRegisterForm & RouteComponentProps> = ({history}) => {
    const [register] = useRegisterMutation();

    const initialValues = {
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    }

    const validation = Yup.object().shape({
        email: Yup.string().email().required('Please enter a valid email'),
        username: Yup.string().required('Please enter a username between 3-20 characters').min(3, "Username must be 3 characters minimum").max(20, "Too Long!"),
        password: Yup.string()
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
                )
                .required(
                    'Please valid password. One uppercase, one lowercase, one special character and no spaces'
                ),
        confirmPassword: Yup.string()
            .required('Required')
            .test('password-match','Password must match', function (value) {
                    return this.parent.password === value
                })
    })

    return (
        <div>
        <h1>Signup</h1>
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                    setSubmitting(true)
                    await register({variables: values })
                    resetForm()
                } catch (error) {
                    setSubmitting(false)
                    console.log(error)
                }
            }}
            validationSchema={validation}
        >

        {(props: FormikProps<IRegisterForm>) => {
            const {
                values,
                handleSubmit
        } = props
        
        return (
            <Form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>  
                <Field
                    id="email"
                    name="email"
                    placeholder="john@acme.com"
                    type="email"
                    value={values.email}
                />
                <label htmlFor="username">Username</label>
                <Field id="username" name="username" placeholder="Boopeep" value={values.username}/>

                <label htmlFor="password">Password</label>
                <Field id="password" name="password" type="password" value={values.password} />

                <label htmlFor="password">Confirm Password</label>
                <Field id="confirmPassword" name="confirmPassword" type="password" value={values.confirmPassword} />

                <button type="submit">Submit</button>
            </Form>
        )}}
        </Formik>
        </div>
    )
}