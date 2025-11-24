import { ArrowLeft, Play, Edit, History, X } from 'lucide-react';
import { Routine, Exercise, WorkoutSession, Equipment } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';

const EQUIPMENT_OPTIONS: Equipment[] = ['Barbell', 'Dumbbell', 'Cable', 'Smith Machine', 'Machine'];

interface RoutineDetailsProps {
  routine: Routine;
  exercises: Exercise[];
  routineHistory: WorkoutSession[];
  onBack: () => void;
  onStartWorkout: () => void;
  onEdit: () => void;
}

export function RoutineDetails({
  routine,
  exercises,
  routineHistory,
  onBack,
  onStartWorkout,
  onEdit,
}: RoutineDetailsProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const getExerciseName = (id: string) => {
    return exercises.find((e) => e.id === id)?.name || 'Unknown';
  };

  const getExercise = (id: string) => {
    return exercises.find((e) => e.id === id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleEquipment = (equipment: Equipment) => {
    if (selectedEquipment.includes(equipment)) {
      setSelectedEquipment(selectedEquipment.filter((e) => e !== equipment));
    } else {
      setSelectedEquipment([...selectedEquipment, equipment]);
    }
  };

  const clearFilters = () => {
    setSelectedEquipment([]);
  };

  const filteredHistory = routineHistory.filter((session) => {
    if (selectedEquipment.length === 0) return true;
    
    // Check if any exercise in the session uses the selected equipment
    return session.exercises.some((ex) => 
      ex.equipment && selectedEquipment.includes(ex.equipment)
    );
  });

  const hasActiveFilters = selectedEquipment.length > 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="mb-1">{routine.name}</h1>
            <p className="text-muted-foreground">
              {routine.exercises.length} exercise
              {routine.exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Edit className="size-4" />
            Edit
          </Button>
          <Button onClick={onStartWorkout} className="gap-2">
            <Play className="size-4" />
            Start Workout
          </Button>
        </div>
      </div>

      {/* Exercises */}
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {routine.exercises.length === 0 ? (
            <p className="text-muted-foreground">
              No exercises in this routine yet. Edit to add some!
            </p>
          ) : (
            <div className="space-y-2">
              {routine.exercises.map((ex, index) => {
                const exercise = getExercise(ex.exerciseId);
                const equipment = ex.equipment || exercise?.equipment;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <span>{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {getExerciseName(ex.exerciseId)}
                          {equipment && (
                            <Badge variant="secondary" className="text-xs">
                              {equipment}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {ex.sets} sets × {ex.reps} reps
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" />
            Past Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {routineHistory.length === 0 ? (
            <p className="text-muted-foreground">
              No workout history for this routine yet
            </p>
          ) : (
            <div className="space-y-4">
              {/* Equipment Filters */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Filter by Equipment</label>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-2"
                    >
                      <X className="size-4" />
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT_OPTIONS.map((equipment) => (
                    <Badge
                      key={equipment}
                      variant={selectedEquipment.includes(equipment) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleEquipment(equipment)}
                    >
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* History List */}
              {filteredHistory.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">
                    No sessions found with the selected equipment filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>{formatDate(session.date)}</div>
                        {session.completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {session.exercises.map((ex) => {
                          const completedSets = ex.sets.filter((s) => s.completed).length;
                          return (
                            <div
                              key={ex.exerciseId}
                              className="flex items-center justify-between text-muted-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <span>
                                  {ex.exerciseName} - {completedSets} set
                                  {completedSets !== 1 ? 's' : ''} completed
                                </span>
                                {ex.equipment && (
                                  <Badge variant="secondary" className="text-xs">
                                    {ex.equipment}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}