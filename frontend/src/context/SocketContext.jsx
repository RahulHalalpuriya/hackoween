import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { farmer } = useAuth();
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [lastCall, setLastCall] = useState(null);
  const [tubewellEvent, setTubewellEvent] = useState(null);
  const [agentActivity, setAgentActivity] = useState({ status: 'idle', stage: 'MONITORING' });

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[SocketContext] Connected to real-time events server');
      if (farmer?._id || farmer?.id) {
        newSocket.emit('join:farmer', farmer._id || farmer.id);
      }
    });

    newSocket.on('alert:received', (alertData) => {
      console.log('[Socket] Alert received:', alertData);
      setAlerts(prev => [
        {
          id: Date.now() + Math.random(),
          ...alertData,
          read: false
        },
        ...prev.slice(0, 19)
      ]);
    });

    newSocket.on('tubewell:started', (eventData) => {
      console.log('[Socket] Tubewell started event received:', eventData);
      setTubewellEvent(eventData);
    });

    newSocket.on('call:logged', (callData) => {
      console.log('[Socket] Call logged:', callData);
      setLastCall(callData);
    });

    newSocket.on('agent:cycle_started', (data) => {
      setAgentActivity({ status: 'running', stage: 'OBSERVE', ...data });
    });

    newSocket.on('agent:stage_update', (data) => {
      setAgentActivity(prev => ({ ...prev, stage: data.stage }));
    });

    newSocket.on('agent:cycle_finished', (data) => {
      setAgentActivity({ status: 'idle', stage: 'REPORT', ...data });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [farmer?._id, farmer?.id]);

  function clearAlert(id) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  function clearLastCall() {
    setLastCall(null);
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        alerts,
        lastCall,
        agentActivity,
        tubewellEvent,
        triggerTubewellAlert: (data) => setTubewellEvent(data),
        clearTubewellAlert: () => setTubewellEvent(null),
        clearAlert,
        clearLastCall
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
