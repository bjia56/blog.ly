import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron'
import { Redirect } from 'react-router-dom'

class Login extends Component {
    onLogin(event) {
        event.preventDefault()
        console.log('clicked on login')
        window.location.href = 'http://localhost:3000/login'
        // return <Redirect to="/login" />
    }

    render() {
        return (
            <Container style={{ marginTop: 50 }} fluid="md">
                <Jumbotron>
                    <h1>Welcome to Blog.ly</h1>
                    <p>Login with your columbia.edu email!</p>
                    <p>
                        <Button
                            variant="primary"
                            onClick={this.onLogin.bind(this)}
                        >
                            Login
                        </Button>
                    </p>
                </Jumbotron>
            </Container>
        )
    }
}

export default Login
