import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron'
import { Link } from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: this.props.isLogin,
        }
    }

    onLogin(event) {
        event.preventDefault()
        console.log('clicked on login')
        let base_url = document.location.origin
        window.location.href = `${base_url}/login`
    }

    componentWillReceiveProps({ isLogin }) {
        this.setState({ isLoggedIn: isLogin })
    }

    render() {
        return (
            <Container style={{ marginTop: 50 }} fluid="md">
                {this.state.isLoggedIn && (
                    <Jumbotron>
                        <h1>Welcome to Blog.ly</h1>
                        <p>
                            Start exploring{' '}
                            <Link to={'/articles'}>all articles</Link>!
                        </p>
                    </Jumbotron>
                )}
                {!this.state.isLoggedIn && (
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
                )}
            </Container>
        )
    }
}

export default Login
