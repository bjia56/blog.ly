import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import axios from 'axios'

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            name: 'Placeholder Name',
            description: 'Placeholder Description',
            err: '',
            articles: [],
        }
    }

    componentDidMount() {
        this.fetchProfileData()
        this.fetchArticleData()
    }

    fetchProfileData() {
        let { id } = this.props.match.params
        axios.get(`/api/user?user=${id}`).then((resp) => {
            const data = resp.data
            delete data.uuid
            delete data.notificationPreference
            this.setState({ ...data })
        })
    }

    fetchArticleData() {
        const limit = 100
        const { id } = this.props.match.params
        axios
            .get(`/api/blogs?limit=${limit}&author=${id}`)
            .then((resp) => {
                let uuids = resp.data.uuids || []
                return Promise.all(
                    uuids.map((uuid) =>
                        axios
                            .get(`/api/blogs/${uuid}`)
                            .then((resp) => resp.data)
                    )
                )
            })
            .then((articles) => {
                this.setState({ articles })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    onFollow(event) {
        event.preventDefault()
        console.log('clicked on follow')
    }

    onUnfollow(event) {
        event.preventDefault()
        console.log('clicked on unfollow')
    }

    render() {
        return (
            <div id="user_profile">
                <Container style={{ maxWidth: 800, margin: 'auto' }}>
                    {this.state.err && (
                        <Alert variant="warning">
                            {' '}
                            Oops, something went wrong. Try again later.{' '}
                        </Alert>
                    )}
                    <Card body border="info" style={{ marginTop: 20 }}>
                        <Card.Header
                            as="h4"
                            style={{
                                display: 'flex',
                                background: 'transparent',
                            }}
                        >
                            {this.state.name}
                            <Button
                                onClick={this.onFollow.bind(this)}
                                style={{ marginLeft: 'auto' }}
                            >
                                Follow
                            </Button>
                        </Card.Header>
                        <Card.Body>{this.state.description}</Card.Body>
                    </Card>
                    <Card body border="info" style={{ marginTop: 20 }}>
                        <Card.Header
                            as="h4"
                            style={{
                                display: 'flex',
                                background: 'transparent',
                            }}
                        >
                            Articles by {this.state.name}
                        </Card.Header>
                        <ListGroup>
                            {this.state.articles.map((article) => (
                                <ListGroup.Item
                                    as="div"
                                    key={article.uuid}
                                    style={{ border: 0 }}
                                >
                                    <Card
                                        border="primary"
                                        style={{ width: '100%' }}
                                    >
                                        <Card.Body>
                                            <Card.Title>
                                                {article.title}
                                            </Card.Title>
                                            <hr align="center" />
                                            <Card.Text
                                                dangerouslySetInnerHTML={{
                                                    __html: article.rendered,
                                                }}
                                            ></Card.Text>
                                        </Card.Body>
                                        <Card.Footer
                                            className="text-muted"
                                            style={{ display: 'flex' }}
                                            variant="primary"
                                        >
                                            <div>
                                                By {article.authorName} on{' '}
                                                {new Date(
                                                    article.updated * 1000
                                                ).toLocaleDateString('en-US')}
                                            </div>
                                        </Card.Footer>
                                    </Card>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Container>
            </div>
        )
    }
}

export default User
