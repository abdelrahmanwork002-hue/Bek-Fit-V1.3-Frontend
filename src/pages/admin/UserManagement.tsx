import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, Download, UserPlus, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { setApiToken } from '@/lib/api';
import { AISupportModal } from '@/components/admin/AISupportModal';


export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getToken();
      setApiToken(token);
      const res = await api.get('/api/users');
      return res.data;
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const token = await getToken();
      setApiToken(token);
      await api.patch(`/api/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['users'] });
    }
  });

  const filteredUsers = users?.filter((user: any) => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage accounts, permissions, and platform access.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Download className="size-4 mr-2" />
            Bulk Export
          </Button>
          <Button className="shadow-lg shadow-primary/20">
            <UserPlus className="size-4 mr-2" />
            Add Coach
          </Button>
        </div>
      </div>

      <Card className="glass border-white/5">
        <CardHeader className="p-0 border-b border-white/5">
          <div className="flex items-center px-6 py-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-6 w-px bg-white/10" />
            <Button variant="ghost" className="text-muted-foreground">
              <Filter className="size-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Adherence</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user: any) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase">
                          {user.fullName?.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.fullName}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role || 'user'}
                        onChange={(e) => updateRole.mutate({ userId: user.id, role: e.target.value })}
                        className="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer hover:underline"
                      >
                        <option value="user" className="bg-background">User</option>
                        <option value="coach" className="bg-background">Coach</option>
                        <option value="admin" className="bg-background">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-primary">N/A</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-opacity-20 bg-emerald-500 text-emerald-400"
                      >
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 text-primary hover:text-primary/80"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsAIModalOpen(true);
                        }}
                      >
                        <Sparkles className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-white">
                        <MoreHorizontal className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-red-400 hover:text-red-300">
                        <ShieldAlert className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AISupportModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        user={selectedUser} 
      />
    </div>
  );
}
