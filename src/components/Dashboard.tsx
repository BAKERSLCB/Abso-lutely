import { Play, Clock } from 'lucide-react';
import { Routine, WorkoutSession, Exercise } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DashboardProps {
  routines: Routine[];
  recentSessions: WorkoutSession[];
  exercises: Exercise[];
  onStartRoutine: (routineId: string) => void;
  onViewSession: (sessionId: string) => void;
}

export function Dashboard({
  routines,
  recentSessions,
  exercises,
  onStartRoutine,
  onViewSession,
}: DashboardProps) {
  const getExerciseName = (id: string) => {
    return exercises.find((e) => e.id === id)?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="mb-2">Workout Tracker</h1>
        <p className="text-muted-foreground">Track your progress, stay consistent</p>
      </div>

      {/* Quick Start Routines */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          {routines.length === 0 ? (
            <p className="text-muted-foreground">
              No routines yet. Create one to get started!
            </p>
          ) : (
            <div className="space-y-2">
              {routines.slice(0, 5).map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div>
                    <div>{routine.name}</div>
                    <p className="text-muted-foreground">
                      {routine.exercises.length} exercise
                      {routine.exercises.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onStartRoutine(routine.id)}
                    className="gap-2"
                  >
                    <Play className="size-4" />
                    Start
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <p className="text-muted-foreground">
              No workout history yet. Start your first workout!
            </p>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onViewSession(session.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>{session.routineName}</div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-4" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                  </div>
                  <div className="text-muted-foreground space-y-1">
                    {session.exercises.slice(0, 3).map((ex) => {
                      const completedSets = ex.sets.filter((s) => s.completed).length;
                      return (
                        <div key={ex.exerciseId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>
                              {ex.exerciseName} - {completedSets} set
                              {completedSets !== 1 ? 's' : ''}
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
                    {session.exercises.length > 3 && (
                      <div>+{session.exercises.length - 3} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}