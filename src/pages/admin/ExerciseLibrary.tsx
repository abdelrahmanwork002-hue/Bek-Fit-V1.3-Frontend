import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Video, MoreVertical, Dumbbell, Tag, Activity, Edit3, Trash2 } from 'lucide-react';
import { useExercises } from '@/hooks/useExercises';
import { useState } from 'react';
import { EditExerciseModal } from '@/components/admin/EditExerciseModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEx, setSelectedEx] = useState<any>(null);
  
  const { data: exercises, isLoading } = useExercises({ search: searchTerm });

  const handleEdit = (ex: any) => {
    setSelectedEx(ex);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Global Movement Catalog</h1>
          <p className="text-muted-foreground mt-1 text-sm">Design, edit, and refine the exercises available to all BekFit members.</p>
        </div>
        <Button onClick={() => { setSelectedEx(null); setIsModalOpen(true); }} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6">
          <Plus className="size-5" />
          Add Exercise
        </Button>
      </div>

      <Card className="glass border-white/5 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                placeholder="Search across 400+ movements, muscle groups, or equipment..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 border-white/10 bg-white/5 rounded-2xl px-6 hover:bg-white/10 transition-all font-bold">
                <Filter className="size-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-64 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises?.map((ex: any) => (
            <Card key={ex.id} className="glass border-white/5 group hover:border-primary/40 transition-all overflow-hidden relative rounded-3xl">
              <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={ex.thumbnail || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80'} 
                  className="size-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] to-transparent opacity-60" />
                
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/20 text-primary border-primary/20 backdrop-blur-md uppercase text-[8px] font-black tracking-widest py-1 px-3">
                    {ex.difficulty || 'N/A'}
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-9 bg-black/40 hover:bg-black/60 rounded-xl backdrop-blur-md border border-white/10">
                        <MoreVertical className="size-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0F1115] border-white/10 text-white rounded-2xl w-44 shadow-2xl">
                      <DropdownMenuItem onClick={() => handleEdit(ex)} className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer">
                        <Edit3 className="size-4 text-primary" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer">
                        <Video className="size-4 text-blue-400" /> Tutorial Link
                      </DropdownMenuItem>
                      <div className="h-px bg-white/5 my-1" />
                      <DropdownMenuItem className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer text-rose-400 font-bold">
                        <Trash2 className="size-4" /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                   {ex.videoUrl && <Badge className="bg-blue-500/10 text-blue-400 border-none px-2"><Video className="size-3 mr-1" /> Video</Badge>}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-1">
                  <h3 className="font-black text-xl text-white group-hover:text-primary transition-colors tracking-tight uppercase italic">{ex.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Activity className="size-3 text-primary" /> {ex.targetMuscle || 'Full Body'}
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {(ex.equipmentNeeded || ['Bodyweight']).map((eq: string) => (
                    <Badge key={eq} variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-white/10 opacity-70 bg-white/5">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && exercises?.length === 0 && (
        <div className="text-center py-40 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
          <Dumbbell className="size-16 text-white/5 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">The Catalog is Empty</h3>
          <p className="text-sm text-muted-foreground mb-8">Start building the future of fitness by adding your first movement.</p>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-white font-bold">Build Now</Button>
        </div>
      )}

      <EditExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exercise={selectedEx}
      />
    </div>
  );
}
