import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../FooterComponent";
import NavbarComponent from "../Navbar";
import Alert from 'react-bootstrap/Alert';

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/applications/", {
          withCredentials: true, // if using cookies for auth
        });
        setApplications(res.data);
      } catch (err) {
        setError("Failed to load applications.",err);
      } 
    };

    fetchApplications();
  }, []);
  console.log(applications)
  const handleViewDetails = (id) => {
    navigate(`/result-apply/${id}`);
  };

  if (error) return <p>{error}</p>;
  if (applications.length === 0){
    return (
      <>
      <NavbarComponent/>
  <Alert variant="info" className="text-center shadow-sm">
    <strong>ℹ No applications submitted yet.</strong>  
    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
      When you submit applications, they will appear here.
    </div>
  </Alert>
  </>
  
    )}

  return (
    <>
    <NavbarComponent/>
    <div className="container mt-4">
      <h3>Applied Applications</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Scheme Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={app.id}>
              <td>{index + 1}</td>
              <td>{app.title || "—"}</td>
              <td>{app.department || "—"}</td>
<td style={{
  color: app.status === "Approved" ? "green" :
         app.status === "Rejected" ? "red" :
         app.status === "Pending" ? "orange" : "black",
  fontWeight: "bold"
}}>
  {app.status}
</td>
              <td>{new Date(app.applied_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleViewDetails(app.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    </>
  );
};

export default Application;
