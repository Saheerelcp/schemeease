import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../images/logo.webp';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


import { FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';
import '../styles/navbar.css'; // Custom CSS for hover
import axiosInstance from './AxiosInstance';
import { useState } from 'react';

function NavbarComponent() {
  const [isComplete,setComplete] = useState(true)
  useEffect( () => {
    axiosInstance.get('total-user/',
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
  return (
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
          <Nav.Link href="#home" className="nav-hover">Home</Nav.Link>
          {isComplete &&<Nav.Link  href="#eligible" className="nav-hover">Eligible</Nav.Link>}
          <Nav.Link href="#bookmarked" className="nav-hover">Bookmarked</Nav.Link>
          <Nav.Link href="#applied" className="nav-hover">Applied</Nav.Link>
        </Nav>

        <div className="d-flex align-items-center gap-3 me-3">
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search"
              className="bg-white text-dark border-0 me-1"
            />
            <Button variant="light" type="submit">
              <FaSearch size={20} />
            </Button>
          </Form>

          <FaBell className="text-white" size={24} style={{ cursor: 'pointer' }} />
         <div style={{ position: 'relative', display: 'inline-block' }}>
  <OverlayTrigger
    placement="bottom"
    overlay={
      <Tooltip id="button-tooltip-2">
        {isComplete
          ? 'User profile'
          : 'Please complete user profile to check eligible schemes'}
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


          
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
