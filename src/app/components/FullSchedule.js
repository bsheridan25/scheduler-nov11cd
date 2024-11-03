const FullSchedule = () => {
  console.log("FullSchedule is rendering");"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Users } from 'lucide-react';
import { getProviders, saveProvider, saveSchedule, getScheduleByDate } from '../../lib/db';

const FullSchedule = () => {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showProviderManagement, setShowProviderManagement] = useState(false);
  const [providers, setProviders] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const locations = ['Albany', 'Coxsackie', 'CliftonPark'];

  useEffect(() => {
    loadProviders();
    loadSchedule();
  }, [currentWeek, currentYear]);

  async function loadProviders() {
    try {
      const dbProviders = await getProviders();
      setProviders(dbProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  }

  async function loadSchedule() {
    try {
      const weekDates = getWeekDates(currentWeek, currentYear);
      const startDate = weekDates[0];
      const endDate = weekDates[weekDates.length - 1];
      const dbSchedule = await getScheduleByDate(startDate, endDate);
      
      // Transform schedule data into the format your component expects
      const formattedSchedule = {};
      weekDates.forEach(date => {
        const dateStr = formatDate(date);
        formattedSchedule[dateStr] = {
          Albany: [],
          Coxsackie: [],
          CliftonPark: [],
          Hospital: [],
          OnCall: ''
        };
      });

      dbSchedule.forEach(entry => {
        const dateStr = formatDate(new Date(entry.date));
        if (formattedSchedule[dateStr]) {
          formattedSchedule[dateStr][entry.location].push({
            provider: entry.provider_name,
            startTime: entry.start_time,
            endTime: entry.end_time,
            nurse: entry.nurse
          });
        }
      });

      setSchedule(formattedSchedule);
      setLoading(false);
    } catch (error) {
      console.error('Error loading schedule:', error);
      setLoading(false);
    }
  }

  const handleProviderChange = async (date, location, index, field, value) => {
    try {
      setSchedule(prev => {
        const newSchedule = { ...prev };
        const dateStr = formatDate(date);
        if (!newSchedule[dateStr][location][index]) {
          newSchedule[dateStr][location][index] = {};
        }
        newSchedule[dateStr][location][index][field] = value;
        return newSchedule;
      });

      // Save to database
      const dateStr = formatDate(date);
      const provider = providers.find(p => p.name === value);
      if (provider && field === 'provider') {
        await saveSchedule({
          date: dateStr,
          provider_id: provider.id,
          location,
          start_time: schedule[dateStr][location][index].startTime || '09:00',
          end_time: schedule[dateStr][location][index].endTime || '17:00',
          nurse: schedule[dateStr][location][index].nurse || ''
        });
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
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

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentWeek(prev => Math.max(1, prev - 1))}
              className="p-2 rounded hover:bg-gray-100"
            >
              Previous
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold">Week {currentWeek}</span>
              <span className="text-sm text-gray-500">{currentYear}</span>
            </div>
            <button 
              onClick={() => setCurrentWeek(prev => Math.min(52, prev + 1))}
              className="p-2 rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
          <select 
            className="border rounded p-2"
            value={currentWeek}
            onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
          >
            {Array.from({ length: 53 }, (_, i) => i + 1).map(week => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>
          <input 
            type="number"
            className="border rounded p-2 w-24"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            min="2000"
            max="2100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              {locations.map(location => (
                <th key={location} className="border p-2">{location}</th>
              ))}
              <th className="border p-2">Hospital</th>
              <th className="border p-2">On Call</th>
            </tr>
          </thead>
          <tbody>
            {getWeekDates(currentWeek, currentYear).map(date => (
              <tr key={formatDate(date)} className="border">
                <td className="border p-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div>{date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(date)}
                      </div>
                    </div>
                  </div>
                </td>
                {locations.map(location => (
                  <td key={location} className="border p-2">
                    {schedule[formatDate(date)]?.[location]?.map((provider, index) => (
                      <div key={index} className="mb-2 p-2 bg-white rounded shadow-sm">
                        <select
                          className="border mb-1 p-1 w-full"
                          value={provider.provider || ''}
                          onChange={(e) => handleProviderChange(date, location, index, 'provider', e.target.value)}
                        >
                          <option value="">Select Provider</option>
                          {providers.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                        <div className="flex gap-2 items-center">
                          <Clock className="w-4 h-4" />
                          <input
                            type="time"
                            className="border p-1 flex-1"
                            value={provider.startTime || ''}
                            onChange={(e) => handleProviderChange(date, location, index, 'startTime', e.target.value)}
                          />
                          <input
                            type="time"
                            className="border p-1 flex-1"
                            value={provider.endTime || ''}
                            onChange={(e) => handleProviderChange(date, location, index, 'endTime', e.target.value)}
                          />
                        </div>
                        <input
                          className="border mt-1 p-1 w-full"
                          placeholder="Nurse"
                          value={provider.nurse || ''}
                          onChange={(e) => handleProviderChange(date, location, index, 'nurse', e.target.value)}
                        />
                        <button 
                          className="mt-1 px-2 py-1 bg-red-100 text-red-600 rounded"
                          onClick={() => removeProvider(date, location, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      className="px-2 py-1 bg-green-100 text-green-600 rounded flex items-center gap-1"
                      onClick={() => addProvider(date, location)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Provider
                    </button>
                  </td>
                ))}
                <td className="border p-2">
                  <select
                    className="border p-1 w-full"
                    value={schedule[formatDate(date)]?.Hospital[0]?.provider || ''}
                    onChange={(e) => handleProviderChange(date, 'Hospital', 0, 'provider', e.target.value)}
                  >
                    <option value="">Select Provider</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <select
                    className="border p-1 w-full"
                    value={schedule[formatDate(date)]?.OnCall || ''}
                    onChange={(e) => {
                      const newSchedule = { ...schedule };
                      newSchedule[formatDate(date)].OnCall = e.target.value;
                      setSchedule(newSchedule);
                    }}
                  >
                    <option value="">Select Provider</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FullSchedule;