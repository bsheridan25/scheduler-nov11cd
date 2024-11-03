import React, { useState } from 'react';
import { Calendar, Clock, Plus, X, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const FullSchedule = () => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
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

  const getCurrentWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const week = Math.floor(diff / oneWeek) + 1;
    return week;
  };

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

  const [schedule, setSchedule] = useState(() => {
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
  });

  const handleWeekChange = (week, year = currentYear) => {
    if (week < 1) {
      setCurrentWeek(52);
      setCurrentYear(year - 1);
    } else if (week > 52) {
      setCurrentWeek(1);
      setCurrentYear(year + 1);
    } else {
      setCurrentWeek(week);
      setCurrentYear(year);
    }

    const newDates = {};
    const weekDates = getWeekDates(week, year);
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      newDates[dateStr] = schedule[dateStr] || {
        Albany: [],
        Coxsackie: [],
        CliftonPark: [],
        Hospital: [],
        OnCall: ''
      };
    });
    setSchedule(newDates);
  };

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
        endTime: '',
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleWeekChange(currentWeek - 1)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold">Week {currentWeek}</span>
              <span className="text-sm text-gray-500">{currentYear}</span>
            </div>
            <button 
              onClick={() => handleWeekChange(currentWeek + 1)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <select 
            className="border rounded p-2"
            value={currentWeek}
            onChange={(e) => handleWeekChange(parseInt(e.target.value))}
          >
            {Array.from({ length: 53 }, (_, i) => i + 1).map(week => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>
          <input 
            type="number"
            className="border rounded p-2 w-24"
            value={currentYear}
            onChange={(e) => handleWeekChange(currentWeek, parseInt(e.target.value))}
            min="2000"
            max="2100"
          />
        </div>
        <button 
          onClick={() => setShowProviderManagement(true)}
          className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Manage Providers
        </button>
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
                            <option key={p} value={p}>{p}</option>
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
                      <option key={p} value={p}>{p}</option>
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
                      <option key={p} value={p}>{p}</option>
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