'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Bell, Volume2, VolumeX, Clock } from 'lucide-react';

export default function SettingsPage() {
  // State for notification settings
  const [pushNotifications, setPushNotifications] = useState(false);
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState('1-hour');
  const [hasNotificationSupport, setHasNotificationSupport] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Check notification support and permissions on page load
  useEffect(() => {
    const checkNotificationSupport = async () => {
      if ('Notification' in window) {
        setHasNotificationSupport(true);
        setNotificationPermission(Notification.permission);
      }
    };
    
    checkNotificationSupport();
  }, []);

  // Handle requesting notification permission
  const requestNotificationPermission = async () => {
    if (!hasNotificationSupport) return;
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setPushNotifications(true);
        // Show a test notification
        const notification = new Notification('Notifiche attivate', {
          body: 'Riceverai notifiche per eventi, compiti e promemoria.',
          icon: '/icons/icon-192x192.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Placeholder for saving settings to local storage or database
  const saveSettings = () => {
    localStorage.setItem('appscuola_notifications', JSON.stringify({
      push: pushNotifications,
      sound: soundNotifications,
      reminderTime: reminderTime
    }));
    
    // Show a confirmation message
    alert('Impostazioni salvate con successo!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <Settings className="mr-3 h-7 w-7" />
        Impostazioni
      </h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Impostazioni Applicazione</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Configura le impostazioni dell'applicazione secondo le tue preferenze.
        </p>
        
        {/* Notification Settings Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifiche
          </h3>
          
          {/* Push Notifications Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="push-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notifiche Push
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="push-notifications" 
                  className="sr-only peer" 
                  checked={pushNotifications}
                  onChange={() => {
                    if (!pushNotifications && notificationPermission !== 'granted') {
                      requestNotificationPermission();
                    } else {
                      setPushNotifications(!pushNotifications);
                    }
                  }}
                  disabled={!hasNotificationSupport}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {!hasNotificationSupport ? 
                "Il tuo browser non supporta le notifiche push." : 
                notificationPermission === 'denied' ? 
                "Permesso per le notifiche negato. Modifica i permessi nelle impostazioni del browser." :
                "Attiva per ricevere notifiche per eventi, compiti e promemoria."}
            </p>
          </div>
          
          {/* Sound Notifications Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="sound-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                {soundNotifications ? 
                  <Volume2 className="mr-2 h-4 w-4" /> : 
                  <VolumeX className="mr-2 h-4 w-4" />}
                Suoni di Notifica
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="sound-notifications" 
                  className="sr-only peer" 
                  checked={soundNotifications}
                  onChange={() => setSoundNotifications(!soundNotifications)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Attiva/disattiva i suoni di notifica dell'applicazione.
            </p>
          </div>
          
          {/* Reminder Time Dropdown */}
          <div className="mb-4">
            <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Tempo di Promemoria Predefinito
            </label>
            <select 
              id="reminder-time" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            >
              <option value="5-min">5 minuti prima</option>
              <option value="15-min">15 minuti prima</option>
              <option value="30-min">30 minuti prima</option>
              <option value="1-hour">1 ora prima</option>
              <option value="1-day">1 giorno prima</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Quando ricevere notifiche di promemoria per eventi e compiti.
            </p>
          </div>
        </div>
        
        {/* Other settings sections */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Aspetto</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Personalizzazione del tema (già implementato tramite toggle nella sidebar).</p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Account</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestione profilo utente (funzionalità futura).</p>
        </div>
        
        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Salva Impostazioni
          </button>
        </div>
      </div>
    </div>
  );
} 