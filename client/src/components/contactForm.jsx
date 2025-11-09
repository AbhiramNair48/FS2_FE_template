import React, { useState } from "react";
import axios from "axios";

// Helper function to construct API URL
const constructApiUrl = (path) => {
  return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}${path}`;
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null, // 'success' or 'error'
    message: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await axios.post(constructApiUrl('/api/contact'), formData);
      
      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Contact form submitted successfully!'
        });
        // Reset form after successful submission
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.data.error || 'Failed to submit contact form.'
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error
        || error.message
        || 'Failed to submit contact form. Please try again later.';
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    // Clear status message when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  return (
    <div id="contact">
      {submitStatus.type && (
        <div
          className={`status-message ${submitStatus.type}`}
          style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
            color: submitStatus.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '14px'
          }}
        >
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">First Name</label>
        <input
          type="text"
          className="name"
          id="fname"
          name="firstname"
          placeholder="Your name.."
          value={formData.firstname}
          onChange={handleInputChange}
          required
          aria-required="true"
        />

        <label htmlFor="lname">Last Name</label>
        <input
          type="text"
          className="name"
          id="lname"
          name="lastname"
          placeholder="Your last name.."
          value={formData.lastname}
          onChange={handleInputChange}
          required
          aria-required="true"
        />

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          className="name"
          id="email"
          name="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          aria-required="true"
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Write your message.."
          value={formData.message}
          onChange={handleInputChange}
          required
          aria-required="true"
          rows="5"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;