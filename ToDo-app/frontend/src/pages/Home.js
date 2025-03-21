import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        <h1>Bienvenue sur TodoApp</h1>
        <p>Gérez vos tâches efficacement.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;