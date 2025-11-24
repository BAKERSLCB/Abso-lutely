import { History, Copy, X } from 'lucide-react';
import { Exercise, Equipment } from '../types';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { useState } from 'react';

const EQUIPMENT_OPTIONS: Equipment[] = ['Barbell', 'Dumbbell', 'Cable', 'Smith Machine', 'Machine'];

interface ExerciseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  history: {
    date: string;
    routineName: string;
    equipment?: Equipment;
    sets: {
      reps: number;
      weight?: number;
      notes?: string;
      tags?: string[];
    }[];
  }[];
  onCopySet?: (reps: number, weight?: number) => void;
}

export function ExerciseHistoryModal({
  isOpen,
  onClose,
  exercise,
  history,
  onCopySet,
}: ExerciseHistoryModalProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

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

  const filteredHistory = history.filter((session) => {
    if (selectedEquipment.length === 0) return true;
    return session.equipment && selectedEquipment.includes(session.equipment);
  });

  const hasActiveFilters = selectedEquipment.length > 0;

  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-5" />
            {exercise.name} - History
          </DialogTitle>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">
              No history for this exercise yet. Complete a workout to see your
              progress!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
              <div className="space-y-4">
                {filteredHistory.map((session, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>{formatDate(session.date)}</span>
                          {session.equipment && (
                            <Badge variant="secondary" className="text-xs">
                              {session.equipment}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          Routine: {session.routineName}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {session.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                              Set {setIndex + 1}:
                            </span>
                            <div className="flex items-center gap-2">
                              {set.weight && (
                                <span>
                                  {set.weight}kg
                                </span>
                              )}
                              <span>×</span>
                              <span>{set.reps} reps</span>
                            </div>
                            {set.tags && set.tags.length > 0 && (
                              <div className="flex gap-1">
                                {set.tags.map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {onCopySet && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onCopySet(set.reps, set.weight)}
                              className="gap-2"
                            >
                              <Copy className="size-4" />
                              Copy
                            </Button>
                          )}
                        </div>
                      ))}
                      {session.sets.length === 0 && (
                        <p className="text-muted-foreground text-center py-2">
                          No sets recorded
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}