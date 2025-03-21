import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h2>Tableau de bord</h2>
        <p>Gérez vos tableaux et tâches ici.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;