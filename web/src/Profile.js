import React, { Component } from 'react'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import EditableLabel from 'react-inline-edition'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import axios from 'axios'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            name: 'Placeholder Name',
            description: 'Placeholder Description',
            phone: 'Placeholder Phone',
            notificationPreference: 'instant',
            updated: false,
            err: false,
            articles: [],
            following: [],
            followers: [],
        }
    }

    componentDidMount() {
        this.fetchProfileData()
        this.fetchArticleData()
        this.fetchFollowData()
    }

    fetchFollowData() {
        this.setState({ err: false })
        // TODO fix this
        axios
            .get(`/api/follow`)
            .then((resp) =>
                Promise.all([
                    ...resp.data.following.map((uuid) =>
                        axios
                            .get(`/api/user?user=${uuid}`)
                            .then((resp) => resp.data)
                    ),
                    ...resp.data.followers.map((uuid) =>
                        axios
                            .get(`/api/user?user=${uuid}`)
                            .then((resp) => resp.data)
                    ),
                ])
            )
            .then((users) => {
                console.log(users)
                users[0].then((following) => this.setState({ following }))
                users[1].then((followers) => this.setState({ followers }))
            })
            .catch((e) => {
                console.log(e)
                this.setState({ err: true })
            })
    }

    fetchProfileData() {
        this.setState({ err: false })
        axios
            .get(`/api/user`)
            .then((resp) => {
                const data = resp.data
                if (!data.phone) {
                    data.phone = ''
                }
                delete data.uuid
                this.setState({ updated: false, ...data })
            })
            .catch((e) => {
                console.log(e)
                this.setState({ err: true })
            })
    }

    fetchArticleData() {
        const limit = 100
        const author = this.props.uuid
        this.setState({ err: false })
        axios
            .get(`/api/blogs?limit=${limit}&author=${author}`)
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
                this.setState({ err: true })
            })
    }

    handleSave(field, text) {
        if (field == 'phone') {
            const regex = /[\+][\d]{11}/gm
            if (text.match(regex)) {
                this.setState({ [field]: text, updated: true })
                return
            } else {
                alert(
                    `Invalid phone number format. Phone number format must be "+1XXXXXXXXX"`
                )
                this.props.history.push('/profile')
                return
            }
        }
        this.setState({ [field]: text, updated: true })
        console.log(field, text)
    }

    handleSelect(eventKey, event) {
        // event.preventDefault()
        this.setState({ notificationPreference: eventKey, updated: true })
        console.log(eventKey, event)
    }

    onNewArticle(event) {
        event.preventDefault()
        this.setState({ err: false })
        axios
            .post('/api/blogs')
            .then((resp) => {
                const { uuid } = resp.data
                console.log('New Post uuid', uuid)
                this.props.history.push(`/edit/${uuid}`)
            })
            .catch((e) => {
                this.setState({ err: true })
            })
    }

    onUserClick(event) {
        console.log(event)
        this.props.history.push(`/user/${event}`)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state !== prevState && this.state.updated) {
            this.setState({ updated: false })
            const body = {
                name: this.state.name,
                description: this.state.description,
                notificationPreference: this.state.notificationPreference,
                phone: this.state.phone,
            }
            console.log(body)
            axios
                .put(`/api/user`, body)
                .then((resp) => {
                    this.setState({ err: false })
                })
                .catch(() => {
                    this.setState({ err: true })
                })
        }
    }

    render() {
        return (
            <div id="profile">
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
                                background: 'transparent',
                                display: 'flex',
                            }}
                        >
                            <Col md={4}>My Profile</Col>
                            <Col md={{ span: 2, offset: 4 }}>
                                <DropdownButton
                                    id="dropdown-followers"
                                    title="Followers"
                                >
                                    {this.state.followers.map((user) => (
                                        <Dropdown.Item
                                            key={user.uuid}
                                            eventKey={user.uuid}
                                            onClick={this.onUserClick.bind(
                                                this,
                                                user.uuid
                                            )}
                                        >
                                            {user.name}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                            <Col md={2}>
                                <DropdownButton
                                    id="dropdown-following"
                                    title="Following"
                                >
                                    {this.state.following.map((user) => (
                                        <Dropdown.Item
                                            eventKey={user.uuid}
                                            key={user.uuid}
                                            onClick={this.onUserClick.bind(
                                                this,
                                                user.uuid
                                            )}
                                        >
                                            {user.name}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                        </Card.Header>
                        <Card.Body>
                            <Row className="my-1">
                                <Col xs={4} className="font-weight-bold">
                                    Name
                                </Col>
                                <Col>
                                    <EditableLabel
                                        text={this.state.name}
                                        inputClassName="input-name"
                                        labelClassName="input-name"
                                        inputMaxLength={50}
                                        onFocusOut={this.handleSave.bind(
                                            this,
                                            'name'
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="my-1">
                                <Col xs={4} className="font-weight-bold">
                                    Email
                                </Col>
                                <Col>{this.state.email}</Col>
                            </Row>
                            <Row className="my-1">
                                <Col xs={4} className="font-weight-bold">
                                    Description
                                </Col>
                                <Col>
                                    <EditableLabel
                                        text={this.state.description}
                                        inputClassName="input-description"
                                        labelClassName="input-description"
                                        inputMaxLength={50}
                                        onFocusOut={this.handleSave.bind(
                                            this,
                                            'description'
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="my-1">
                                <Col xs={4} className="font-weight-bold">
                                    Phone Number
                                </Col>
                                <Col>
                                    <EditableLabel
                                        text={this.state.phone}
                                        inputClassName="input-phone"
                                        labelClassName="input-phone"
                                        inputMaxLength={50}
                                        onFocusOut={this.handleSave.bind(
                                            this,
                                            'phone'
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="my-1">
                                <Col xs={4} className="font-weight-bold">
                                    Notification Preference
                                </Col>
                                <Col>
                                    <DropdownButton
                                        id="dropdown-notification"
                                        title={
                                            this.state.notificationPreference
                                        }
                                        variant="outline-info"
                                        onSelect={this.handleSelect.bind(this)}
                                    >
                                        <Dropdown.Item eventKey="instant">
                                            Instant
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="hourly">
                                            Hourly
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="daily">
                                            Daily
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card body border="info" style={{ marginTop: 20 }}>
                        <Card.Header
                            as="h4"
                            style={{
                                display: 'flex',
                                background: 'transparent',
                            }}
                        >
                            My Articles
                            <Button
                                onClick={this.onNewArticle.bind(this)}
                                style={{ marginLeft: 'auto' }}
                            >
                                New
                            </Button>
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
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Link
                                                    to={`/edit/${article.uuid}`}
                                                >
                                                    Edit
                                                </Link>
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

export default Profile
