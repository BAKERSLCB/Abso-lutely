import { useState } from 'react';
import { Home, Dumbbell, Library, History } from 'lucide-react';
import { useWorkoutData } from './hooks/useWorkoutData';
import { Dashboard } from './components/Dashboard';
import { RoutinesList } from './components/RoutinesList';
import { RoutineDetails } from './components/RoutineDetails';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { WorkoutSession } from './components/WorkoutSession';
import { WorkoutHistory } from './components/WorkoutHistory';
import { CreateRoutineModal } from './components/CreateRoutineModal';
import { CreateExerciseModal } from './components/CreateExerciseModal';
import { ExerciseHistoryModal } from './components/ExerciseHistoryModal';
import {
  Routine,
  Exercise,
  WorkoutSession as WorkoutSessionType,
  WorkoutSet,
} from './types';

type Screen = 'home' | 'routines' | 'library' | 'history';
type View =
  | { type: 'main'; screen: Screen }
  | { type: 'routine-details'; routineId: string }
  | { type: 'workout-session'; sessionId: string };

export default function App() {
  const {
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
  } = useWorkoutData();

  const [currentView, setCurrentView] = useState<View>({
    type: 'main',
    screen: 'home',
  });
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | undefined>();
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();
  const [historyExerciseId, setHistoryExerciseId] = useState<string | null>(null);

  // Navigation handlers
  const handleTabChange = (screen: Screen) => {
    setCurrentView({ type: 'main', screen });
  };

  const handleViewRoutine = (routineId: string) => {
    setCurrentView({ type: 'routine-details', routineId });
  };

  const handleStartRoutine = (routineId: string) => {
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    // Create a new workout session
    const newSession: WorkoutSessionType = {
      id: crypto.randomUUID(),
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      exercises: routine.exercises.map((ex) => {
        const exercise = exercises.find((e) => e.id === ex.exerciseId);
        return {
          exerciseId: ex.exerciseId,
          exerciseName: exercise?.name || 'Unknown',
          equipment: ex.equipment || exercise?.equipment,
          sets: Array.from({ length: ex.sets }, () => ({
            id: crypto.randomUUID(),
            exerciseId: ex.exerciseId,
            reps: ex.reps,
            weight: undefined,
            notes: '',
            tags: [],
            completed: false,
          })),
        };
      }),
      completed: false,
    };

    addSession(newSession);
    setCurrentView({ type: 'workout-session', sessionId: newSession.id });
  };

  // Routine handlers
  const handleCreateRoutine = () => {
    setEditingRoutine(undefined);
    setIsRoutineModalOpen(true);
  };

  const handleEditRoutine = (routineId: string) => {
    const routine = routines.find((r) => r.id === routineId);
    setEditingRoutine(routine);
    setIsRoutineModalOpen(true);
  };

  const handleSaveRoutine = (routine: Routine) => {
    if (editingRoutine) {
      updateRoutine(routine.id, routine);
    } else {
      addRoutine(routine);
    }
    setIsRoutineModalOpen(false);
    setEditingRoutine(undefined);
  };

  const handleDeleteRoutine = (routineId: string) => {
    if (confirm('Are you sure you want to delete this routine?')) {
      deleteRoutine(routineId);
      if (
        currentView.type === 'routine-details' &&
        currentView.routineId === routineId
      ) {
        setCurrentView({ type: 'main', screen: 'routines' });
      }
    }
  };

  // Exercise handlers
  const handleCreateExercise = () => {
    setEditingExercise(undefined);
    setIsExerciseModalOpen(true);
  };

  const handleEditExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    setEditingExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExercise) {
      updateExercise(exercise.id, exercise);
    } else {
      addExercise(exercise);
    }
    setIsExerciseModalOpen(false);
    setEditingExercise(undefined);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (confirm('Are you sure you want to delete this exercise?')) {
      deleteExercise(exerciseId);
    }
  };

  // History handlers
  const handleViewHistory = (exerciseId: string) => {
    setHistoryExerciseId(exerciseId);
    setIsHistoryModalOpen(true);
  };

  // Workout session handlers
  const handleUpdateSession = (
    sessionId: string,
    updates: Partial<WorkoutSessionType>
  ) => {
    updateSession(sessionId, updates);
  };

  const handleFinishWorkout = (sessionId: string) => {
    updateSession(sessionId, { completed: true });
    setCurrentView({ type: 'main', screen: 'home' });
  };

  const handleCancelWorkout = (sessionId: string) => {
    if (confirm('Are you sure you want to cancel this workout?')) {
      deleteSession(sessionId);
      setCurrentView({ type: 'main', screen: 'home' });
    }
  };

  // Render current view
  const renderContent = () => {
    if (currentView.type === 'workout-session') {
      const session = sessions.find((s) => s.id === currentView.sessionId);
      if (!session) {
        setCurrentView({ type: 'main', screen: 'home' });
        return null;
      }

      return (
        <WorkoutSession
          session={session}
          exercises={exercises}
          onUpdateSession={(updates) =>
            handleUpdateSession(session.id, updates)
          }
          onFinishWorkout={() => handleFinishWorkout(session.id)}
          onCancel={() => handleCancelWorkout(session.id)}
          onViewHistory={handleViewHistory}
        />
      );
    }

    if (currentView.type === 'routine-details') {
      const routine = routines.find((r) => r.id === currentView.routineId);
      if (!routine) {
        setCurrentView({ type: 'main', screen: 'routines' });
        return null;
      }

      return (
        <RoutineDetails
          routine={routine}
          exercises={exercises}
          routineHistory={getRoutineHistory(routine.id)}
          onBack={() => setCurrentView({ type: 'main', screen: 'routines' })}
          onStartWorkout={() => handleStartRoutine(routine.id)}
          onEdit={() => handleEditRoutine(routine.id)}
        />
      );
    }

    // Main screens
    switch (currentView.screen) {
      case 'home':
        return (
          <Dashboard
            routines={routines}
            recentSessions={getRecentSessions()}
            exercises={exercises}
            onStartRoutine={handleStartRoutine}
            onViewSession={(sessionId) => {
              // For now, just go to home. Could add session details view later
              console.log('View session:', sessionId);
            }}
          />
        );

      case 'routines':
        return (
          <RoutinesList
            routines={routines}
            exercises={exercises}
            onCreateRoutine={handleCreateRoutine}
            onEditRoutine={handleEditRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onViewRoutine={handleViewRoutine}
            onStartRoutine={handleStartRoutine}
          />
        );

      case 'library':
        return (
          <ExerciseLibrary
            exercises={exercises}
            onCreateExercise={handleCreateExercise}
            onEditExercise={handleEditExercise}
            onDeleteExercise={handleDeleteExercise}
            onViewHistory={handleViewHistory}
          />
        );

      case 'history':
        return (
          <WorkoutHistory sessions={sessions} />
        );
    }
  };

  const showBottomNav = currentView.type !== 'workout-session';

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className={showBottomNav ? 'pb-20' : ''}>{renderContent()}</main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="flex items-center justify-around p-3">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView.type === 'main' && currentView.screen === 'home'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Home className="size-5" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => handleTabChange('routines')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView.type === 'main' && currentView.screen === 'routines'
                  ? 'text-primary bg-primary/10'
                  : currentView.type === 'routine-details'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Dumbbell className="size-5" />
              <span className="text-xs">Routines</span>
            </button>
            <button
              onClick={() => handleTabChange('library')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView.type === 'main' && currentView.screen === 'library'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Library className="size-5" />
              <span className="text-xs">Library</span>
            </button>
            <button
              onClick={() => handleTabChange('history')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView.type === 'main' && currentView.screen === 'history'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="size-5" />
              <span className="text-xs">History</span>
            </button>
          </div>
        </nav>
      )}

      {/* Modals */}
      <CreateRoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => {
          setIsRoutineModalOpen(false);
          setEditingRoutine(undefined);
        }}
        onSave={handleSaveRoutine}
        exercises={exercises}
        editingRoutine={editingRoutine}
      />

      <CreateExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => {
          setIsExerciseModalOpen(false);
          setEditingExercise(undefined);
        }}
        onSave={handleSaveExercise}
        editingExercise={editingExercise}
      />

      <ExerciseHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setHistoryExerciseId(null);
        }}
        exercise={
          historyExerciseId
            ? exercises.find((e) => e.id === historyExerciseId) || null
            : null
        }
        history={
          historyExerciseId ? getExerciseHistory(historyExerciseId) : []
        }
      />
    </div>
  );
}