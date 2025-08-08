import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Card,
} from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import NavbarComponent from '../Navbar';
import Footer from '../FooterComponent';

const Bookmark = () => {
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z');

  useEffect(() => {
    const fetchSchemes = async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (sortOrder) params.append('sort', sortOrder);

      try {
        const res = await axios.get(
          `http://localhost:8000/api/bookmark-view/?${params.toString()}`,
          { withCredentials: true }
        );
        setSchemes(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Failed to fetch schemes', err);
      }
    };

    fetchSchemes();
  }, [ searchQuery, sortOrder]);
  
  
  return (
    <>
      <NavbarComponent />

      <Container className="mt-4">
        <Row className="align-items-center mb-4">
          <Col md={8}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4} className="text-md-end mt-2 mt-md-0">
            <Button
              variant="outline-secondary"
              onClick={() =>
                setSortOrder((prev) => (prev === 'A-Z' ? 'Z-A' : 'A-Z'))
              }
            >
              Sort {sortOrder === 'A-Z' ? 'Z-A' : 'A-Z'}
            </Button>
          </Col>
        </Row>

        <h5 className="mb-3">
          Total Schemes: <strong>{schemes.length}</strong>
        </h5>

        <Row>
          {schemes.map((scheme, idx) => (
            <Col md={6} lg={4} key={idx} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{scheme.title}</Card.Title>
                  <Card.Text className="text-muted" style={{ fontSize: '0.95rem' }}>
                    {scheme.description.length > 100
                      ? scheme.description.slice(0, 100) + '...'
                      : scheme.description}
                  </Card.Text>

                  <div className="d-flex justify-content-end">
                    <Link to={`/view-scheme/${scheme.scheme}`}>
                      <Button variant="outline-primary" size="sm">
                        <FaArrowRight className="me-1" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default Bookmark;
