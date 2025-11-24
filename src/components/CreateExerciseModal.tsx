import { useState, useEffect } from 'react';
import { Exercise, Equipment, ExerciseTag } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
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

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  editingExercise?: Exercise;
}

const EQUIPMENT_OPTIONS: Equipment[] = ['Barbell', 'Dumbbell', 'Cable', 'Smith Machine', 'Machine'];
const TAG_OPTIONS: ExerciseTag[] = ['Push', 'Pull', 'Upper', 'Lower', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

export function CreateExerciseModal({
  isOpen,
  onClose,
  onSave,
  editingExercise,
}: CreateExerciseModalProps) {
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState<Equipment | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<ExerciseTag[]>([]);

  useEffect(() => {
    if (editingExercise) {
      setName(editingExercise.name);
      setEquipment(editingExercise.equipment);
      setSelectedTags(editingExercise.tags || []);
    } else {
      setName('');
      setEquipment(undefined);
      setSelectedTags([]);
    }
  }, [editingExercise, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;

    const exercise: Exercise = {
      id: editingExercise?.id || crypto.randomUUID(),
      name: name.trim(),
      equipment,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      createdAt: editingExercise?.createdAt || new Date().toISOString(),
    };

    onSave(exercise);
    onClose();
    setName('');
    setEquipment(undefined);
    setSelectedTags([]);
  };

  const toggleTag = (tag: ExerciseTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingExercise ? 'Edit Exercise' : 'Create New Exercise'}
          </DialogTitle>
          <DialogDescription>
            {editingExercise 
              ? 'Update the exercise details below.' 
              : 'Add a new exercise to your library with equipment and tags.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              placeholder="e.g., Bench Press, Squat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment (Optional)</Label>
            <Select value={equipment || ''} onValueChange={(value) => setEquipment(value as Equipment || undefined)}>
              <SelectTrigger id="equipment">
                <SelectValue placeholder="Select equipment" />
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

          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="ml-1 size-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {editingExercise ? 'Save Changes' : 'Create Exercise'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}