import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, InputGroup, Button, Card } from 'react-bootstrap';
import NavbarComponent from '../Navbar';
import Footer from '../FooterComponent';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
const SchemeList = () => {
  const { category } = useParams();
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [filters, setFilters] = useState({
    gender: '',
    disability_required: '',
    occupation: '',
    eligible_castes: '',
    income_limit: '',
    required_education: ''
  });

  useEffect(() => {
    const fetchSchemas = async () => {
      const params = new URLSearchParams();
      if (category) params.append('department', category);
      if (searchQuery) params.append('search', searchQuery);
      if (sortOrder) params.append('sort', sortOrder);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.disability_required) params.append('disability_required', filters.disability_required);
      if (filters.occupation) params.append('occupation', filters.occupation);

      if (filters.eligible_castes) params.append('eligible_castes', filters.eligible_castes);
      if (filters.income_limit) params.append('income_limit', filters.income_limit);
      if (filters.required_education) params.append('required_education', filters.required_education)

      try {
        const res = await axios.get(`http://localhost:8000/api/schemes/?${params.toString()}`,
          { withCredentials: true });
        setSchemes(res.data);
      }
      catch (err) {
        console.error('Failed to fetch ', err)
      }
    }
    fetchSchemas();
  }, [category, searchQuery, sortOrder, filters]);

  // // const handleSearch = (e) => setSearchQuery(e.target.value);
  // // console.log(schemes)
  // // const handleSortToggle = () => {
  // //   const sorted = [...schemes].sort((a, b) => {
  // //     return sortOrder === 'A-Z'
  // //       ? a.title.localeCompare(b.title)
  // //       : b.title.localeCompare(a.title);
  // //   });
  // //   setSchemes(sorted);
  // //   setSortOrder(sortOrder === 'A-Z' ? 'Z-A' : 'A-Z');
  // // };

  // const filteredSchemes = schemes
  //   .filter(scheme => scheme.title.toLowerCase().includes(searchQuery.toLowerCase()))
  //   .filter(scheme => {
  //     return (!filters.gender || scheme.gender === filters.gender) &&
  //       (!filters.disability_required || scheme.disability_required === (filters.disability_required === 'true')) &&
  //       (!filters.employment_status || scheme.employment_status === filters.employment_status);
  //   });

  return (
    <>
      <NavbarComponent />
      <Container fluid className="mt-4">
        {/* Search Bar */}
        <Row className="mb-3 ">
          <Col md={12}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search scheme "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        <Row>
          {/* Left Filters Panel */}
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Filters</Card.Title>

                {/* Gender Filter */}
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select onChange={e => setFilters({ ...filters, gender: e.target.value })}>
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>

                {/* Disability Filter */}
                <Form.Group className="mb-3">
                  <Form.Label>Disability Required</Form.Label>
                  <Form.Select onChange={e => setFilters({ ...filters, disability_required: e.target.value })}>
                    <option value="">All</option>
                    <option value="Yes">Yes</option>
                    <option value="None">No</option>
                  </Form.Select>
                </Form.Group>

                {/* Employment Status */}
                <Form.Group className="mb-3">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Select onChange={e => setFilters({ ...filters, occupation: e.target.value })}>
                    <option value="">All</option>
                    <option value="student">Student</option>
                    <option value="farmer">Farmer</option>
                    <option value="teacher">Teacher</option>
                    <option value="government_employee">Government Employee</option>
                    <option value="private_employee">Private Sector Employee</option>
                    <option value="business">Business</option>
                    <option value="homemaker">Homemaker</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>



                {/* Eligible Castes */}
                <Form.Group className="mb-3">
                  <Form.Label>Eligible Caste</Form.Label>
                  <Form.Select onChange={e => setFilters({ ...filters, eligible_castes: e.target.value })}>
                    <option value="">All</option>
                    <option value="SCST">SC,ST</option>
                    <option value="OBC">OBC</option>
                    <option value="General">General</option>
                  </Form.Select>
                </Form.Group>

                {/* Income Limit */}
                <Form.Group className="mb-3">
                  <Form.Label>Income Limit</Form.Label>
                  <Form.Select onChange={e => setFilters({ ...filters, income_limit: e.target.value })}>
                    <option value="">All</option>
                    <option value="10000">Up to ₹10,000</option>
                    <option value="20000">Up to ₹20,000</option>
                    <option value="50000">Up to ₹50,000</option>
                    <option value="100000">Up to ₹1,00,000</option>
                  </Form.Select>
                </Form.Group>

                {/* Required Education */}
                <Form.Group className="mb-3">
                  <Form.Label>Required Education</Form.Label>
                  <Form.Select onChange={e => setFilters({ ...filters, required_education: e.target.value })}>
                    <option value="">All</option>
                    <option value="below_10">Below 10th</option>
                    <option value="10">10th</option>
                    <option value="12">12th</option>
                    <option value="diploma">Diploma</option>
                    <option value="ug">Undergraduate (UG)</option>
                    <option value="pg">Postgraduate (PG)</option>
                    <option value="phd">PhD / Doctorate</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

              </Card.Body>
            </Card>
          </Col>

          {/* Right Scheme List and Sorting */}
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Total Schemes: {schemes.length}</h5>
              <Button
                variant="outline-secondary"
                onClick={() => setSortOrder(prev => (prev === 'A-Z' ? 'Z-A' : 'A-Z'))}
              >
                Sort {sortOrder === 'A-Z' ? 'Z-A' : 'A-Z'}
              </Button>
            </div>

            <div>
              {schemes.map((scheme, idx) => (
                <Card key={idx} className="mb-3 text-start position-relative">
                  <Card.Body>
                    <Card.Title className='text-primary'>{scheme.title}</Card.Title>
                    <Card.Text>
                      {scheme.description}
                    </Card.Text>

                    <Link to={`/view-scheme/${scheme.id}`}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="position-absolute bottom-0 end-0 m-3 p-2"
                      >
                        <FaArrowRight />
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default SchemeList;
