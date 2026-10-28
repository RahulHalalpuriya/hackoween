import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const FarmContext = createContext();

export function FarmProvider({ children }) {
  const { token, farmer } = useAuth();
  const { socket } = useSocket();

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [weather, setWeather] = useState(null);
  const [feed, setFeed] = useState([]);
  const [replanCards, setReplanCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFarms = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get('/api/farms');
      if (res.data.success) {
        setFarms(res.data.farms);
        if (res.data.farms.length > 0 && !selectedFarm) {
          setSelectedFarm(res.data.farms[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch farms:', err.message);
    } finally {
      setLoading(false);
    }
  }, [token, selectedFarm]);

  const fetchWorkers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/farms/workers');
      if (res.data.success) {
        setWorkers(res.data.workers);
      }
    } catch (err) {
      console.warn('Failed to fetch workers:', err.message);
    }
  }, [token]);

  const fetchFeed = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/agent/feed');
      if (res.data.success) {
        setFeed(res.data.feed);
      }
    } catch (err) {
      console.warn('Failed to fetch feed:', err.message);
    }
  }, [token]);

  const fetchWeather = useCallback(async () => {
    if (!token || farms.length === 0) return;
    try {
      const target = selectedFarm || farms[0];
      const res = await axios.get(`/api/farms/${target._id || target.id}`);
      if (res.data.success && res.data.weather) {
        setWeather(res.data.weather);
      }
    } catch (err) {
      console.warn('Failed to fetch weather:', err.message);
    }
  }, [token, farms, selectedFarm]);

  useEffect(() => {
    if (token) {
      fetchFarms();
      fetchWorkers();
      fetchFeed();
    }
  }, [token, fetchFarms, fetchWorkers, fetchFeed]);

  useEffect(() => {
    if (farms.length > 0) {
      fetchWeather();
    }
  }, [farms, selectedFarm, fetchWeather]);

  // Live Socket.io updates for sensors and farm states
  useEffect(() => {
    if (!socket) return;

    const handleSensorUpdate = (sensorData) => {
      setFarms(prev =>
        prev.map(f => {
          if ((f._id || f.id) === sensorData.farmId) {
            return {
              ...f,
              currentMoisture: sensorData.moisture,
              currentTemp: sensorData.temperature,
              currentHealth: sensorData.health
            };
          }
          return f;
        })
      );

      setSelectedFarm(prev => {
        if (prev && (prev._id || prev.id) === sensorData.farmId) {
          return {
            ...prev,
            currentMoisture: sensorData.moisture,
            currentTemp: sensorData.temperature,
            currentHealth: sensorData.health
          };
        }
        return prev;
      });
    };

    const handleFarmUpdate = (updatedFarm) => {
      setFarms(prev =>
        prev.map(f => ((f._id || f.id) === (updatedFarm._id || updatedFarm.id) ? updatedFarm : f))
      );
      setSelectedFarm(prev =>
        prev && (prev._id || prev.id) === (updatedFarm._id || updatedFarm.id) ? updatedFarm : prev
      );
    };

    const handleCycleFinished = (data) => {
      fetchFeed();
      if (data.replanCards && data.replanCards.length > 0) {
        setReplanCards(data.replanCards);
      }
    };

    socket.on('sensor:updated', handleSensorUpdate);
    socket.on('farm:updated', handleFarmUpdate);
    socket.on('agent:cycle_finished', handleCycleFinished);

    return () => {
      socket.off('sensor:updated', handleSensorUpdate);
      socket.off('farm:updated', handleFarmUpdate);
      socket.off('agent:cycle_finished', handleCycleFinished);
    };
  }, [socket, fetchFeed]);

  async function toggleMotor(farmId, targetStatus) {
    const res = await axios.post(`/api/farms/${farmId}/motor`, { status: targetStatus });
    if (res.data.success) {
      setFarms(prev => prev.map(f => ((f._id || f.id) === farmId ? res.data.farm : f)));
      if (selectedFarm && (selectedFarm._id || selectedFarm.id) === farmId) {
        setSelectedFarm(res.data.farm);
      }
    }
    return res.data;
  }

  return (
    <FarmContext.Provider
      value={{
        farms,
        selectedFarm,
        setSelectedFarm,
        workers,
        weather,
        feed,
        replanCards,
        setReplanCards,
        loading,
        fetchFarms,
        fetchWorkers,
        fetchFeed,
        fetchWeather,
        toggleMotor
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarms() {
  return useContext(FarmContext);
}
