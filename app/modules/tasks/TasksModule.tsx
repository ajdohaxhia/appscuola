'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Tag, 
  Star,
  Filter,
  Trash2,
  Plus,
  PencilLine,
  AlertCircle,
  X
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, parseISO, isThisWeek } from 'date-fns';
import { it } from 'date-fns/locale';
import { dbService, type Task } from '@/app/lib/db';
import { SkeletonTheme } from 'react-loading-skeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTransition, animated } from '@react-spring/web';

const CATEGORIES = [
  'matematica',
  'fisica',
  'chimica',
  'italiano',
  'storia',
  'inglese',
  'informatica',
  'generale'
];

type TaskFilter = 'tutte' | 'oggi' | 'domani' | 'settimana' | 'completate' | 'in-ritardo';
type TaskSort = 'data-scadenza' | 'priorita' | 'data-creazione';

export function TasksModule() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('tutte');
  const [activeSort, setActiveSort] = useState<TaskSort>('data-scadenza');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
    priority: 'media',
    category: ''
  });
  
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const dbTasks = await dbService.getTasks();
      setTasks(dbTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.completed) return false;
    
    if (selectedCategory && task.category !== selectedCategory) return false;
    
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!task.description || !task.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    switch (activeFilter) {
      case 'oggi':
        return !task.completed && task.dueDate ? isToday(parseISO(task.dueDate)) : false;
      case 'domani':
        return !task.completed && task.dueDate ? isTomorrow(parseISO(task.dueDate)) : false;
      case 'settimana':
        return !task.completed && task.dueDate ? isThisWeek(parseISO(task.dueDate), { weekStartsOn: 1 }) : false;
      case 'completate':
        return task.completed;
      case 'in-ritardo':
        return !task.completed && task.dueDate ? isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) : false;
      case 'tutte':
      default:
        return true;
    }
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (activeFilter !== 'completate') {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
    }
    
    switch (activeSort) {
      case 'priorita':
        const priorityValues = { alta: 3, media: 2, bassa: 1 };
        return priorityValues[b.priority] - priorityValues[a.priority];
      case 'data-creazione':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'data-scadenza':
      default:
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
  });
  
  const toggleTaskStatus = useCallback(async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined
    };
    
    try {
      await dbService.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  }, [tasks]);
  
  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await dbService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }, []);
  
  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      completed: task.completed,
      priority: task.priority,
      category: task.category || ''
    });
    setShowTaskModal(true);
  }, []);
  
  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      completed: false,
      priority: 'media',
      category: ''
    });
    setShowTaskModal(true);
  }, []);
  
  const resetModalForm = () => {
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      completed: false,
      priority: 'media',
      category: ''
    });
    setEditingTask(null);
  }

  const saveTask = useCallback(async () => {
    if (!newTask.title) return;
    
    try {
      if (editingTask && editingTask.id !== undefined) {
        const updatedTaskData: Task = {
          ...editingTask,
          title: newTask.title || '',
          description: newTask.description,
          dueDate: newTask.dueDate,
          priority: newTask.priority as 'alta' | 'media' | 'bassa',
          category: newTask.category,
          updatedAt: new Date().toISOString()
        };
        await dbService.updateTask(updatedTaskData);
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === editingTask.id ? updatedTaskData : task)
        );
      } else {
        const taskToCreate: Omit<Task, 'id' | 'createdAt'> = {
          title: newTask.title || '',
          description: newTask.description,
          dueDate: newTask.dueDate,
          completed: false,
          priority: newTask.priority as 'alta' | 'media' | 'bassa',
          category: newTask.category,
        };
        const newId = await dbService.addTask(taskToCreate);
        const createdTask = await dbService.getTaskById(newId);
        if (createdTask) {
          setTasks(prevTasks => [...prevTasks, createdTask]);
        }
      }
      setShowTaskModal(false);
      resetModalForm();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }, [newTask, editingTask]);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-500 dark:text-red-400';
      case 'media': return 'text-orange-500 dark:text-orange-400';
      case 'bassa': return 'text-blue-500 dark:text-blue-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    const className = `h-4 w-4 ${getPriorityColor(priority)}`;
    switch (priority) {
      case 'alta': return <AlertCircle className={className} />;
      case 'media': return <Star className={className} />;
      case 'bassa': return <ChevronDown className={className} />;
      default: return <Circle className={className} />;
    }
  };
  
  const formatDueDate = (dueDate: string) => {
    const date = parseISO(dueDate);
    const timeFormat = 'HH:mm';
    
    if (isToday(date)) {
      return `Oggi, ${format(date, timeFormat, { locale: it })}`;
    } else if (isTomorrow(date)) {
      return `Domani, ${format(date, timeFormat, { locale: it })}`;
    } else {
      return format(date, 'dd MMM, HH:mm', { locale: it });
    }
  };
  
  // Task Modal Transition
  const modalTransition = useTransition(showTaskModal, {
    from: { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
    config: { tension: 280, friction: 25 },
  });
  
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="min-h-full bg-white dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 text-center">
            <Skeleton count={5} />
          </div>
        </div>
      </SkeletonTheme>
    )
  }

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="min-h-full bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light flex items-center">
              <CheckCircle className="h-8 w-8 mr-3" />
              Attività
            </h1>
            
            <button
              onClick={openCreateModal}
              className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors shadow hover:shadow-md"
            >
              <Plus className="h-5 w-5 mr-1" />
              Nuova attività
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:justify-between mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('tutte')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'tutte'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Tutte
              </button>
              <button
                onClick={() => setActiveFilter('oggi')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'oggi'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Oggi
              </button>
              <button
                onClick={() => setActiveFilter('domani')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'domani'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Domani
              </button>
              <button
                onClick={() => setActiveFilter('settimana')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'settimana'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Questa settimana
              </button>
              <button
                onClick={() => setActiveFilter('in-ritardo')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'in-ritardo'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                In ritardo
              </button>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap lg:flex-nowrap">
              <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                <input
                  type="text"
                  placeholder="Cerca attività..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                />
              </div>
              
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              >
                <option value="">Tutte le categorie</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as TaskSort)}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              >
                <option value="data-scadenza">Scadenza</option>
                <option value="priorita">Priorità</option>
                <option value="data-creazione">Data creazione</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors group"
            >
              <div className={`w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors ${
                showCompleted ? 'bg-primary border-primary' : 'border-gray-400 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-primary-light'
              }`}>
                {showCompleted && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              Mostra attività completate
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton height={80} count={5} />
              </div>
            ) : sortedTasks.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-4 transition-colors ${
                      task.completed 
                        ? 'bg-gray-50 dark:bg-gray-850' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => task.id !== undefined && toggleTaskStatus(task.id)}
                        className="flex-shrink-0 mt-1 focus:outline-none"
                        aria-label={task.completed ? 'Marca come da fare' : 'Marca come completata'}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className={`text-lg font-medium break-words ${
                            task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {task.title}
                          </h3>
                          
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {getPriorityIcon(task.priority)}
                            
                            <div className="flex">
                              <button 
                                onClick={() => openEditModal(task)}
                                className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
                                aria-label="Modifica attività"
                              >
                                <PencilLine className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => task.id !== undefined && deleteTask(task.id)}
                                className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                aria-label="Elimina attività"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm mt-1 break-words ${
                            task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap mt-2 gap-3 items-center">
                          {task.dueDate && (
                            <div className={`flex items-center text-xs px-2 py-0.5 rounded-full ${
                              task.completed
                                ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700'
                                : isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate))
                                  ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50'
                                  : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDueDate(task.dueDate)}
                            </div>
                          )}
                          
                          {task.category && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                              <Tag className="h-3 w-3 mr-1" />
                              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                            </div>
                          )}
                          
                          {task.completed && task.completedAt && (
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completata {format(parseISO(task.completedAt), 'dd MMM, HH:mm', { locale: it })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium">Nessuna attività trovata</p>
                <p className="text-sm mt-1">
                  {searchTerm || selectedCategory || activeFilter !== 'tutte'
                    ? 'Prova a modificare i criteri di ricerca o i filtri.'
                    : 'Crea la tua prima attività usando il pulsante +'
                  }
                </p>
              </div>
            )}
          </div>
          
          {/* Task Modal with Transition */} 
          {modalTransition((style, item) => 
            item ? (
              <TaskModal 
                style={style}
                task={editingTask} 
                initialData={newTask} 
                onSave={saveTask} 
                onClose={() => setShowTaskModal(false)}
                onReset={resetModalForm}
                categories={CATEGORIES}
              />
            ) : null
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}

// TaskModal Component receives style and uses animated.div
const TaskModal = ({ 
    style,
    task, 
    initialData, 
    onSave, 
    onClose, 
    onReset,
    categories
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
      setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
  };

  const handleClose = () => {
      onClose();
      setTimeout(() => {
          onReset();
      }, 300);
  }

  return (
    <animated.div 
      style={style}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative transform transition-all duration-300 ease-out" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
            <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            {task ? 'Modifica Compito' : 'Crea Nuovo Compito'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titolo <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    id="title"
                    name="title"
                    required
                    value={formData.title || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Es. Studiare capitolo 5 di Fisica"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrizione</label>
                <textarea 
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Dettagli aggiuntivi, link utili, ecc."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Scadenza</label>
                    <input 
                        type="datetime-local" 
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priorità</label>
                    <select 
                        id="priority"
                        name="priority"
                        value={formData.priority || 'media'}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                        <option value="bassa">Bassa</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                <select 
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                    <option value="">Nessuna categoria</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end pt-4 space-x-3">
                <button 
                    type="button" 
                    onClick={handleClose}
                    className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                    Annulla
                </button>
                <button 
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
                >
                    {task ? 'Salva Modifiche' : 'Crea Compito'}
                </button>
            </div>
        </form>
      </div>
    </animated.div>
  );
}; 