import { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { Routine, Exercise, RoutineExercise, Equipment } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: Routine) => void;
  exercises: Exercise[];
  editingRoutine?: Routine;
}

const EQUIPMENT_OPTIONS: Equipment[] = [
  'Barbell',
  'Dumbbell',
  'Cable',
  'Smith Machine',
  'Machine',
];

export function CreateRoutineModal({
  isOpen,
  onClose,
  onSave,
  exercises,
  editingRoutine,
}: CreateRoutineModalProps) {
  const [name, setName] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);

  useEffect(() => {
    if (editingRoutine) {
      setName(editingRoutine.name);
      setRoutineExercises(editingRoutine.exercises);
    } else {
      setName('');
      setRoutineExercises([]);
    }
  }, [editingRoutine, isOpen]);

  const handleAddExercise = () => {
    if (exercises.length > 0) {
      setRoutineExercises([
        ...routineExercises,
        { exerciseId: exercises[0].id, sets: 3, reps: 10 },
      ]);
    }
  };

  const handleRemoveExercise = (index: number) => {
    setRoutineExercises(routineExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (
    index: number,
    updates: Partial<RoutineExercise>
  ) => {
    setRoutineExercises(
      routineExercises.map((ex, i) => (i === index ? { ...ex, ...updates } : ex))
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const routine: Routine = {
      id: editingRoutine?.id || crypto.randomUUID(),
      name: name.trim(),
      exercises: routineExercises,
      createdAt: editingRoutine?.createdAt || new Date().toISOString(),
    };

    onSave(routine);
    onClose();
    setName('');
    setRoutineExercises([]);
  };

  const getExerciseName = (id: string) => {
    return exercises.find((e) => e.id === id)?.name || 'Unknown';
  };

  const getExercise = (id: string) => {
    return exercises.find((e) => e.id === id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRoutine ? 'Edit Routine' : 'Create New Routine'}
          </DialogTitle>
          <DialogDescription>
            {editingRoutine
              ? 'Update your routine details and exercises below.'
              : 'Create a new workout routine with exercises, sets, reps, and equipment.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="routine-name">Routine Name</Label>
            <Input
              id="routine-name"
              placeholder="e.g., Push Day, Full Body"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddExercise}
                disabled={exercises.length === 0}
                className="gap-2"
              >
                <Plus className="size-4" />
                Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Create some exercises first in the Exercise Library
              </p>
            ) : routineExercises.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No exercises added yet
              </p>
            ) : (
              <div className="space-y-3">
                {routineExercises.map((ex, index) => {
                  const exercise = getExercise(ex.exerciseId);
                  const defaultEquipment = exercise?.equipment;

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <GripVertical className="size-5 text-muted-foreground mt-2" />
                      <div className="flex-1 space-y-3">
                        {/* Exercise Selection */}
                        <Select
                          value={ex.exerciseId}
                          onValueChange={(value) =>
                            handleUpdateExercise(index, { exerciseId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {getExerciseName(ex.exerciseId)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {exercises.map((exercise) => (
                              <SelectItem key={exercise.id} value={exercise.id}>
                                {exercise.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Sets, Reps, and Equipment */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Sets</Label>
                            <Input
                              type="number"
                              min="1"
                              value={ex.sets}
                              onChange={(e) =>
                                handleUpdateExercise(index, {
                                  sets: parseInt(e.target.value) || 1,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Reps</Label>
                            <Input
                              type="number"
                              min="1"
                              value={ex.reps}
                              onChange={(e) =>
                                handleUpdateExercise(index, {
                                  reps: parseInt(e.target.value) || 1,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Equipment</Label>
                            <Select
                              value={ex.equipment || defaultEquipment || 'none'}
                              onValueChange={(value) =>
                                handleUpdateExercise(index, {
                                  equipment:
                                    value === 'none'
                                      ? undefined
                                      : value as Equipment,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="None" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {EQUIPMENT_OPTIONS.map((eq) => (
                                  <SelectItem key={eq} value={eq}>
                                    {eq}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveExercise(index)}
                        className="mt-2"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {editingRoutine ? 'Save Changes' : 'Create Routine'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}