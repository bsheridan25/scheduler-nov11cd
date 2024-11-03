"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Users } from 'lucide-react';

const getCurrentWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
};

const FullSchedule = () => {
  // Move the function definition before using it in useState
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekNumber());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showProviderManagement, setShowProviderManagement] = useState(false);
  const [providers, setProviders] = useState([
    'Dr. Luthra',
    'Dr. Centurioni',
    'Dr. Bevilacqua',
    'Dr. Fecko',
    'Dr. Leary',
    'Dr. Maroney',
    'Dr. Tenenbaum',
    'Dr. Benison',
    'Dr. Cuff',
    'Dr. Pinapati',
    'Dr. Abbuhl',
    'Dr. Sheridan',
    'NP Rizzolo',
    'NP Collins'
  ]);

  const locations = ['Albany', 'Coxsackie', 'CliftonPark'];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4">
      <h1>Schedule</h1>
      {/* Rest of your JSX */}
    </div>
  );
};

export default FullSchedule;