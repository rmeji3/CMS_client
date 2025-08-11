import React from 'react';

const Login: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff'
        }}>
            <h2>Login</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
                <input type="text" placeholder="Username" style={{ padding: '8px', fontSize: '1rem' }} />
                <input type="password" placeholder="Password" style={{ padding: '8px', fontSize: '1rem' }} />
                <button type="submit" style={{ padding: '10px 24px', fontSize: '1rem', borderRadius: '4px', border: 'none', background: '#0078d4', color: '#fff', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
