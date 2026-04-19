import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, ChevronRight, Search, Lightbulb, Sparkles, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';

const MOCK_FALLBACK = [
  { id: '1', title: 'Why Mobility Beats Stretching Every Time', category: 'Education', readTime: '4 min', author: 'Coach Bek', publishedAt: '2026-04-15', excerpt: 'Discover the neurological difference between mobility and static stretching, and why one leads to lasting change.', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' },
  { id: '2', title: 'The RPE Method: Training by Feel, Not Numbers', category: 'Training', readTime: '6 min', author: 'Coach Bek', publishedAt: '2026-04-10', excerpt: 'RPE-based training adapts to your daily readiness. Here is how to use it to unlock continuous progress.', thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'Protein Timing: Myth vs. Science', category: 'Nutrition', readTime: '5 min', author: 'Dr. Sarah M.', publishedAt: '2026-04-05', excerpt: 'The anabolic window is not what you think. A deep dive into what the research actually shows.', thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' },
];

export function Blog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts-published'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/blog/published');
        return data?.length ? data : MOCK_FALLBACK;
      } catch {
        return MOCK_FALLBACK;
      }
    }
  });

  const categories = Array.from(new Set(posts.map((p: any) => p.category)));

  const filtered = posts.filter((p: any) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
             <Lightbulb className="size-8 text-primary" />
             Vitality Insights
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Expert coaching, scientific research, and platform updates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              placeholder="Search library..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
               [1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)
            ) : filtered.map((post: any) => (
              <Card 
                key={post.id} 
                className="glass border-white/5 group hover:border-primary/20 transition-all cursor-pointer overflow-hidden rounded-3xl"
                onClick={() => navigate(`/app/tips/${post.id}`)}
              >
                <div className="aspect-video relative overflow-hidden">
                   <img 
                     src={post.thumbnail || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80'} 
                     className="size-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                     alt={post.title}
                     loading="lazy"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] to-transparent" />
                   <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[9px] font-black tracking-widest">{post.category}</Badge>
                   </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <Clock className="size-3 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{post.readTime} READ</span>
                    </div>
                    <ChevronRight className="size-4 text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass border-white/5 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2">
               <Filter className="size-3 text-primary" /> Archive Filter
            </h3>
            <div className="flex flex-wrap gap-2">
               <button 
                 onClick={() => setSelectedCategory(null)}
                 className={cn(
                   "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                   !selectedCategory ? "bg-primary text-white border-primary" : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20"
                 )}
               >
                 All Topics
               </button>
               {categories.map((cat: any) => (
                 <button 
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={cn(
                     "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                     selectedCategory === cat ? "bg-primary text-white border-primary" : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20"
                   )}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </Card>

          <Card className="bg-primary hover:bg-primary/90 transition-all p-6 group cursor-pointer relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/20">
             <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                <Sparkles className="size-20 text-white" />
             </div>
             <div className="relative z-10">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">AI Curated</h3>
                <p className="text-[10px] text-white/70 mt-1 font-medium leading-tight">Get a personalized reading list based on your current biomechanical goals.</p>
                <Button className="mt-4 bg-black/20 hover:bg-black/40 text-white border border-white/20 text-[9px] font-black uppercase tracking-widest w-full">Ask Vitality AI</Button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
