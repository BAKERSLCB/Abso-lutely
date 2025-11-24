import { useState } from 'react';
import { X } from 'lucide-react';
import { WorkoutSession, Equipment } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
}

const EQUIPMENT_OPTIONS: Equipment[] = ['Barbell', 'Dumbbell', 'Cable', 'Smith Machine', 'Machine'];

export function WorkoutHistory({ sessions }: WorkoutHistoryProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

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

  const filteredSessions = sessions
    .filter((s) => s.completed)
    .filter((session) => {
      if (selectedEquipment.length === 0) return true;
      
      // Check if any exercise in the session uses the selected equipment
      return session.exercises.some((ex) => 
        ex.equipment && selectedEquipment.includes(ex.equipment)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasActiveFilters = selectedEquipment.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Workout History</h1>
        <p className="text-muted-foreground">View all your past workouts</p>
      </div>

      {/* Equipment Filters */}
      <Card className="p-4">
        <div className="space-y-3">
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
      </Card>

      {/* History List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? 'No workouts found with the selected equipment filters.'
              : 'No workout history yet. Complete your first workout to see it here!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3>{session.routineName}</h3>
                  <p className="text-muted-foreground">
                    {new Date(session.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {session.exercises.map((ex) => {
                  const completedSets = ex.sets.filter((s) => s.completed).length;
                  return (
                    <div
                      key={ex.exerciseId}
                      className="flex items-center justify-between text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <span>{ex.exerciseName}</span>
                        {ex.equipment && (
                          <Badge variant="secondary" className="text-xs">
                            {ex.equipment}
                          </Badge>
                        )}
                      </div>
                      <span>
                        {completedSets} set{completedSets !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
