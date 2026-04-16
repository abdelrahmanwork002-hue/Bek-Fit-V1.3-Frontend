import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Video, MoreVertical, Dumbbell } from 'lucide-react';
import { useExercises } from '@/hooks/useExercises';
import { useState } from 'react';

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: exercises, isLoading } = useExercises({ search: searchTerm });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
          <p className="text-muted-foreground mt-1">Manage global movement database and video assets.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Exercise
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                className="pl-10 bg-transparent border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 border-white/10">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises?.map((ex: any) => (
            <Card key={ex.id} className="bg-white/5 border-white/10 group hover:border-primary/50 transition-all overflow-hidden">
              <div className="aspect-video bg-black/40 flex items-center justify-center relative">
                {ex.videoUrl ? (
                  <Video className="size-8 text-white/20" />
                ) : (
                  <Dumbbell className="size-8 text-white/10" />
                )}
                <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border-white/10">
                  {ex.difficulty}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{ex.title}</h3>
                    <p className="text-sm text-muted-foreground">{ex.targetMuscle}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ex.equipmentNeeded?.map((eq: string) => (
                    <Badge key={eq} variant="outline" className="text-[10px] uppercase tracking-wider opacity-60">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
