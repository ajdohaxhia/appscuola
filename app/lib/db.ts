import Dexie, { type Table } from 'dexie';

// Define interfaces for the database tables

export interface Note {
  id?: number;
  title: string;
  content: string; // HTML content from Tiptap
  plainTextContent?: string; // Plain text version for search
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  attachments?: { name: string; type: string; url: string }[];
}

export interface FlashcardSet {
  id?: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  icon?: string;
}

export interface Flashcard {
  id?: number;
  setId: number;
  front: string;
  back: string;
  interval: number; // Current interval in days
  easeFactor: number; // Ease factor (determines how quickly the interval grows)
  repetitions: number; // Number of times the card has been reviewed successfully in a row
  dueDate: Date; // When the card is next due for review
  createdAt?: Date; // Added: When the card was created
  lastReviewed?: Date; // Added: When the card was last reviewed
}

export interface MindMap {
  id?: number;
  title: string;
  nodes: string; // JSON stringified React Flow nodes
  edges: string; // JSON stringified React Flow edges
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  thumbnail?: string; // Data URL or path
}

export interface AISession {
  id?: number;
  title: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

export interface UserImage {
  id?: number;
  filename: string;
  url: string; // Typically a blob URL for local data
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  title?: string;
  description?: string;
  tags?: string[];
  uploadDate: Date;
  userId?: string; // For future use if auth is added
}

export interface CalendarEvent {
  id?: number;
  title: string;
  description?: string;
  date: string; // ISO string
  time?: string;
  endTime?: string;
  location?: string;
  category: string;
  isCompleted?: boolean;
  color: string; // Hex or Tailwind class
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  completed: boolean;
  priority: 'alta' | 'media' | 'bassa';
  category?: string;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
  updatedAt?: string; // Added updatedAt field
}

export interface GamificationData {
  id?: 'singleton'; // Use a single entry for gamification data
  points: number;
  level: number;
  streak: number;
  longestStreak: number;
  achievementsCompleted: string[]; // Array of achievement IDs
  badgesAcquired: { [key: string]: number }; // Badge ID: level
}

// Define the Database Class
export class AppScuolaDB extends Dexie {
  // Declare tables
  notes!: Table<Note, number>; 
  flashcardSets!: Table<FlashcardSet, number>;
  flashcards!: Table<Flashcard, number>;
  mindMaps!: Table<MindMap, number>;
  aiSessions!: Table<AISession, number>;
  userImages!: Table<UserImage, number>;
  calendarEvents!: Table<CalendarEvent, number>;
  tasks!: Table<Task, number>;
  gamification!: Table<GamificationData, string>; // Use string 'singleton' as key

  constructor() {
    super('AppScuolaDB');
    this.version(1).stores({
      notes: '++id, title, *tags, createdAt, updatedAt, isPinned', // Index common fields
      flashcardSets: '++id, title, category, createdAt, updatedAt',
      flashcards: '++id, setId, nextReviewDate, interval, repetitions',
      mindMaps: '++id, title, *tags, createdAt, updatedAt',
      aiSessions: '++id, title, createdAt, updatedAt, model',
      userImages: '++id, filename, mimeType, uploadDate, *tags',
      calendarEvents: '++id, date, category, isCompleted',
      tasks: '++id, dueDate, priority, category, completed, createdAt',
      gamification: '&id' // Singleton pattern using a known key
    });
    this.version(2).stores({
      tasks: '++id, dueDate, priority, category, completed, createdAt, updatedAt' // Add updatedAt index in version 2
    }).upgrade(tx => {
      console.log("Upgrading database to version 2 for Tasks table.");
    });
  }

  // Add methods for common operations here (optional, can be done in services)
  // Example: getNotes, addNote, updateNote, deleteNote etc.
  // Example: getTasks, addTask, updateTask, deleteTask etc.
  
  // Example method to get notes
  async getNotes(): Promise<Note[]> {
    return this.notes.orderBy('updatedAt').reverse().toArray();
  }

  // Example method to add a note
  async addNote(note: Omit<Note, 'id'>): Promise<number> {
    return this.notes.add(note as Note);
  }
  
  // Example method to update a note
  async updateNote(note: Note): Promise<number> {
    if (note.id === undefined) {
      throw new Error("Cannot update note without an ID");
    }
    return this.notes.update(note.id, note);
  }
  
  // Example method to delete a note
  async deleteNote(id: number): Promise<void> {
    return this.notes.delete(id);
  }
  
  // Image methods
  async createImage(image: Omit<UserImage, 'id'>): Promise<number> {
    return this.userImages.add(image as UserImage);
  }
  
  async getUserImages(userId?: string): Promise<UserImage[]> {
      // For now, return all images as there's no user auth
      return this.userImages.toArray();
  }
  
  async deleteImage(imageId: number): Promise<boolean> {
    try {
      await this.userImages.delete(imageId);
      return true;
    } catch (error) {
      console.error("Failed to delete image:", error);
      return false;
    }
  }
  
  async updateImageMetadata(imageId: number, metadata: Partial<Pick<UserImage, 'title' | 'description' | 'tags'>>): Promise<boolean> {
     try {
      const updatedCount = await this.userImages.update(imageId, metadata);
      return updatedCount > 0;
    } catch (error) {
      console.error("Failed to update image metadata:", error);
      return false;
    }
  }

  // Add methods for Tasks
  async getTasks(): Promise<Task[]> {
    return this.tasks.toArray();
  }
  
  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    return this.tasks.add({ ...task, createdAt: now, updatedAt: now } as Task);
  }
  
  async updateTask(task: Task): Promise<number> {
    if (task.id === undefined) {
      throw new Error("Cannot update task without an ID");
    }
    task.updatedAt = new Date().toISOString();
    return this.tasks.update(task.id, task);
  }
  
  async deleteTask(id: number): Promise<void> {
    return this.tasks.delete(id);
  }

  // Add methods for Calendar Events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return this.calendarEvents.toArray();
  }
  
  async addCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<number> {
    return this.calendarEvents.add(event as CalendarEvent);
  }
  
  async updateCalendarEvent(event: CalendarEvent): Promise<number> {
    if (event.id === undefined) {
      throw new Error("Cannot update calendar event without an ID");
    }
    return this.calendarEvents.update(event.id, event);
  }
  
  async deleteCalendarEvent(id: number): Promise<void> {
    return this.calendarEvents.delete(id);
  }
  
  // Add getTaskById method to the class
  async getTaskById(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getNoteById(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  // Add getCalendarEventById method
  async getCalendarEventById(id: number): Promise<CalendarEvent | undefined> {
    return this.calendarEvents.get(id);
  }
  
  // --- Flashcard Set Methods ---
  async getFlashcardSets(): Promise<FlashcardSet[]> {
    return this.flashcardSets.orderBy('updatedAt').reverse().toArray();
  }
  async addFlashcardSet(set: Omit<FlashcardSet, 'id'>): Promise<number> {
    return this.flashcardSets.add(set as FlashcardSet);
  }
  async getFlashcardSetById(id: number): Promise<FlashcardSet | undefined> {
    return this.flashcardSets.get(id);
  }
  async updateFlashcardSet(set: FlashcardSet): Promise<number> {
    if (set.id === undefined) throw new Error("Cannot update FlashcardSet without ID");
    return this.flashcardSets.update(set.id, set);
  }
  async deleteFlashcardSet(id: number): Promise<void> {
    // Use transaction to delete set and its cards atomically
    return this.transaction('rw', this.flashcardSets, this.flashcards, async () => {
      await this.flashcards.where({ setId: id }).delete();
      await this.flashcardSets.delete(id);
    });
  }

  // --- Flashcard Methods ---
  async getFlashcardsBySetId(setId: number): Promise<Flashcard[]> {
    return this.flashcards.where({ setId: setId }).toArray();
  }
  async addFlashcard(card: Omit<Flashcard, 'id'>): Promise<number> {
    return await this.flashcards.add(card); // Let Dexie handle adding the object
  }
  async getFlashcardById(id: number): Promise<Flashcard | undefined> {
    return this.flashcards.get(id);
  }
  async updateFlashcard(card: Flashcard): Promise<number> {
    if (card.id === undefined) throw new Error("Cannot update Flashcard without ID");
    return this.flashcards.update(card.id, card);
  }
  async deleteFlashcard(id: number): Promise<void> {
    return this.flashcards.delete(id);
  }
  
  // ... add methods for other tables as needed ...
}

// Export a single instance of the DB
export const db = new AppScuolaDB();

// Service Layer (Optional, but good practice)
// You can create service classes/functions that use the `db` instance
// Example:

export const dbService = {
  async getNotes(): Promise<Note[]> {
    return db.notes.orderBy('updatedAt').reverse().toArray();
  },
  async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    return db.notes.add({ ...note, createdAt: now, updatedAt: now });
  },
  async updateNote(note: Note): Promise<number> {
    if (note.id === undefined) throw new Error("ID required for update");
    return db.notes.update(note.id, { ...note, updatedAt: new Date() });
  },
  async deleteNote(id: number): Promise<void> {
    return db.notes.delete(id);
  },
  
  // Image methods
  async createImage(image: Omit<UserImage, 'id' | 'uploadDate'>): Promise<number> {
    return db.userImages.add({ ...image, uploadDate: new Date() } as UserImage);
  },
  getUserImages: db.getUserImages.bind(db),
  deleteImage: db.deleteImage.bind(db),
  updateImageMetadata: db.updateImageMetadata.bind(db),
  
  // Task methods
  async getTasks(): Promise<Task[]> {
    return db.tasks.orderBy('createdAt').reverse().toArray();
  },
  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    return db.tasks.add({ ...task, createdAt: now, updatedAt: now } as Task);
  },
  async updateTask(task: Task): Promise<number> {
    if (task.id === undefined) throw new Error("ID required for update");
    return db.updateTask(task);
  },
  async deleteTask(id: number): Promise<void> {
    return db.tasks.delete(id);
  },
  async getTaskById(id: number): Promise<Task | undefined> {
    return db.getTaskById(id);
  },
  
  // Calendar Event methods
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return db.calendarEvents.toArray();
  },
  async addCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<number> {
    return db.calendarEvents.add(event as CalendarEvent);
  },
  async updateCalendarEvent(event: CalendarEvent): Promise<number> {
    if (event.id === undefined) throw new Error("ID required for update");
    return db.calendarEvents.update(event.id, event);
  },
  async deleteCalendarEvent(id: number): Promise<void> {
    return db.calendarEvents.delete(id);
  },
  // Add getCalendarEventById to service
  async getCalendarEventById(id: number): Promise<CalendarEvent | undefined> {
    return db.getCalendarEventById(id);
  },
  
  // Add getNoteById to service
  async getNoteById(id: number): Promise<Note | undefined> {
    return db.getNoteById(id);
  },

  // Flashcard Set Methods
  async getFlashcardSets(): Promise<FlashcardSet[]> {
    return db.getFlashcardSets();
  },
  async addFlashcardSet(set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    return db.addFlashcardSet({ ...set, createdAt: now, updatedAt: now });
  },
  async getFlashcardSetById(id: number): Promise<FlashcardSet | undefined> {
    return db.getFlashcardSetById(id);
  },
  async updateFlashcardSet(set: FlashcardSet): Promise<number> {
    if (set.id === undefined) throw new Error("ID required for update");
    return db.updateFlashcardSet({ ...set, updatedAt: new Date() });
  },
  async deleteFlashcardSet(id: number): Promise<void> {
    return db.deleteFlashcardSet(id);
  },

  // Flashcard Methods
  async getFlashcardsBySetId(setId: number): Promise<Flashcard[]> {
    return db.getFlashcardsBySetId(setId);
  },
  async addFlashcard(cardData: Pick<Flashcard, 'setId' | 'front' | 'back'>): Promise<number> {
    const now = new Date();
    // Set initial dueDate (e.g., review today/now)
    const initialDueDate = new Date(now); 

    const newCard: Omit<Flashcard, 'id'> = {
      ...cardData,
      interval: 0, // Start with interval 0
      easeFactor: 2.5, // Standard starting ease factor
      repetitions: 0, // No repetitions yet
      dueDate: initialDueDate, // Due immediately for first review
      createdAt: now, // Set creation date
      lastReviewed: now // Set lastReviewed date
    };

    return await db.addFlashcard(newCard);
  },
  async getFlashcardById(id: number): Promise<Flashcard | undefined> {
    return db.getFlashcardById(id);
  },
  async updateFlashcard(card: Flashcard): Promise<number> {
    // Add updatedAt logic if needed for flashcards
    return db.updateFlashcard(card);
  },
  async deleteFlashcard(id: number): Promise<void> {
    return db.deleteFlashcard(id);
  },
}; 