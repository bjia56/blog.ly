import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import EditableLabel from 'react-inline-editing'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            name: 'Placeholder Name',
            description: 'Placeholder Description',
            notificationPreference: 'Placeholder Notification',
        }
    }

    handleSave(field, text) {
        this.setState({ [field]: text })
        console.log(field, text)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state !== prevState) {
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
