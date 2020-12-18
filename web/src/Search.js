import React, { Component } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

import axios from 'axios'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: this.props.match.params.keyword,
            hits: [],
            err: false,
        }
    }

    componentWillReceiveProps({ isLogin }) {
        this.setState({ keyword: this.props.match.params.keyword })
        this.fetchData()
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        this.setState({ err: false })
        const { keyword } = this.state
        axios
            .get('/api/search', {
                params: { keyword: encodeURIComponent(keyword) },
            })
            .then((resp) => {
                this.setState({ hits: [...resp.data] })
            })
            .catch((e) => {
                console.log(e)
                this.setState({ err: true })
            })
    }

    render() {
        return (
            <Container style={{ marginTop: 20 }} fluid="md">
                <div style={{ display: 'flex', margin: 20 }}>
                    <h4 className="ml-2">Search Results</h4>
                </div>
                {this.state.hits.length == 0 && (
                    <Alert variant="primary">We got nothing here.</Alert>
                )}
                {this.state.err && (
                    <Alert variant="warning">
                        {' '}
                        Oops, something went wrong. Try again later.{' '}
                    </Alert>
                )}
                <ListGroup>
                    {this.state.hits.map((hit) => (
                        <ListGroup.Item
                            as="div"
                            key={hit.blog}
                            style={{ border: 0 }}
                        >
                            <Card border="primary" style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>{hit.title}</Card.Title>
                                    <hr align="center" />
                                    <Card.Text
                                        dangerouslySetInnerHTML={{
                                            __html: hit.contents,
                                        }}
                                    ></Card.Text>
                                </Card.Body>
                                <Card.Footer
                                    className="text-muted"
                                    style={{ display: 'flex' }}
                                    variant="primary"
                                >
                                    <div>
                                        By (
                                        <Link to={`/user/${hit.author}`}>
                                            {hit.authorName}
                                        </Link>
                                        )
                                    </div>
                                </Card.Footer>
                            </Card>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        )
    }
}

export default Search
