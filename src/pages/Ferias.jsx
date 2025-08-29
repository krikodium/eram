import React from 'react';
import FeriasHero from '../components/FeriasHero';
import PastEvents from '../components/PastEvents';
import UpcomingFairs from '../components/UpcomingFairs';
import VisitBenefits from '../components/VisitBenefits';
import FeriasCTA from '../components/FeriasCTA';
import './Ferias.css';

const Ferias = () => {
  return (
    <div className="ferias-page">
      {/* Hero Section - Main Introduction */}
      <FeriasHero />
      
      {/* Past Events Section - Historical Participation */}
      <PastEvents />
      
      {/* Upcoming Fairs Section - Future Events */}
      <UpcomingFairs />
      
      {/* Visit Benefits Section - Why Visit Us */}
      <VisitBenefits />
      
      {/* Final CTA Section - Contact and Actions */}
      <FeriasCTA />
    </div>
  );
};

export default Ferias;