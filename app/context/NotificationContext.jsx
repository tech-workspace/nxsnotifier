import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getUnreadCount } from '../services/database';
import { API_BASE_URL } from '../config/api';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Create WebSocket connection
        const socketUrl = API_BASE_URL.replace('/api', '').replace('http://', 'ws://');
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            timeout: 20000,
        });

        // Connection events
        newSocket.on('connect', () => {
            console.log('🔌 WebSocket connected:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 WebSocket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ WebSocket connection error:', error);
            setIsConnected(false);
        });

        // Listen for real-time unread count updates
        newSocket.on('unreadCountUpdate', (data) => {
            console.log('📊 WebSocket: Received unread count update:', data.unreadCount);
            setUnreadCount(data.unreadCount);
            setLastUpdate(new Date(data.timestamp));
        });

        // Listen for new inquiry notifications
        newSocket.on('newInquiry', (data) => {
            console.log('🔔 WebSocket: New inquiry received:', data.inquiry._id);
            // Increment unread count when new inquiry arrives
            setUnreadCount(prev => prev + 1);
            setLastUpdate(new Date(data.timestamp));
        });

        setSocket(newSocket);

        // Initial fetch of unread count
        fetchInitialUnreadCount();

        // Cleanup on unmount
        return () => {
            console.log('🔌 Cleaning up WebSocket connection');
            newSocket.disconnect();
        };
    }, []);

    const fetchInitialUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
            setLastUpdate(new Date());
            console.log('📊 Initial unread count:', count);
        } catch (error) {
            console.error('❌ Error fetching initial unread count:', error);
        }
    };

    const updateUnreadCount = (newCount) => {
        setUnreadCount(newCount);
        setLastUpdate(new Date());
    };

    const decrementUnreadCount = () => {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setLastUpdate(new Date());
    };

    const value = {
        unreadCount,
        lastUpdate,
        isConnected,
        updateUnreadCount,
        decrementUnreadCount,
        socket,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}; 