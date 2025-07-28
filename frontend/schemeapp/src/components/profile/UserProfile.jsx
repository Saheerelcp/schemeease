import React, { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarComponent from '../Navbar';
import { Button, Col, Form, Row, Container, Alert } from 'react-bootstrap';
import Footer from '../FooterComponent';
import { useEffect } from 'react';
import axiosInstance from '../AxiosInstance';
import { FaTrash } from 'react-icons/fa';

const stateDistrictData = {
    Kerala: ["Kozhikode", "Ernakulam", "Kannur"],
    TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
};

function UserProfile() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '', dob: '', gender: '', phone: '', email: '',
        aadhar: '', pincode: '', address: '',
        // rural: '', study: '', current: '', institute: '', 
        occupation: '',
        income: '', caste: '', disability: '', marital: ''
    });
    const [selectedState, setSelectedState] = useState('');
    const [districtOptions, setDistrictOptions] = useState([]); // List of districts for selected state
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [msg, setMsg] = useState('')
    const [msgaadhar, setMsgaadhar] = useState('')
    const [msgpin, setMsgpin] = useState('')
    const [isComplete, setComplete] = useState(false)
    const [isEditable, setIsEditable] = useState(true);



    useEffect(() => {
        axiosInstance.get('user-profile/', {
            withCredentials: true
        })
            .then((res) => {
                const data = res.data;
                if (data.profile && data.profile.fullname) {
                setFormData(data.profile);

                setSelectedState(data.state);
                const districts = stateDistrictData[data.state] || [];
                setDistrictOptions(districts);

                setSelectedDistrict(data.district);

                setComplete(data.profilecomplete); // This comes from backend

                // 🧠 If profile is already complete, make fields non-editable
                setIsEditable(false);
            } else {
                // 🧠 No profile exists, editable form
                setIsEditable(true);
            }
            })
            .catch((error) => {
                console.error("No existing profile", error);
            });
    }, []);

    const handleDelete = async () => {
  try {
    const res = await axiosInstance.delete('user-profile/', {
      withCredentials: true,
    });
    toast.success(res.data || "Deleted");
    setFormData({
            fullname: '', dob: '', gender: '', phone: '', email: '',
        aadhar: '', pincode: '', address: '',
        // rural: '', study: '', current: '', institute: '', 
        occupation: '',
        income: '', caste: '', disability: '', marital: ''
        });

        setSelectedState('');
        setSelectedDistrict('');
        setDistrictOptions([]);
        setComplete(false);      
        setIsEditable(true);     
        setValidated(false); 
  } catch (err) {
    console.error('Something went wrong', err);
    toast.error("Failed to delete profile");
  }
};



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        setFormData(prev => ({ ...prev, phone }));

        setMsg('');

        // Simple validation
        if (!/^\d{10}$/.test(phone)) {
            setMsg('Enter a valid 10-digit phone number');
        }
    };

    const handleAadhar = (e) => {
        const aadhar = e.target.value;
        setFormData(prev => ({ ...prev, aadhar }))
        setMsgaadhar('');
        if (!/^\d{12}$/.test(aadhar)) {
            setMsgaadhar('Enter a valid 12-digit aadhar number');
        }
    }
    const handlePin = (e) => {
        const pincode = e.target.value;
        setFormData(prev => ({ ...prev, pincode }))
        setMsgpin('');
        if (!/^\d{6}$/.test(pincode)) {
            setMsgpin('Enter a valid 6-digit pin number');
        }
    }
    const handleUserProfile = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        console.log(formData.selectedState, 'from data')
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            try {
                const response = await axiosInstance.post('user-profile/',
                    { formData, selectedState, selectedDistrict },
                    {
                        withCredentials: true,
                    });
                setIsEditable(false);
                setComplete(true);
                

                toast.success(response.data, { position: 'top-right', autoClose: 2000 });
            } catch (error) {
                console.error(error);
                toast.error('Failed to create profile');
            }
        }
        setValidated(true);
    };

    return (
        <>
            <NavbarComponent />
            {!isComplete && <Alert variant='warning' >
                <p className='d-flex justify-content-center align-items-center'>
                    "Complete your profile to unlock access to eligible schemes tailored for you."
                </p>
            </Alert>}
            <ToastContainer />
            <Container className='mt-4' style={{ position: 'relative' }}>
                {!isEditable && isComplete &&
                    <Button
                        variant="primary"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            zIndex: 1,
                        }}
                        onClick={() => setIsEditable(true)}
                    >
                        Edit
                    </Button>
                }
                { isComplete &&
                 <Button
                        variant="danger"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: -40,
                            zIndex: 1,
                        }}
                    onClick={handleDelete}
                    >
                        <FaTrash size={20} color='white'/>
                    </Button>
                }

                <h2 className='text-center mb-4'>User Profile</h2>
                <Form noValidate validated={validated} onSubmit={handleUserProfile} >

                    {/* Basic Info */}
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                disabled={!isEditable}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                required
                                type="date"
                                name="dob"
                                value={formData.dob}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={handleChange}
                                disabled={!isEditable}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select name="gender" value={formData.gender} onChange={handleChange} required disabled={!isEditable}>
                                <option value=''>Select</option>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                                <option value='other'>Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md='4'>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                required
                                disabled={!isEditable}
                            />
                            {msg && <small style={{ color: 'red' }}>{msg}</small>}
                        </Form.Group>



                        <Form.Group as={Col} md="4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                                disabled={!isEditable}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Aadhar Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="aadhar"
                                value={formData.aadhar}
                                onChange={handleAadhar}
                                placeholder="Aadhar"
                                required
                                disabled={!isEditable}
                            />

                            {msgaadhar && <small style={{ color: 'red' }}>{msgaadhar}</small>}
                        </Form.Group>
                    </Row>

                    {/* Address */}
                    <h5 className='mt-4'>Address Information</h5>
                    <Row className="mb-3">
                        {/* State Select */}
                        <Form.Group controlId="stateSelect">
                            <Form.Label>Select State</Form.Label>
                            <Form.Select
                                required
                                value={selectedState || ''}
                                disabled={!isEditable}
                                onChange={(e) => {
                                    const newState = e.target.value;
                                    setSelectedState(newState);
                                    const districts = stateDistrictData[newState] || [];
                                    setDistrictOptions(districts);
                                    setSelectedDistrict(''); // Reset district when state changes
                                }}
                            >
                                <option value="">Select State</option>
                                {Object.keys(stateDistrictData).map((stateName) => (
                                    <option key={stateName} value={stateName}>{stateName}</option>
                                ))}
                            </Form.Select>

                        </Form.Group>
                        <Form.Group controlId="districtSelect" className="mt-3">
                            <Form.Label>Select District</Form.Label>
                            <Form.Select
                                required
                                value={selectedDistrict || ''}

                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedState || !isEditable}
                            >
                                <option value="">Select District</option>
                                {districtOptions.map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>




                        <Form.Group as={Col} md="4">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control
                                type="text"
                                name="pin"
                                value={formData.pincode}
                                onChange={handlePin}
                                placeholder="Pincode"
                                required
                                disabled={!isEditable}
                            />
                            {msgpin && <small style={{ color: 'red' }}>{msgpin}</small>}

                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Full Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            disabled={!isEditable}
                        />
                    </Form.Group>

                    {/* Additional Info */}
                    <h5 className='mt-4'>Other Information</h5>
                    <Row className='mb-3'>
                        <Form.Group as={Col} md="4">
                            <Form.Label>Occupation</Form.Label>
                            <Form.Control
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Annual Income</Form.Label>
                            <Form.Control
                                type="number"
                                name="income"
                                value={formData.income}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>Marital Status</Form.Label>
                            <Form.Select name="marital" value={formData.marital} onChange={handleChange} disabled={!isEditable} required>
                                <option value=''>Select</option>
                                <option>Single</option>
                                <option>Married</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                        <Form.Group as={Col} md="6">
                            <Form.Label>Caste Category</Form.Label>
                            <Form.Select
                                name="caste"
                                value={formData.caste}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            >
                                <option value="">Select Caste Category</option>
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                            <Form.Label>Disability (if any)</Form.Label>
                            <Form.Select
                                name="disability"
                                value={formData.disability}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            >
                                <option value="">Select Disability Status</option>
                                <option value="None">None</option>
                                <option value="Visual Impairment">Visual Impairment</option>
                                <option value="Hearing Impairment">Hearing Impairment</option>
                                <option value="Locomotor Disability">Locomotor Disability</option>
                                <option value="Mental Illness">Mental Illness</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>

                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Check
                            required
                            label="Agree to terms and conditions"
                            feedback="You must agree before submitting."
                            feedbackType="invalid"
                            disabled={!isEditable}
                        />
                    </Form.Group>

                    <div className='text-center'>
                        {isEditable &&
                            <Button type="submit">{isComplete ? "Save Changes" : "Submit Profile"}</Button>
                        }
                    </div>
                </Form>
            </Container>
            <Footer />
        </>
    );
}

export default UserProfile;
