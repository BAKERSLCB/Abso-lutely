import { Plus, Play, Edit, Trash2, GripVertical } from 'lucide-react';
import { Routine, Exercise } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface RoutinesListProps {
  routines: Routine[];
  exercises: Exercise[];
  onCreateRoutine: () => void;
  onEditRoutine: (routineId: string) => void;
  onDeleteRoutine: (routineId: string) => void;
  onViewRoutine: (routineId: string) => void;
  onStartRoutine: (routineId: string) => void;
}

export function RoutinesList({
  routines,
  exercises,
  onCreateRoutine,
  onEditRoutine,
  onDeleteRoutine,
  onViewRoutine,
  onStartRoutine,
}: RoutinesListProps) {
  const getExerciseName = (id: string) => {
    return exercises.find((e) => e.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Routines</h1>
          <p className="text-muted-foreground">Manage your workout templates</p>
        </div>
        <Button onClick={onCreateRoutine} className="gap-2">
          <Plus className="size-4" />
          New Routine
        </Button>
      </div>

      {routines.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <GripVertical className="size-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="mb-2">No routines yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first routine to start tracking workouts
            </p>
            <Button onClick={onCreateRoutine} className="gap-2">
              <Plus className="size-4" />
              Create Routine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => (
            <Card key={routine.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onViewRoutine(routine.id)}
                  >
                    <h3 className="mb-2">{routine.name}</h3>
                    <p className="text-muted-foreground mb-3">
                      {routine.exercises.length} exercise
                      {routine.exercises.length !== 1 ? 's' : ''}
                    </p>
                    {routine.exercises.length > 0 && (
                      <div className="space-y-1">
                        {routine.exercises.slice(0, 4).map((ex, index) => (
                          <div key={index} className="text-muted-foreground">
                            {getExerciseName(ex.exerciseId)} - {ex.sets}x{ex.reps}
                          </div>
                        ))}
                        {routine.exercises.length > 4 && (
                          <div className="text-muted-foreground">
                            +{routine.exercises.length - 4} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditRoutine(routine.id)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteRoutine(routine.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onStartRoutine(routine.id)}
                      className="gap-2"
                    >
                      <Play className="size-4" />
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
