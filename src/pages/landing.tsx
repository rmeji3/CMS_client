import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f7fa'
        }}>
            <h1>Welcome to CMS</h1>
            <p>Your content management solution starts here.</p>
            <button
                style={{
                    padding: '10px 24px',
                    fontSize: '1rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#0078d4',
                    color: '#fff',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
                onClick={() => navigate('/login')}
            >
                Get Started
            </button>
        </div>
    );
};

export default Landing;