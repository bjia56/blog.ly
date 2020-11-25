import React, { Component } from 'react'
import MDEditor from '@uiw/react-md-editor'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import axios from 'axios'

class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            article: {
                title: '',
                contents: '',
            },
            err: '',
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    onTitleChange(event) {
        const { article } = this.state
        article.title = event.target.value
        this.setState({ article })
    }

    onContentChange(str) {
        const { article } = this.state
        article.contents = str
        this.setState({ article })
    }

    onSubmit(event) {
        event.preventDefault()
        let { id } = this.props.match.params
        const { article } = this.state
        axios
            .put(`/api/blogs/${id}`, article)
            .then((resp) => {
                this.setState({ err: false })
                alert('submission sucessful')
                this.props.history.push('/articles')
            })
            .catch(() => {
                this.setState({ err: true })
            })
    }

    onDelete(event) {
        event.preventDefault()
        let { id } = this.props.match.params
        if (!confirm('Are you sure you want to delete this blog post?')) {
            return
        }

        axios
            .delete(`/api/blogs/${id}`)
            .then((resp) => {
                this.setState({ err: false })
                alert('deletion successful')
                this.props.history.push('/articles')
            })
            .catch(() => {
                this.setState({ err: true })
            })
    }

    fetchData() {
        let { id } = this.props.match.params
        axios
            .get(`/api/blogs/${id}`)
            .then((resp) => {
                this.setState({ err: false })
                this.setState({ article: resp.data })
            })
            .catch(() => {
                this.setState({ err: true })
            })
    }

    render() {
        return (
            <Container style={{ marginTop: 20 }}>
                <Form>
                    {this.state.err && (
                        <Alert variant="warning">
                            {' '}
                            Oops, something went wrong. Try again later.{' '}
                        </Alert>
                    )}

                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your title"
                            value={this.state.article.title}
                            onChange={this.onTitleChange.bind(this)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formContents">
                        <Form.Label>Contents</Form.Label>
                        <MDEditor
                            value={this.state.article.contents}
                            onChange={this.onContentChange.bind(this)}
                        ></MDEditor>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={this.onSubmit.bind(this)}
                        style={{ margin: 5 }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        onClick={this.onDelete.bind(this)}
                        style={{ margin: 5 }}
                    >
                        Delete
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default Edit