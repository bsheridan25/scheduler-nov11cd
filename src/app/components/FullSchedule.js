"use client"

import React, { useState } from 'react';
import { Calendar, Clock, Plus, X, Users } from 'lucide-react';

// Helper functions moved outside
const getCurrentWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
};

const getWeekDates = (week, year) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysToMonday = (8 - firstDayOfYear.getDay()) % 7;
  const firstMonday = new Date(year, 0, 1 + daysToMonday);
  const startOfWeek = new Date(firstMonday);
  startOfWeek.setDate(firstMonday.getDate() + (week - 1) * 7);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
};

const createInitialSchedule = () => {
  const dates = {};
  const weekDates = getWeekDates(getCurrentWeekNumber(), new Date().getFullYear());
  weekDates.forEach(date => {
    const dateStr = formatDate(date);
    dates[dateStr] = {
      Albany: [],
      Coxsackie: [],
      CliftonPark: [],
      Hospital: [],
      OnCall: ''
    };
  });
  return dates;
};

const FullSchedule = () => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekNumber());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [providers] = useState([
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

  const [schedule, setSchedule] = useState(createInitialSchedule);

  const locations = ['Albany', 'Coxsackie', 'CliftonPark'];

  const handleProviderChange = (date, location, index, field, value) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const dateStr = formatDate(date);
      if (!newSchedule[dateStr][location][index]) {
        newSchedule[dateStr][location][index] = {};
      }
      newSchedule[dateStr][location][index][field] = value;
      return newSchedule;
    });
  };

  const addProvider = (date, location) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const dateStr = formatDate(date);
      newSchedule[dateStr][location].push({
        provider: '',
        startTime: '',
        endTime: '4:30 PM',
        nurse: ''
      });
      return newSchedule;
    });
  };

  const removeProvider = (date, location, index) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const dateStr = formatDate(date);
      newSchedule[dateStr][location].splice(index, 1);
      return newSchedule;
    });
  };

  // Rest of your component remains the same...
  return (
    <div className="p-4">
      {/* Same JSX as before */}
    </div>
  );
};

export default FullSchedule;