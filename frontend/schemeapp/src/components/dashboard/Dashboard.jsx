import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card ,Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {  FaSearch , FaLeaf, FaBook, FaStethoscope, FaTools, FaHome, FaArrowRight,FaUserEdit, FaClipboardCheck, FaRegBell } from 'react-icons/fa';
import Carousel from 'react-bootstrap/Carousel';
import frame1 from '../../images/hand-holding-red-icon.jpg'
import frame2 from '../../images/so-many-vegetables-this-field.jpg'
import frame3 from '../../images/two-students-studying-together-online-with-laptop-park.jpg'
import CountUp from 'react-countup';
import axios from 'axios';

import { useEffect, useState } from 'react';
import NavbarComponent from '../Navbar';
import Footer from '../FooterComponent';
function Dashboard() {
    const [user , setUser] = useState(0)
    const [show,setShow] = useState(false)
    const [scheme,setScheme] = useState(0)
    const [isComplete,setComplete] = useState(true)
    const [schemeCategories,setSchemeCategories] = useState([])
    
  

  useEffect(() => {
    const iconMap = {
  Agriculture: <FaLeaf size={40} />,
  Education: <FaBook size={40} />,
  Healthcare: <FaStethoscope size={40} />,
  Employment: <FaTools size={40} />,
  Housing: <FaHome size={40} />,
  SocialWelfare: <FaLeaf size={40} />
};
    axios.get('http://localhost:8000/api/scheme-counts/',
      {withCredentials:true}
    )
    .then(res => {
      const backendData = res.data;
      const mappedData = backendData.map(item => ({
        name : item.department,
        icon : iconMap[item.department] || <FaLeaf size={40} />,
        total:item.count
      }))
      setSchemeCategories(mappedData)
    })
    .catch(err => {
      console.error('error fetching category counts',err)
    })
    
  }, [])


    const steps = [
  {
    icon: <FaUserEdit size={40} className="text-primary" />,
    title: "Create Profile",
    desc: "Tell us about your background so we can personalize recommendations.",
  },
  {
    icon: <FaSearch size={40} className="text-success" />,
    title: "Discover Schemes",
    desc: "We’ll match you with government schemes you’re eligible for.",
  },
  {
    icon: <FaClipboardCheck size={40} className="text-warning" />,
    title: "Apply Easily",
    desc: "Apply directly with simplified document uploads.",
  },
  {
    icon: <FaRegBell size={40} className="text-danger" />,
    title: "Track Progress",
    desc: "Stay updated with real-time status and alerts.",
  },
];

    useEffect(()=> {
        axios.get('http://localhost:8000/api/total-user/',
          {withCredentials:true},
        )
        .then(res => {
            setUser(res.data.usertotal);
            setComplete(res.data.profilecompletion);
            setScheme(res.data.totalscheme)
        })
        .catch(err => {
            console.error("Something went wrong",err)
        })
    },[])
      useEffect(() => {
    const justRegistered = localStorage.getItem("justregistered");
    
    if (!isComplete && justRegistered === "true") {
      setShow(true);
      localStorage.removeItem("justregistered"); 
    }
  }, [isComplete]);
    return (
        <>
            <NavbarComponent/>

           <Modal show={show} onHide={() => setShow(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Welcome! To access scheme eligibility and other features, please complete your profile.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setShow(false);
            window.location.href = "/user-profile"; // Or use navigate("/user-profile")
          }}>
            Complete Now
          </Button>
        </Modal.Footer>
      </Modal> 
    <Row>
         <Carousel data-bs-theme="dark" >
      <Carousel.Item >
        <img
          className="d-block w-100 object-fit-fill "
          src={frame1} 
          alt="First slide"
          height="600px"
        />
        <Carousel.Caption>
          <div className="d-flex gap-2 mb-5  justify-content-center align-items-center">
        <Button variant="primary"  className='px-5 py-3 fw-bold' >
          Check Your Schemas
        </Button>
      </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 object-fit-fill "
          src={frame2}
          alt="Second slide"
          height={'600px'}
        />
        <Carousel.Caption>
           <div className="d-flex gap-2 mb-5  justify-content-center align-items-center">
        <Button variant="primary"  className='px-5 py-3 fw-bold' >
          Check Your Schemas
        </Button>
      </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 object-fit-fill"
          src={frame3}
          alt="Third slide"
          height={'600px'}
        />
        <Carousel.Caption>
           <div className="d-flex gap-2 mb-5  justify-content-center align-items-center">
        <Button variant="primary"  className='px-5 py-3 fw-bold' >
          Check Your Schemas
        </Button>
      </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
</Row>
{/* Number Animator begins */}
<Row className="justify-content-center gap-3 mt-4">
  <Col md={3}>
    <div className="text-center bg-light text-primary border rounded-3 px-4 py-3">
      <h5>Total Users</h5>
      <h2 className="display-6 fw-bolder">
        <CountUp end={user} duration={3} />
      </h2>
    </div>
  </Col>

  <Col md={3}>
    <div className="text-center bg-light text-primary border rounded-3 px-4 py-3">
      <h5>Total Schemas</h5>
      <h2 className="display-6 fw-bolder">
        <CountUp end={scheme} duration={3} />
      </h2>
    </div>
  </Col>

  <Col md={3}>
    <div className="text-center bg-light text-primary border rounded-3 px-4 py-3">
      <h5>Total Applications</h5>
      <h2 className="display-6 fw-bolder">
        <CountUp end={5000} duration={3} />
      </h2>
    </div>
  </Col>
</Row>

<Row className="mt-4 g-4 justify-content-center">
          <h2 className="text-center mb-4 fw-bold">Schemas You can apply</h2>

      {schemeCategories.map((category, idx) => (
        <Col key={idx} xs={12} sm={6} md={4} lg={4}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <div className="mb-3 text-primary">{category.icon}</div>
              <Card.Title>{category.name}</Card.Title>
              <Card.Text className="text-muted">Total Schemes: {category.total}</Card.Text>
              <Link to={`/scheme/${category.name}`}>
              <Button variant="outline-primary">
                Explore <FaArrowRight className="ms-2" />
              </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    <Container className="my-5">
      <h2 className="text-center mb-4 fw-bold">How We Work</h2>
      <Row className="g-4 justify-content-center">
        {steps.map((step, idx) => (
          <Col xs={12} sm={6} md={3} key={idx}>
            <Card className="text-center border-0 shadow h-100 p-3">
              <div className="mb-3">{step.icon}</div>
              <h5 className="fw-semibold">{step.title}</h5>
              <p className="text-muted">{step.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    <Footer/>
        </>
    );

}

export default Dashboard;