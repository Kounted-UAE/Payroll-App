"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/react-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/react-ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/react-ui/tabs";
import { Input } from "@/components/react-ui/input";
import { Label } from "@/components/react-ui/label";
import { Badge } from "@/components/react-ui/badge";
import { Switch } from "@/components/react-ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/react-ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/react-ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/react-ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/react-ui/dropdown-menu";
import {
  Settings as SettingsIcon,
  Users,
  Plus,
  MoreHorizontal,
  Edit,
  Archive,
  UserCheck,
  UserX,
  Mail,
  Shield,
  User,
  Bell,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/supabase';

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

type Profile = Database['public']['Tables']['public_user_profiles']['Row'];
type Role = Database['public']['Tables']['public_user_roles']['Row'];

const Settings = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    first_name: '',
    last_name: '',
    user_role_slug: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [teamworkStatus, setTeamworkStatus] = useState<{ name: string; token_expires_at: string | null } | null>(null)
  const [twLoading, setTwLoading] = useState(false)
  const [xeroStatus, setXeroStatus] = useState<{ tenant_name: string | null; token_expires_at: string | null } | null>(null)
  const [xeroLoading, setXeroLoading] = useState(false)

  // Create Supabase client instance
  const supabase = createSupabaseClient();

  // Fetch users and roles from Supabase
  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      setAuthUserId(authData?.user?.id ?? null);
      const { data: usersData, error: usersError } = await supabase.from('public_user_profiles').select('*');
      const { data: rolesData, error: rolesError } = await supabase.from('public_user_roles').select('*');
      if (usersError) {
        toast({ title: 'Error', description: usersError.message, variant: 'destructive' });
      } else if (usersData) {
        setUsers(usersData);
      }
      if (rolesError) {
        toast({ title: 'Error', description: rolesError.message, variant: 'destructive' });
      } else if (rolesData) {
        setRoles(rolesData);
      }
      setLoading(false);
    };
    fetchUsersAndRoles();
  }, []);

  useEffect(() => {
    const loadTeamworkStatus = async () => {
      try {
        setTwLoading(true)
        const res = await fetch('/api/teamwork/status')
        if (res.ok) {
          const json = await res.json()
          setTeamworkStatus(json.connection)
        }
      } finally {
        setTwLoading(false)
      }
    }
    loadTeamworkStatus()
    const loadXeroStatus = async () => {
      try {
        setXeroLoading(true)
        const res = await fetch('/api/xero/status')
        if (res.ok) {
          const json = await res.json()
          setXeroStatus({ tenant_name: json.tenant_name, token_expires_at: json.token_expires_at })
        }
      } finally {
        setXeroLoading(false)
      }
    }
    loadXeroStatus()
  }, [])

  // CRUD Operations
  // Fix: Use correct type for createUser (omit id, created_at, updated_at)
  const createUser = async (profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    const { data, error } = await supabase.from('public_user_profiles').insert([profile]).select().single();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      setUsers((prev) => [...prev, data as Profile]);
      toast({ title: 'User Created', description: `User ${(data as Profile).first_name} ${(data as Profile).last_name} created.` });
    }
    setLoading(false);
  };

  // Fix: Only send changed fields for updateUser
  const updateUser = async (profile: Partial<Profile> & { id: string }) => {
    setLoading(true);
    const { data, error } = await supabase.from('public_user_profiles').update(profile).eq('id', profile.id).select().single();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      setUsers((prev) => prev.map((u) => (u.id === profile.id ? data as Profile : u)));
      toast({ title: 'User Updated', description: `User ${(data as Profile).first_name} ${(data as Profile).last_name} updated.` });
    }
    setLoading(false);
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    const { error } = await supabase.from('public_user_profiles').delete().eq('id', userId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({ title: 'User Deleted', description: `User deleted.` });
    }
    setLoading(false);
  };

  // Invite user (create profile) with validation
  const handleInviteUser = async () => {
    if (!inviteForm.first_name || !inviteForm.last_name || !inviteForm.user_role_slug) {
      toast({ title: 'Validation Error', description: 'All fields except message are required.', variant: 'destructive' });
      return;
    }
    await createUser({
      first_name: inviteForm.first_name,
      last_name: inviteForm.last_name,
      user_role_slug: inviteForm.user_role_slug,
      is_active: true,
      cpq_role: null,
      department: null,
      specialization: null
    });
    setInviteForm({ first_name: '', last_name: '', user_role_slug: '', message: '' });
    setIsInviteDialogOpen(false);
  };

  // Edit user with validation
  const handleEditUser = async () => {
    if (selectedUser) {
      if (!selectedUser.first_name || !selectedUser.last_name || !selectedUser.user_role_slug) {
        toast({ title: 'Validation Error', description: 'All fields are required.', variant: 'destructive' });
        return;
      }
      await updateUser({
        id: selectedUser.id,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        user_role_slug: selectedUser.user_role_slug,
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  // UI helpers
  const getRoleLabel = (role_slug: string) => {
    const role = roles.find((r) => r.role_slug === role_slug);
    return role ? role.description || role.role_slug : role_slug;
  };

  return (
    <div className="container mx-auto p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-zinc-600 font-bold">Settings</h1>
          <p className="text-blue-400">Manage your account settings and user permissions</p>
        </div>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-6 rounded-2xl border-transparent">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, and manage user access to the platform
                  </CardDescription>
                </div>
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New User</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={inviteForm.first_name}
                          onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={inviteForm.last_name}
                          onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={inviteForm.user_role_slug}
                          onValueChange={(value) => setInviteForm({ ...inviteForm, user_role_slug: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.length === 0 ? (
                              <SelectItem value="" disabled>No roles found</SelectItem>
                            ) : (
                              roles.map((role) => (
                                <SelectItem key={role.role_slug} value={role.role_slug}>
                                  {role.description || role.role_slug}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Welcome Message (Optional)</Label>
                        <Input
                          id="message"
                          placeholder="Welcome to the team!"
                          value={inviteForm.message}
                          onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInviteUser} disabled={loading || !inviteForm.first_name || !inviteForm.last_name || !inviteForm.user_role_slug}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{user.first_name} {user.last_name}</div>
                            {/* If you need email, join with auth.users or v_authenticated_profiles */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleLabel(user.user_role_slug || '')}</TableCell>
                      <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell className="text-xs text-blue-200">{user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteUser(user.id)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage security preferences and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-blue-200">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-xs text-blue-200">
                    Automatically log out inactive users
                  </p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-blue-200">
                    Receive email updates about important activities
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Activity Alerts</Label>
                  <p className="text-xs text-blue-200">
                    Get notified when users join or leave
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Maintenance</Label>
                  <p className="text-xs text-blue-200">
                    Receive notifications about system updates
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <SettingsIcon className="h-4 w-4 text-blue-500" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure general application preferences
              </CardDescription>
            {teamworkStatus ? (
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="secondary">Connected to Teamwork</Badge>
                <Button
                  variant="default"
                  size="sm"
                  disabled={twLoading}
                  onClick={async () => {
                    setTwLoading(true)
                    try {
                      const res = await fetch('/api/teamwork/refresh', { method: 'POST' })
                      if (res.ok) {
                        toast({ title: 'Teamwork token refreshed' })
                      } else {
                        toast({ title: 'Refresh failed', description: 'See server logs', variant: 'destructive' })
                      }
                    } finally {
                      setTwLoading(false)
                    }
                  }}
                >
                  Refresh token
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={twLoading}
                  onClick={async () => {
                    setTwLoading(true)
                    try {
                      const res = await fetch('/api/teamwork/disconnect', { method: 'POST' })
                      if (res.ok) {
                        setTeamworkStatus(null)
                        toast({ title: 'Teamwork disconnected' })
                      } else {
                        toast({ title: 'Disconnect failed', description: 'See server logs', variant: 'destructive' })
                      }
                    } finally {
                      setTwLoading(false)
                    }
                  }}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <Button
                  variant="default"
                  onClick={() => {
                    window.location.href = `/api/teamwork/connect`
                  }}
                >
                  Connect Teamwork
                </Button>
              </div>
            )}

            {/* Xero */}
            {xeroStatus ? (
              <div className="mt-3 flex items-center gap-3">
                <Badge variant="secondary">Connected to Xero{ xeroStatus.tenant_name ? ` (${xeroStatus.tenant_name})` : ''}</Badge>
                <Button
                  variant="default"
                  size="sm"
                  disabled={xeroLoading}
                  onClick={async () => {
                    setXeroLoading(true)
                    try {
                      const res = await fetch('/api/xero/sync/invoices')
                      if (res.ok) toast({ title: 'Xero sync started' })
                      else toast({ title: 'Xero sync failed', variant: 'destructive' })
                    } finally {
                      setXeroLoading(false)
                    }
                  }}
                >
                  Sync invoices
                </Button>
              </div>
            ) : (
              <div className="mt-3">
                <Button
                  variant="default"
                  onClick={() => {
                    window.location.href = `/api/xero/connect`
                  }}
                >
                  Connect Xero
                </Button>
              </div>
            )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Advontier Digital Solutions" className="bg-white" />
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="uae">
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="uae">UAE Standard Time (UTC+4)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">First Name</Label>
                <Input
                  id="edit-first-name"
                  value={selectedUser.first_name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last-name">Last Name</Label>
                <Input
                  id="edit-last-name"
                  value={selectedUser.last_name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={selectedUser.user_role_slug || ''}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, user_role_slug: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.role_slug} value={role.role_slug}>
                        {role.description || role.role_slug}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditUser} disabled={loading || !selectedUser?.first_name || !selectedUser?.last_name || !selectedUser?.user_role_slug}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;