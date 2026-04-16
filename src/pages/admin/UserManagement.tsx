import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, Download, UserPlus, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', adherence: '94%', joined: '2026-03-12' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah@fit.com', role: 'Coach', status: 'Active', adherence: 'N/A', joined: '2026-04-01' },
  { id: '3', name: 'Mike Oxlong', email: 'mike@troll.com', role: 'User', status: 'Suspended', adherence: '12%', joined: '2026-04-10' },
  { id: '4', name: 'Emma Watson', email: 'emma@hollywood.com', role: 'User', status: 'Active', adherence: '88%', joined: '2026-02-15' },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

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
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select className="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer hover:underline">
                        <option className="bg-background">User</option>
                        <option className="bg-background">Coach</option>
                        <option className="bg-background">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-primary">{user.adherence}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "bg-opacity-20",
                          user.status === 'Active' ? "bg-emerald-500 text-emerald-400" : "bg-red-500 text-red-400"
                        )}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
}
