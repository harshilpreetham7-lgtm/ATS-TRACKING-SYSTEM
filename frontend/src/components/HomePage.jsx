import React from 'react';

const HomePage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            AI-Powered Applicant Tracking System
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto 2rem' }}>
            Streamline your recruitment process with intelligent resume analysis,
            automated candidate scoring, and comprehensive pipeline management.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a
              href="/jobs"
              style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}
            >
              Browse Jobs
            </a>
            <a
              href="/recruiter"
              style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}
            >
              Recruiter Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;