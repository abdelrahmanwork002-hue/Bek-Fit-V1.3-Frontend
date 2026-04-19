import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit3, Trash2, Eye, Globe, EyeOff, BookOpen, Clock, Tag, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const MOCK_POSTS = [
  { id: '1', title: 'Why Mobility Beats Stretching Every Time', status: 'published', category: 'Education', readTime: '4 min', author: 'Coach Bek', publishedAt: '2026-04-15', excerpt: 'Discover the neurological difference between mobility and static stretching, and why one leads to lasting change.', tags: ['Mobility', 'Science'] },
  { id: '2', title: 'The RPE Method: Training by Feel, Not Numbers', status: 'published', category: 'Training', readTime: '6 min', author: 'Coach Bek', publishedAt: '2026-04-10', excerpt: 'RPE-based training adapts to your daily readiness. Here is how to use it to unlock continuous progress.', tags: ['RPE', 'Training Tips'] },
  { id: '3', title: 'Protein Timing: Myth vs. Science', status: 'draft', category: 'Nutrition', readTime: '5 min', author: 'Dr. Sarah M.', publishedAt: null, excerpt: 'The anabolic window is not what you think. A deep dive into what the research actually shows.', tags: ['Nutrition', 'Science'] },
];

const CATEGORIES = ['Education', 'Training', 'Nutrition', 'Recovery', 'Mindset', 'Interview'];

function PostEditorModal({ post, isOpen, onClose }: { post?: any; isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: post?.title || '',
    category: post?.category || 'Education',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    tags: post?.tags?.join(', ') || '',
    status: post?.status || 'draft',
  });
  const [error, setError] = useState('');

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (post?.id) {
        await api.patch(`/api/blog/${post.id}`, data);
      } else {
        await api.post('/api/blog', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      onClose();
    },
    onError: () => setError('Failed to save post.'),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{post ? 'Edit Post' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Post Title *</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-primary/50" placeholder="e.g. The Truth About Protein Timing" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tags (comma separated)</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" placeholder="Mobility, Science" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Excerpt (shown in listing)</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none h-20" placeholder="A short compelling summary..." value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Content (Markdown supported)</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none resize-none h-64 font-mono" placeholder="## Introduction&#10;&#10;Write your full article here..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
        </div>

        <div className="p-8 border-t border-white/5 flex justify-end gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={onClose}>Discard</Button>
          <Button
            className="bg-primary hover:bg-primary/90 font-bold px-8"
            onClick={() => {
              if (!form.title.trim()) { setError('Title is required.'); return; }
              setError('');
              saveMutation.mutate({ ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) });
            }}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
            {form.status === 'published' ? 'Publish Post' : 'Save Draft'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BlogManager() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [editPost, setEditPost] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: posts = MOCK_POSTS, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/blog');
        return data?.length ? data : MOCK_POSTS;
      } catch { return MOCK_POSTS; }
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/api/blog/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] }),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/api/blog/${id}`, { status: status === 'published' ? 'draft' : 'published' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] }),
  });

  const filtered = posts.filter((p: any) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Content Studio</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage blog posts, educational articles, and coaching tips.</p>
        </div>
        <Button onClick={() => { setEditPost(null); setIsEditorOpen(true); }} className="gap-2 bg-primary hover:bg-primary/90 font-bold px-8 h-12 rounded-2xl shadow-lg shadow-primary/20">
          <Plus className="size-5" /> New Post
        </Button>
      </div>

      <Card className="glass border-white/5 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input placeholder="Search articles..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={cn("px-5 py-2 rounded-xl text-xs font-bold border transition-all capitalize", filterStatus === s ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 border-white/10 text-muted-foreground hover:text-white")}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, color: 'text-white' },
          { label: 'Published', value: posts.filter((p: any) => p.status === 'published').length, color: 'text-emerald-400' },
          { label: 'Drafts', value: posts.filter((p: any) => p.status === 'draft').length, color: 'text-amber-400' },
        ].map(stat => (
          <Card key={stat.label} className="glass border-white/5 p-6 text-center">
            <div className={cn("text-3xl font-black", stat.color)}>{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1,2,3].map(i => <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-28 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
            <BookOpen className="size-12 text-white/5 mx-auto mb-4" />
            <p className="text-muted-foreground">No posts found.</p>
            <Button onClick={() => setIsEditorOpen(true)} className="mt-4 bg-primary text-white font-bold">Create First Post</Button>
          </div>
        ) : filtered.map((post: any) => (
          <Card key={post.id} className="glass border-white/5 hover:border-primary/20 transition-all rounded-2xl overflow-hidden">
            <div className="p-6 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={cn("text-[9px] font-black uppercase", post.status === 'published' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
                    {post.status === 'published' ? <Globe className="size-2.5 mr-1" /> : <EyeOff className="size-2.5 mr-1" />}
                    {post.status}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] border-white/10 text-muted-foreground">{post.category}</Badge>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Clock className="size-2.5" />{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 truncate">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-3">
                  {(post.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-[9px] border-white/10 bg-white/5">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs font-bold" onClick={() => { setEditPost(post); setIsEditorOpen(true); }}>
                  <Edit3 className="size-3 mr-1.5" /> Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-white hover:bg-white/5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0F1115] border-white/10 text-white rounded-2xl w-44">
                    <DropdownMenuItem onClick={() => togglePublish.mutate({ id: post.id, status: post.status })} className="gap-3 py-3 round-xl focus:bg-white/5 cursor-pointer">
                      {post.status === 'published' ? <><EyeOff className="size-4 text-amber-400" /> Unpublish</> : <><Globe className="size-4 text-emerald-400" /> Publish</>}
                    </DropdownMenuItem>
                    <div className="h-px bg-white/5 my-1" />
                    <DropdownMenuItem onClick={() => deletePost.mutate(post.id)} className="gap-3 py-3 round-xl focus:bg-white/5 cursor-pointer text-rose-400">
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PostEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} post={editPost} />
    </div>
  );
}
