import React from 'react';

const DashboardPage: React.FC = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <section style={{ marginTop: '2rem' }}>
                <h2>Welcome to EnergyX Dashboard</h2>
                <p>
                    Here you can monitor your energy usage, view analytics, and manage your account.
                </p>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                    <div style={{
                        flex: '1 1 300px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <h3>Current Usage</h3>
                        <p>-- kWh</p>
                    </div>
                    <div style={{
                        flex: '1 1 300px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <h3>Monthly Analytics</h3>
                        <p>-- kWh used this month</p>
                    </div>
                    <div style={{
                        flex: '1 1 300px',
                        background: '#f5f5f5',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <h3>Account Status</h3>
                        <p>Active</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;