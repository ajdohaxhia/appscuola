'use client';

import { useState, useEffect } from 'react';
import { useStore } from './useStore';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const setOfflineStatus = useStore((state) => state.setOfflineStatus);
  const setPendingSyncStatus = useStore((state) => state.setPendingSyncStatus);

  useEffect(() => {
    // Funzione per aggiornare lo stato della rete
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setOfflineStatus(!online);
      
      // Se torniamo online dopo essere stati offline, attiva la sincronizzazione
      if (online && !isOnline) {
        setPendingSyncStatus(true);
        // In un'implementazione reale, qui avvieremmo la sincronizzazione
        // e poi imposteremmo isPendingSync a false al termine
        setTimeout(() => {
          setPendingSyncStatus(false);
        }, 3000);
      }
    };

    // Inizializza lo stato
    updateNetworkStatus();

    // Aggiungi i listener per gli eventi online e offline
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Pulisci i listener quando il componente viene smontato
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [isOnline, setOfflineStatus, setPendingSyncStatus]);

  return { isOnline };
}

// Hook per rilevare se l'app può essere installata come PWA
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const setInstallableStatus = useStore((state) => state.setInstallableStatus);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Impedisce la visualizzazione del mini-infobar mobile
      e.preventDefault();
      // Salva l'evento per poterlo attivare più tardi
      setDeferredPrompt(e);
      // Aggiorna lo stato per mostrare che l'app è installabile
      setInstallableStatus(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setInstallableStatus]);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    // Mostra il prompt di installazione
    deferredPrompt.prompt();

    // Attendi che l'utente risponda al prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Resetta la variabile deferredPrompt - può essere usata solo una volta
    setDeferredPrompt(null);
    setInstallableStatus(false);

    return choiceResult.outcome === 'accepted';
  };

  return { canInstall: !!deferredPrompt, installApp };
}

// Hook per il controllo del service worker
export function useServiceWorker() {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Quando il service worker viene aggiornato, mostra una notifica
      const handleUpdate = (registration: ServiceWorkerRegistration) => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
        }
      };

      // Registra il service worker
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        // Controlla se c'è già un service worker in attesa
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
          return;
        }

        // Quando lo stato cambia a "installed", controlla se c'è un nuovo service worker
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                handleUpdate(registration);
              }
            };
          }
        };
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });

      // Monitora le modifiche del service worker attivo
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // La pagina sta per essere ricaricata
      });
    }
  }, []);

  // Funzione per applicare l'aggiornamento
  const updateServiceWorker = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      setWaitingWorker(null);
      // La pagina si ricaricherà automaticamente grazie all'evento 'controllerchange'
    }
  };

  return { updateAvailable, updateServiceWorker };
} 