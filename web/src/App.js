import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

class App extends Component {
    render() {
        return (
            <div className="App">
                {/* The Navbar is collapsible on smaller devices. Set the threshold with `expand` */}
                <Navbar bg="dark" variant="dark" collapseOnSelect expand="lg">
                    <Navbar.Brand href="#home">Blog.ly</Navbar.Brand>
                    {/* Navbar.Toggle is needed for Collapse to work. */}
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    {/* Navbar.Collapse demarcates the collapsible components */}
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            {/* These links are placeholders for now, will be modified once React Router is set up */}
                            <Nav.Link href="#">Home</Nav.Link>
                            <Nav.Link href="#">My Blog</Nav.Link>
                            <Nav.Link href="#">My Profile</Nav.Link>
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
            </div>
        )
    }
}

export default App
