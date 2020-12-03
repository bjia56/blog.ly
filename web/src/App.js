import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Profile from './Profile'
import Articles from './Articles'
import Edit from './Edit'
import Login from './Login'
import axios from 'axios'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: true,
            user: {},
        }
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin() {
        axios
            .get('/api/user')
            .then((resp) => {
                console.log(resp)
                this.setState({
                    isLoggedIn: true,
                    user: {
                        uuid: resp.data.uuid,
                    },
                })
            })
            .catch((e) => {
                console.log(e)
                if (e.code == 401) {
                    this.setState({
                        isLoggedIn: false,
                    })
                }
            })
    }

    render() {
        // if (this.state.isLoggedIn) {
        //     console.log('logged in')
        //     console.log(this.props)
        //     console.log(history)
        //     return history.push('/#/articles')
        // }
        return (
            <div className="App">
                <Router>
                    {/* The Navbar is collapsible on smaller devices. Set the threshold with `expand` */}
                    <Navbar
                        bg="dark"
                        variant="dark"
                        collapseOnSelect
                        expand="lg"
                    >
                        <Navbar.Brand href="#home">Blog.ly</Navbar.Brand>
                        {/* Navbar.Toggle is needed for Collapse to work. */}
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        {/* Navbar.Collapse demarcates the collapsible components */}
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                {/* These links are placeholders for now, will be modified once React Router is set up */}
                                <Nav.Link href="#">Home</Nav.Link>
                                <Nav.Link as={Link} to="/articles">
                                    Articles
                                </Nav.Link>
                                <Nav.Link as={Link} to="/profile">
                                    My Profile
                                </Nav.Link>
                            </Nav>
                            <Form inline>
                                <FormControl
                                    type="text"
                                    placeholder="Search"
                                    className="mr-sm-2"
                                />
                                <Button variant="outline-info">Search</Button>
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>

                    <Switch>
                        <Route
                            path="/profile"
                            render={(props) => {
                                return this.state.isLoggedIn ? (
                                    <Profile
                                        uuid={this.state.user.uuid}
                                        {...props}
                                    />
                                ) : (
                                    <Redirect to="/loginPage" />
                                )
                            }}
                        ></Route>
                        <Route
                            path="/articles"
                            render={(props) => {
                                return this.state.isLoggedIn ? (
                                    <Articles {...props} />
                                ) : (
                                    <Redirect to="/loginPage" />
                                )
                            }}
                        ></Route>
                        <Route
                            path="/edit/:id"
                            render={(props) => {
                                return this.state.isLoggedIn ? (
                                    <Edit {...props} />
                                ) : (
                                    <Redirect to="/loginPage" />
                                )
                            }}
                        ></Route>
                        <Route path="/loginPage" component={Login}></Route>
                        <Route exact path="/login" />
                        <Route
                            exact
                            path="/"
                            render={(props) => {
                                return this.state.isLoggedIn ? (
                                    <Profile
                                        uuid={this.state.user.uuid}
                                        {...props}
                                    />
                                ) : (
                                    <Redirect to="/loginPage" />
                                )
                            }}
                        ></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App
