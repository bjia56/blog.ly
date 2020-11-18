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
            // upload the change to server
        }
    }

    render() {
        return (
            <div id="profile">
                <Container style={{ maxWidth: 800, margin: 'auto' }}>
                    <Card body style={{ marginTop: 20 }}>
                        <Row>
                            <Col xs={2}>Name</Col>
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
                            <Col xs={2}>Description</Col>
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
                            <Col xs={2}>Notification Preference</Col>
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
                    </Card>
                </Container>
            </div>
        )
    }
}

export default Profile
