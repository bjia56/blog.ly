import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
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
            following: false,
        }
    }

    componentDidMount() {
        this.fetchProfileData()
        this.fetchArticleData()
        this.fetchFollowingData()
    }

    fetchFollowingData() {
        this.setState({ err: false })
        axios
            .get(`/api/follow`)
            .then((resp) => {
                console.log(resp.data.following)
                let { id } = this.props.match.params
                if (resp.data.following.includes(parseInt(id))) {
                    this.setState({ following: true })
                } else {
                    this.setState({ following: false })
                }
            })
            .catch((e) => {
                this.setState({ err: true })
            })
    }

    fetchProfileData() {
        this.setState({ err: false })
        let { id } = this.props.match.params
        axios
            .get(`/api/user?user=${id}`)
            .then((resp) => {
                const data = resp.data
                delete data.notificationPreference
                this.setState({ ...data })
            })
            .catch(() => {
                this.setState({ err: true })
            })
    }

    fetchArticleData() {
        const limit = 100
        const { id } = this.props.match.params
        this.setState({ err: false })
        axios
            .get(`/api/blogs?limit=${limit}&author=${id}`)
            .then((resp) => {
                let uuids = resp.data.uuids
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
                this.setState({ err: true })
            })
    }

    onFollow(user, event) {
        event.preventDefault()
        console.log('clicked on follow')
        axios
            .post(`/api/follow?user=${user}`)
            .then((resp) => {
                this.setState({ following: true })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    onUnfollow(user, event) {
        event.preventDefault()
        console.log('clicked on unfollow')
        axios
            .delete(`/api/follow?user=${user}`)
            .then((resp) => {
                this.setState({ following: false })
            })
            .catch((e) => {
                console.log(e)
            })
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
                            {this.state.following && (
                                <Button
                                    onClick={this.onUnfollow.bind(
                                        this,
                                        this.state.uuid
                                    )}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Unfollow
                                </Button>
                            )}
                            {!this.state.following && (
                                <Button
                                    onClick={this.onFollow.bind(
                                        this,
                                        this.state.uuid
                                    )}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Follow
                                </Button>
                            )}
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
