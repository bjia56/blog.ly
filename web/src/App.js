import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Profile from './Profile'
import Articles from './Articles'
import Edit from './Edit'

class App extends Component {
    render() {
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
                        <Route path="/profile">
                            <Profile />
                        </Route>
                        <Route path="/articles" component={Articles}></Route>
                        <Route path="/edit/:id" component={Edit}></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App
