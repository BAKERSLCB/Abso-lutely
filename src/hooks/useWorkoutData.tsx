import { useState, useEffect } from 'react';
import { Exercise, Routine, WorkoutSession, Equipment } from '../types';

const STORAGE_KEYS = {
  exercises: 'workout-tracker-exercises',
  routines: 'workout-tracker-routines',
  sessions: 'workout-tracker-sessions',
};

export function useWorkoutData() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedExercises = localStorage.getItem(STORAGE_KEYS.exercises);
      const savedRoutines = localStorage.getItem(STORAGE_KEYS.routines);
      const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions);

      if (savedExercises) setExercises(JSON.parse(savedExercises));
      if (savedRoutines) setRoutines(JSON.parse(savedRoutines));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save exercises to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.exercises, JSON.stringify(exercises));
    }
  }, [exercises, isLoaded]);

  // Save routines to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.routines, JSON.stringify(routines));
    }
  }, [routines, isLoaded]);

  // Save sessions to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  // Exercise operations
  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, exercise]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
    );
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
    // Also remove from routines
    setRoutines((prev) =>
      prev.map((routine) => ({
        ...routine,
        exercises: routine.exercises.filter((ex) => ex.exerciseId !== id),
      }))
    );
  };

  // Routine operations
  const addRoutine = (routine: Routine) => {
    setRoutines((prev) => [...prev, routine]);
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    setRoutines((prev) =>
      prev.map((routine) => (routine.id === id ? { ...routine, ...updates } : routine))
    );
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== id));
  };

  // Session operations
  const addSession = (session: WorkoutSession) => {
    setSessions((prev) => [session, ...prev]);
  };

  const updateSession = (id: string, updates: Partial<WorkoutSession>) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, ...updates } : session))
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  // Get exercise history
  const getExerciseHistory = (exerciseId: string, limit: number = 3) => {
    const completedSessions = sessions
      .filter((s) => s.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const history: {
      date: string;
      routineName: string;
      equipment?: Equipment;
      sets: {
        reps: number;
        weight?: number;
        notes?: string;
        tags?: string[];
      }[];
    }[] = [];

    for (const session of completedSessions) {
      const exercise = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (exercise && exercise.sets.length > 0) {
        const completedSets = exercise.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          history.push({
            date: session.date,
            routineName: session.routineName,
            equipment: exercise.equipment,
            sets: completedSets.map((s) => ({
              reps: s.reps,
              weight: s.weight,
              notes: s.notes,
              tags: s.tags,
            })),
          });
        }
      }

      if (history.length >= limit) break;
    }

    return history;
  };

  // Get recent sessions
  const getRecentSessions = (limit: number = 5) => {
    return [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Get routine history
  const getRoutineHistory = (routineId: string) => {
    return sessions
      .filter((s) => s.routineId === routineId && s.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    exercises,
    routines,
    sessions,
    addExercise,
    updateExercise,
    deleteExercise,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    addSession,
    updateSession,
    deleteSession,
    getExerciseHistory,
    getRecentSessions,
    getRoutineHistory,
  };
}