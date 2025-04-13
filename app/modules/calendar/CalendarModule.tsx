'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  BookOpen, 
  Tag, 
  CheckCircle, 
  X,
  Filter,
  Trash2
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addDays, startOfDay, isPast, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { dbService, type CalendarEvent } from '@/app/lib/db';
import { SkeletonTheme } from 'react-loading-skeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CATEGORIES = [
  { name: 'compito', label: 'Compito in classe', color: 'bg-red-500' },
  { name: 'consegna', label: 'Consegna', color: 'bg-blue-500' },
  { name: 'interrogazione', label: 'Interrogazione', color: 'bg-purple-500' },
  { name: 'studio', label: 'Studio', color: 'bg-green-500' },
  { name: 'laboratorio', label: 'Laboratorio', color: 'bg-yellow-500' },
  { name: 'altro', label: 'Altro', color: 'bg-gray-500' }
];

export function CalendarModule() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [eventFormData, setEventFormData] = useState<Partial<CalendarEvent>>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load events from DB
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const dbEvents = await dbService.getCalendarEvents();
      setEvents(dbEvents);
    } catch (error) {
      console.error("Failed to load calendar events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Get days in current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Helper to get events for a specific day, respecting filters
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, day) && 
        (selectedFilters.length === 0 || selectedFilters.includes(event.category));
    });
  };

  // Navigate to next/previous month
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Open modal for creating event on a specific day
  const openCreateModalForDay = (day: Date) => {
    setSelectedEvent(null);
    setModalDate(day);
    setEventFormData({
      date: day.toISOString(),
      category: 'altro', // Default category
      color: 'bg-gray-500'
    });
    setShowEventModal(true);
  };
  
  // Open modal for editing an existing event
  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalDate(null); // Clear day selection
    setEventFormData({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      endTime: event.endTime,
      location: event.location,
      category: event.category,
      color: event.color
    });
    setShowEventModal(true);
  };
  
  // Handle saving (create or update)
  const handleSaveEvent = useCallback(async () => {
    if (!eventFormData.title || !eventFormData.date) return;

    const categoryInfo = CATEGORIES.find(cat => cat.name === eventFormData.category);
    const eventColor = categoryInfo?.color || 'bg-gray-500';
    const eventDataToSave = { ...eventFormData, color: eventColor };

    try {
      if (selectedEvent && selectedEvent.id !== undefined) {
        const eventToUpdate: CalendarEvent = { 
            ...selectedEvent, 
            ...eventDataToSave 
        };
        await dbService.updateCalendarEvent(eventToUpdate);
        setEvents(prevEvents => 
          prevEvents.map(ev => ev.id === eventToUpdate.id ? eventToUpdate : ev)
        );
      } else {
        const eventToCreate: Omit<CalendarEvent, 'id'> = {
          title: eventDataToSave.title || '',
          description: eventDataToSave.description,
          date: eventDataToSave.date,
          time: eventDataToSave.time,
          endTime: eventDataToSave.endTime,
          location: eventDataToSave.location,
          category: eventDataToSave.category || 'altro',
          color: eventDataToSave.color || 'bg-gray-500'
        };
        const newId = await dbService.addCalendarEvent(eventToCreate);
        const newEvent = await dbService.getCalendarEventById(newId);
        if (newEvent) {
          setEvents(prevEvents => [...prevEvents, newEvent]);
        }
      }
      setShowEventModal(false);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  }, [eventFormData, selectedEvent]);

  // Handle deleting an event
  const handleDeleteEvent = useCallback(async () => {
    // Ensure selectedEvent and its ID exist and are numbers
    if (!selectedEvent || typeof selectedEvent.id !== 'number') return;
    try {
      await dbService.deleteCalendarEvent(selectedEvent.id); // Pass the numeric ID
      setEvents(prevEvents => prevEvents.filter(ev => ev.id !== selectedEvent.id));
      setShowEventModal(false);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  }, [selectedEvent]);
  
  // Toggle category filter
  const toggleFilter = (category: string) => {
    setSelectedFilters(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Check if a day has events (respecting filters)
  const dayHasEvents = (day: Date) => {
    return events.some(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, day) && 
        (selectedFilters.length === 0 || selectedFilters.includes(event.category));
    });
  };
  
  if (isLoading) {
      return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
          <div className="min-h-full bg-white dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
              <Skeleton height={40} width={300} style={{ marginBottom: '2rem' }} />
              <Skeleton height={50} style={{ marginBottom: '1.5rem' }} />
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
                  <Skeleton height={30} width={200} style={{ marginBottom: '1rem' }} />
                  <Skeleton height={400} /> 
              </div>
            </div>
          </div>
        </SkeletonTheme>
      );
  }
  
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="min-h-full bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light flex items-center">
              <Calendar className="h-8 w-8 mr-3" />
              Calendario
            </h1>
            
            <div className="flex items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtri {selectedFilters.length > 0 && `(${selectedFilters.length})`}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtra per categoria:</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.name}
                    onClick={() => toggleFilter(category.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-colors ${
                      selectedFilters.includes(category.name)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${category.color} mr-1.5`}></span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: it })}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Mese precedente"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Oggi
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Mese successivo"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                <div 
                  key={day} 
                  className="py-3 bg-gray-50 dark:bg-gray-800 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>
          
            <div className="grid grid-cols-7 grid-rows-6 gap-px bg-gray-200 dark:bg-gray-700">
              {daysInMonth.map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                const dayEvents = getEventsForDay(day);
                
                return (
                  <div 
                    key={day.toString()}
                    onClick={() => openCreateModalForDay(day)}
                    className={`relative min-h-[120px] p-2 flex flex-col bg-white dark:bg-gray-800 group transition-colors ${ 
                      !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-850 opacity-70' : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                    } cursor-pointer`}
                  >
                    <span className={`text-sm font-medium mb-1 self-end ${ 
                      isToday ? 'text-white bg-primary dark:bg-primary-light rounded-full px-1.5' : 
                      isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600' 
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    <div className="flex-1 overflow-hidden space-y-1">
                      {dayEvents.map((event) => (
                        <button 
                          key={event.id}
                          onClick={(e) => { e.stopPropagation(); openEditModal(event); }}
                          className={`block w-full text-left px-1.5 py-0.5 rounded text-xs font-medium text-white truncate ${event.color} hover:opacity-80`}
                          title={event.title}
                        >
                          {event.time && `${event.time} `}{event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={() => openCreateModalForDay(new Date())}
            className="fixed bottom-6 right-6 bg-primary hover:bg-primary-light text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
            aria-label="Aggiungi nuovo evento"
          >
            <Plus className="h-6 w-6" />
          </button>
          
          {showEventModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {selectedEvent ? 'Modifica evento' : 'Nuovo evento'}
                  </h3>
                  <button 
                    onClick={() => setShowEventModal(false)}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-500"
                    aria-label="Chiudi modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Titolo*
                    </label>
                    <input
                      id="event-title"
                      type="text"
                      value={eventFormData.title || ''}
                      onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                      placeholder="Titolo dell'evento"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descrizione
                    </label>
                    <textarea
                      id="event-description"
                      value={eventFormData.description || ''}
                      onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                      placeholder="Descrizione dell'evento"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data*
                      </label>
                      <input
                        id="event-date"
                        type="date"
                        value={eventFormData.date ? format(parseISO(eventFormData.date), 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = e.target.value ? startOfDay(new Date(e.target.value)) : null; // Ensure we use start of day
                          setEventFormData({...eventFormData, date: date ? date.toISOString() : ''});
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="event-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Categoria
                      </label>
                      <select
                        id="event-category"
                        value={eventFormData.category || 'altro'}
                        onChange={(e) => {
                          const category = e.target.value;
                          const categoryInfo = CATEGORIES.find(cat => cat.name === category);
                          setEventFormData({
                            ...eventFormData, 
                            category,
                            color: categoryInfo?.color || 'bg-gray-500'
                          });
                        }}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.name} value={cat.name}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="event-start-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ora inizio
                      </label>
                      <input
                        id="event-start-time"
                        type="time"
                        value={eventFormData.time || ''}
                        onChange={(e) => setEventFormData({...eventFormData, time: e.target.value})}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="event-end-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ora fine
                      </label>
                      <input
                        id="event-end-time"
                        type="time"
                        value={eventFormData.endTime || ''}
                        onChange={(e) => setEventFormData({...eventFormData, endTime: e.target.value})}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Luogo
                    </label>
                    <input
                      id="event-location"
                      type="text"
                      value={eventFormData.location || ''}
                      onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                      placeholder="Luogo dell'evento"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <div>
                      {selectedEvent && (
                        <button
                          onClick={handleDeleteEvent}
                          className="flex items-center px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Elimina
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowEventModal(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Annulla
                      </button>
                      <button
                        onClick={handleSaveEvent}
                        disabled={!eventFormData.title || !eventFormData.date}
                        className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow hover:shadow-md"
                      >
                        Salva
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Prossimi Eventi
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              {events
                .filter(event => {
                  const eventDate = parseISO(event.date);
                  // Correctly use imported isPast and isToday
                  return (!isPast(eventDate) || isToday(eventDate))
                      && (selectedFilters.length === 0 || selectedFilters.includes(event.category));
                })
                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                .slice(0, 5)
                .map(event => (
                  <button 
                    key={event.id}
                    onClick={() => openEditModal(event)}
                    className="w-full text-left flex border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className={`${event.color} w-1 flex-shrink-0 self-stretch rounded-full mr-4`}></div>
                    <div className="min-w-[80px] text-sm mr-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {format(parseISO(event.date), 'dd MMM', { locale: it })}
                      </div>
                      {event.time && (
                        <div className="text-gray-500 dark:text-gray-400 flex items-center mt-1 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}{event.endTime && `-${event.endTime}`}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {CATEGORIES.find(cat => cat.name === event.category)?.label || 'Altro'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                
              {events.filter(event => {
                const eventDate = parseISO(event.date);
                // Correctly use imported isPast and isToday
                return (!isPast(eventDate) || isToday(eventDate)) && (selectedFilters.length === 0 || selectedFilters.includes(event.category));
              }).length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  Nessun evento imminente.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default CalendarModule; 