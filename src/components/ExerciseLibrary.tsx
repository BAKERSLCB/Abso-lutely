import { useState } from 'react';
import { Plus, Edit, Trash2, History, Search, Dumbbell, X } from 'lucide-react';
import { Exercise, Equipment, ExerciseTag } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';

const EQUIPMENT_OPTIONS: Equipment[] = ['Barbell', 'Dumbbell', 'Cable', 'Smith Machine', 'Machine'];
const TAG_OPTIONS: ExerciseTag[] = ['Push', 'Pull', 'Upper', 'Lower', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onCreateExercise: () => void;
  onEditExercise: (exerciseId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onViewHistory: (exerciseId: string) => void;
}

export function ExerciseLibrary({
  exercises,
  onCreateExercise,
  onEditExercise,
  onDeleteExercise,
  onViewHistory,
}: ExerciseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEquipment, setFilterEquipment] = useState<string>('all');
  const [filterTags, setFilterTags] = useState<ExerciseTag[]>([]);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipment = filterEquipment === 'all' || exercise.equipment === filterEquipment;
    const matchesTags = filterTags.length === 0 || filterTags.some((tag) => exercise.tags?.includes(tag));
    return matchesSearch && matchesEquipment && matchesTags;
  });

  const toggleTagFilter = (tag: ExerciseTag) => {
    setFilterTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setFilterEquipment('all');
    setFilterTags([]);
  };

  const hasActiveFilters = filterEquipment !== 'all' || filterTags.length > 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Exercise Library</h1>
          <p className="text-muted-foreground">Manage your exercises</p>
        </div>
        <Button onClick={onCreateExercise} className="gap-2">
          <Plus className="size-4" />
          New Exercise
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {/* Equipment Filter */}
            <div className="space-y-2">
              <Label>Equipment</Label>
              <Select value={filterEquipment} onValueChange={setFilterEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <SelectItem key={eq} value={eq}>
                      {eq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filterTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                    {filterTags.includes(tag) && (
                      <X className="ml-1 size-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      {exercises.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <Dumbbell className="size-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="mb-2">No exercises yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first exercise to start building routines
            </p>
            <Button onClick={onCreateExercise} className="gap-2">
              <Plus className="size-4" />
              Create Exercise
            </Button>
          </CardContent>
        </Card>
      ) : filteredExercises.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No exercises found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3>{exercise.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {exercise.equipment && (
                        <Badge variant="secondary">{exercise.equipment}</Badge>
                      )}
                      {exercise.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      Created {new Date(exercise.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewHistory(exercise.id)}
                      className="gap-2"
                    >
                      <History className="size-4" />
                      History
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditExercise(exercise.id)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteExercise(exercise.id)}
                    >
                      <Trash2 className="size-4" />
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