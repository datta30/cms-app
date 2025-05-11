import React from 'react';
import './App.css'; // Assuming general styles are here

function AboutUsPage() {
  // Replace this with your actual Google Maps embed code
  const mapEmbedCode = `
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.6630445431465!2d80.62001967460738!3d16.441930829353733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a7d81943%3A0x8ba5d78f65df94b8!2sKL%20University!5e0!3m2!1sen!2sin!4v1746921343411!5m2!1sen!2sin" 
      width="100%" 
      height="450" 
      style="border:0;" 
      allowfullscreen="" 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  `;

  return (
    <div className="section-content about-us-page">
      <div className="section-header">
        <h2>About Us</h2>
      </div>
      
      <div className="about-us-content" style={{ background: 'var(--surface-light)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Our Story</h3>
        <p>
          Welcome to Modern CMS! We are dedicated to providing the best content management solutions
          to help you build and manage your online presence with ease. Our platform is designed
          for flexibility, power, and user-friendliness.
        </p>
        <p>
          Founded in [Year], our mission has always been to empower creators, businesses, and
          developers by offering a robust and intuitive CMS. We believe in the power of content
          and strive to make its management a seamless experience.
        </p>

        <h3>Our Mission</h3>
        <p>
          To deliver an innovative, reliable, and scalable Content Management System that
          adapts to the evolving needs of our users, fostering creativity and growth in the digital space.
        </p>

        <h3>Meet the Team (Placeholder)</h3>
        <p>
          Our team is composed of passionate developers, designers, and content strategists
          working together to bring you the best CMS experience.
        </p>
      </div>

      <div className="map-container" style={{ background: 'var(--surface-light)', padding: '20px', borderRadius: '8px' }}>
        <h3>Our Location</h3>
        <p>Come visit us at our headquarters (or see where we're virtually located!):</p>
        <div dangerouslySetInnerHTML={{ __html: mapEmbedCode }} />
      </div>
    </div>
  );
}

export default AboutUsPage;
