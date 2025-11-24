import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Check,
  History,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { WorkoutSession as WorkoutSessionType, WorkoutSet, Exercise } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

interface WorkoutSessionProps {
  session: WorkoutSessionType;
  exercises: Exercise[];
  onUpdateSession: (updates: Partial<WorkoutSessionType>) => void;
  onFinishWorkout: () => void;
  onCancel: () => void;
  onViewHistory: (exerciseId: string) => void;
}

export function WorkoutSession({
  session,
  exercises,
  onUpdateSession,
  onFinishWorkout,
  onCancel,
  onViewHistory,
}: WorkoutSessionProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(
    session.exercises[0]?.exerciseId || null
  );

  const updateSet = (
    exerciseId: string,
    setId: string,
    updates: Partial<WorkoutSet>
  ) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map((set) =>
            set.id === setId ? { ...set, ...updates } : set
          ),
        };
      }
      return ex;
    });

    onUpdateSession({ exercises: updatedExercises });
  };

  const addSet = (exerciseId: string) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: WorkoutSet = {
          id: crypto.randomUUID(),
          exerciseId,
          reps: lastSet?.reps || 10,
          weight: lastSet?.weight,
          notes: '',
          tags: [],
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    });

    onUpdateSession({ exercises: updatedExercises });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter((set) => set.id !== setId),
        };
      }
      return ex;
    });

    onUpdateSession({ exercises: updatedExercises });
  };

  const toggleSetCompleted = (exerciseId: string, setId: string) => {
    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map((set) =>
            set.id === setId ? { ...set, completed: !set.completed } : set
          ),
        };
      }
      return ex;
    });

    onUpdateSession({ exercises: updatedExercises });
  };

  const getTotalCompletedSets = () => {
    return session.exercises.reduce(
      (total, ex) => total + ex.sets.filter((s) => s.completed).length,
      0
    );
  };

  const getTotalSets = () => {
    return session.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2>{session.routineName}</h2>
              <p className="text-muted-foreground">
                {getTotalCompletedSets()} / {getTotalSets()} sets completed
              </p>
            </div>
          </div>
          <Button onClick={onFinishWorkout} className="gap-2">
            <CheckCircle2 className="size-4" />
            Finish
          </Button>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{
              width: `${
                getTotalSets() > 0
                  ? (getTotalCompletedSets() / getTotalSets()) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-4">
        {session.exercises.map((exercise, exIndex) => {
          const isExpanded = expandedExercise === exercise.exerciseId;
          const completedSets = exercise.sets.filter((s) => s.completed).length;

          return (
            <Card key={exercise.exerciseId}>
              <CardHeader
                className="cursor-pointer"
                onClick={() =>
                  setExpandedExercise(
                    isExpanded ? null : exercise.exerciseId
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {exIndex + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {exercise.exerciseName}
                        {exercise.equipment && (
                          <Badge variant="secondary" className="text-xs">
                            {exercise.equipment}
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {completedSets} / {exercise.sets.length} sets completed
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewHistory(exercise.exerciseId);
                    }}
                    className="gap-2"
                  >
                    <History className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-3">
                  {/* Set Headers */}
                  <div className="grid grid-cols-[auto_1fr_80px_80px_auto_auto] gap-2 px-2 text-muted-foreground">
                    <div className="w-8"></div>
                    <div>Set</div>
                    <div>Reps</div>
                    <div>Weight</div>
                    <div></div>
                    <div></div>
                  </div>

                  {/* Sets */}
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      className={`grid grid-cols-[auto_1fr_80px_80px_auto_auto] gap-2 items-center p-2 rounded-lg border ${
                        set.completed ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <Checkbox
                        checked={set.completed}
                        onCheckedChange={() =>
                          toggleSetCompleted(exercise.exerciseId, set.id)
                        }
                      />
                      <div>{setIndex + 1}</div>
                      <Input
                        type="number"
                        min="1"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(exercise.exerciseId, set.id, {
                            reps: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={set.completed}
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        value={set.weight || ''}
                        onChange={(e) =>
                          updateSet(exercise.exerciseId, set.id, {
                            weight: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                        disabled={set.completed}
                      />
                      {set.tags && set.tags.length > 0 && (
                        <div className="flex gap-1">
                          {set.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSet(exercise.exerciseId, set.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Set Button */}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => addSet(exercise.exerciseId)}
                  >
                    <Plus className="size-4" />
                    Add Set
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}