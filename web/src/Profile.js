import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import EditableLabel from 'react-inline-edition'
import axios from 'axios'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            name: 'Placeholder Name',
            description: 'Placeholder Description',
            notificationPreference: 'Placeholder Notification',
            updated: false,
            err: '',
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        const uuid = this.props.uuid || 1
        axios.get(`/api/user?user=${uuid}`).then((resp) => {
            const data = resp.data
            delete data.uuid
            this.setState({ updated: false, ...data })
        })
    }

    handleSave(field, text) {
        this.setState({ [field]: text, updated: true })
        console.log(field, text)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state !== prevState && this.state.updated) {
            console.log(this.state)
            const body = {
                name: this.state.name,
                description: this.state.description,
                notificationPreference: this.state.notificationPreference,
            }
            // axios
            //     .put(`/api/user`, body)
            //     .then((resp) => {
            //         this.setState({ err: false })
            //     })
            //     .catch(() => {
            //         this.setState({ err: true })
            //     })
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
                            as="h5"
                            style={{ background: 'transparent' }}
                        >
                            Your Profile
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={4}>Name</Col>
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
                            <Row>
                                <Col xs={4}>Description</Col>
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
                            <Row>
                                <Col xs={4}>Notification Preference</Col>
                                <Col>
                                    <EditableLabel
                                        text={this.state.notificationPreference}
                                        inputClassName="input-notification"
                                        labelClassName="input-notification"
                                        inputMaxLength={50}
                                        onFocusOut={this.handleSave.bind(
                                            this,
                                            'notificationPreference'
                                        )}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }
}

export default Profile
