import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.webp';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { BoxArrowRight } from "react-bootstrap-icons";
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/navbar.css'; // Custom CSS for hover
import axios from 'axios';
import { useState } from 'react';
import Notifications from './Notifications';

function NavbarComponent() {
  const [isComplete,setComplete] = useState(true)
  const navigate = useNavigate()
  useEffect( () => {
    axios.get('http://localhost:8000/api/total-user/',
      {withCredentials:true},
    )
    .then((res) => {
      setComplete(res.data.profilecompletion)
      console.log(res.data.profilecompletion)

    })
    .catch((err) =>{
      console.log('something went wrong',err)
    })
  },[])

  const handleLogout = async () => {
    try {
        await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true });
        navigate('/')
    } catch (error) {
        console.error("Logout failed", error);
    }
};
  return (
    <>
    
    <Navbar bg="primary" data-bs-theme="dark" sticky="top">
      <Container fluid>
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle overflow-hidden border border-light me-2"
            style={{ width: '40px', height: '40px' }}
          >
            <img
              src={logo}
              alt="logo"
              className="w-100 h-100 object-fit-cover"
            />
          </div>
          <Navbar.Brand href="/" className="fw-bold fs-3 text-white">SchemeEase</Navbar.Brand>
        </div>

        <Nav className="mx-auto gap-4">
          <Nav.Link href="/dashboard" className="nav-hover">Home</Nav.Link>
          {isComplete &&<Nav.Link  href="/recommended-view" className="nav-hover">Recommended</Nav.Link>}
          <Nav.Link href="/bookmark-view" className="nav-hover">Bookmarked</Nav.Link>
          <Nav.Link href="/application-view" className="nav-hover">Applied</Nav.Link>
        </Nav>

        <div className="d-flex align-items-center gap-3 me-3">
          {/* <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search"
              className="bg-white text-dark border-0 me-1"
            />
            <Button variant="light" type="submit">
              <FaSearch size={20} />
            </Button>
          </Form> */}
          {/* <Link to={'/notifications'}>
          <FaBell className="text-white" size={24} style={{ cursor: 'pointer' }} />
          </Link> */}
          <Notifications/>
         <div style={{ position: 'relative', display: 'inline-block' }}>
  <OverlayTrigger
    placement="bottom"
    overlay={
      <Tooltip id="button-tooltip-2">
        {isComplete
          ? 'User profile'
          : 'Please complete user profile to check recommended schemes'}
      </Tooltip>
    }
  >
    <Link to="/user-profile" style={{ position: 'relative', display: 'inline-block' }}>
      <FaUserCircle className="text-white" size={30} style={{ cursor: 'pointer' }} />
      {!isComplete && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '10px',
            width: '10px',
            backgroundColor: 'red',
            borderRadius: '50%',
            border: '1px solid white',
          }}
        />
      )}
    </Link>
  </OverlayTrigger>
</div>

<OverlayTrigger
  placement="bottom"
    overlay={
      <Tooltip id="button-tooltip-2">
        Log-out
      </Tooltip>
    }
    >
<Button
      variant="danger"
      className="d-flex align-items-center gap-2 px-2 py-2 fw-semibold shadow-sm"
      onClick={handleLogout}
    >
      <BoxArrowRight size={18} />
    </Button>
    </OverlayTrigger>
            </div>
      </Container>
    </Navbar>
    </>
  );
}

export default NavbarComponent;
