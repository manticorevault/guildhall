import React, { useState } from "react"
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

function Register() {

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            console.log(result)
        },
        variables: values 
    })

    const onSubmit = (event) => {
        event.preventDefault();
        addUser()
    }



    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate>
                <h1>
                    Register
                </h1>

                <Form.Input
                    label="Username"
                    placeholder="Add your username"
                    name="username"
                    type="text"
                    value={values.username}
                    onChange={onChange}
                />

                <Form.Input
                    label="Email"
                    placeholder="Add your email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={onChange}
                />

                <Form.Input
                    label="password"
                    placeholder="Add your password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={onChange}
                />

                <Form.Input
                    label="Confirm password"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Register
                </Button>

            </Form>
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username,
                email: $email,
                password: $password,
                confirmPassword: $confirmPassword
            }
        ) {
            id email username createdAt token
        }
    }
`

export default Register;