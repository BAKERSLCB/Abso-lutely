export type SetTag = 'warmup' | 'dropset' | 'superset' | 'failure';

export type Equipment = 'Barbell' | 'Dumbbell' | 'Cable' | 'Smith Machine' | 'Machine';

export type ExerciseTag = 'Push' | 'Pull' | 'Upper' | 'Lower' | 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core' | 'Cardio';

export interface Set {
  id: string;
  reps: number;
  weight?: number;
  notes?: string;
  tags?: SetTag[];
}

export interface Exercise {
  id: string;
  name: string;
  equipment?: Equipment;
  tags?: ExerciseTag[];
  createdAt: string;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number; // Default number of sets
  reps: number; // Default number of reps
  equipment?: Equipment; // Optional equipment override
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  reps: number;
  weight?: number;
  notes?: string;
  tags?: SetTag[];
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    equipment?: Equipment;
    sets: WorkoutSet[];
  }[];
  completed: boolean;
}