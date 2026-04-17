import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  BadgeCheck,
  BookOpenCheck,
  Boxes,
  Calendar,
  ChevronRight,
  FileSearch,
  Filter,
  GraduationCap,
  KeyRound,
  Shield,
  Sparkles,
  Tag,
  UsersRound,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService } from '@/services';
import { AVAILABLE_PERMISSIONS, PERMISSION_ACTIONS, PERMISSION_MATRIX, type PermissionAction } from '@/core/constants';
import type {
  AdminDashboardResDTO,
  AdminGroupPageResDTO,
  AdminListReqDTO,
  AdminQuizPageResDTO,
  AdminResultPageResDTO,
  AdminUserPageResDTO,
  AdminGroupStatus,
  AdminQuizStatus,
  AdminQuizVisibility,
  AdminRoleReqDTO,
  AdminRoleResDTO,
  AdminSubjectReqDTO,
  AdminSubjectResDTO,
  AdminUserStatus,
} from '@/domains';

type AdminTabKey = 'USERS' | 'GROUPS' | 'QUIZZES' | 'RESULTS' | 'SUBJECTS' | 'ROLES';

const tabConfig: { key: AdminTabKey; label: string; icon: ReactNode }[] = [
  { key: 'USERS', label: 'Users', icon: <UsersRound className="h-4 w-4" /> },
  { key: 'GROUPS', label: 'Groups', icon: <Boxes className="h-4 w-4" /> },
  { key: 'QUIZZES', label: 'Quizzes', icon: <BookOpenCheck className="h-4 w-4" /> },
  { key: 'RESULTS', label: 'Results', icon: <GraduationCap className="h-4 w-4" /> },
  { key: 'SUBJECTS', label: 'Subjects', icon: <Tag className="h-4 w-4" /> },
  { key: 'ROLES', label: 'Roles', icon: <KeyRound className="h-4 w-4" /> },
];

const AVAILABLE_PERMISSION_SET = new Set(AVAILABLE_PERMISSIONS);
const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
  CREATE: 'Create',
  VIEW: 'View',
  UPDATE: 'Update',
  DELETE: 'Delete',
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardResDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabKey>('USERS');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');
  const [users, setUsers] = useState<AdminUserPageResDTO | null>(null);
  const [groups, setGroups] = useState<AdminGroupPageResDTO | null>(null);
  const [quizzes, setQuizzes] = useState<AdminQuizPageResDTO | null>(null);
  const [results, setResults] = useState<AdminResultPageResDTO | null>(null);
  const [subjects, setSubjects] = useState<AdminSubjectResDTO[] | null>(null);
  const [roles, setRoles] = useState<AdminRoleResDTO[] | null>(null);
  const [editingSubject, setEditingSubject] = useState<AdminSubjectResDTO | null>(null);
  const [editingRole, setEditingRole] = useState<AdminRoleResDTO | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [newSubject, setNewSubject] = useState<AdminSubjectReqDTO>({ name: '', description: '' });
  const [newRole, setNewRole] = useState<AdminRoleReqDTO>({ name: '', permissions: [] });
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const visibleRoles = useMemo(() => {
    if (!roles?.length) return [];
    const filter = roleFilter.trim().toLowerCase();
    if (!filter) return roles;
    return roles.filter((role) => role.name.toLowerCase().includes(filter));
  }, [roles, roleFilter]);

  useEffect(() => {
    if (!visibleRoles.length) {
      setSelectedRoleId(null);
      setEditingRole(null);
      return;
    }
    if (selectedRoleId && visibleRoles.some((role) => role.id === selectedRoleId)) {
      return;
    }
    const nextRole = visibleRoles[0];
    setSelectedRoleId(nextRole.id);
    setEditingRole({ ...nextRole });
  }, [visibleRoles, selectedRoleId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminService
      .getDashboard()
      .then((res) => {
        if (!cancelled) setDashboard(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Không tải được admin dashboard.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const queryParams = useMemo<AdminListReqDTO>(() => {
    const params: AdminListReqDTO = {
      page: 0,
      size: 8,
      search: search.trim() || undefined,
    };
    if (statusFilter !== 'ALL') params.status = statusFilter;
    return params;
  }, [search, statusFilter]);

  const fetchList = useCallback(async () => {
    if (isMountedRef.current) setListLoading(true);
    try {
      if (activeTab === 'USERS') {
        const res = await adminService.getUsers(queryParams);
        if (isMountedRef.current) setUsers(res);
      }
      if (activeTab === 'GROUPS') {
        const res = await adminService.getGroups(queryParams);
        if (isMountedRef.current) setGroups(res);
      }
      if (activeTab === 'QUIZZES') {
        const res = await adminService.getQuizzes(queryParams);
        if (isMountedRef.current) setQuizzes(res);
      }
      if (activeTab === 'RESULTS') {
        const res = await adminService.getResults(queryParams);
        if (isMountedRef.current) setResults(res);
      }
      if (activeTab === 'SUBJECTS') {
        const res = await adminService.getSubjects();
        if (isMountedRef.current) setSubjects(res);
      }
      if (activeTab === 'ROLES') {
        const res = await adminService.getRoles();
        if (isMountedRef.current) setRoles(res);
      }
    } catch (err: any) {
      if (isMountedRef.current) setError(err?.message || 'Không tải được dữ liệu quản trị.');
    } finally {
      if (isMountedRef.current) setListLoading(false);
    }
  }, [activeTab, queryParams]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleUserStatusChange = async (userId: number, status: AdminUserStatus) => {
    const key = `USER-${userId}`;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.updateUser(userId, { status });
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err?.message || 'Không cập nhật được trạng thái người dùng.');
      }
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleGroupStatusChange = async (groupId: number, status: AdminGroupStatus) => {
    const key = `GROUP-${groupId}`;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.updateGroup(groupId, { status });
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err?.message || 'Không cập nhật được trạng thái nhóm.');
      }
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleQuizStatusChange = async (quizId: number, status: AdminQuizStatus) => {
    const key = `QUIZ-${quizId}-STATUS`;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.updateQuiz(quizId, { status });
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err?.message || 'Không cập nhật được trạng thái quiz.');
      }
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleQuizVisibilityChange = async (quizId: number, visibility: AdminQuizVisibility) => {
    const key = `QUIZ-${quizId}-VISIBILITY`;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.updateQuiz(quizId, { visibility });
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err?.message || 'Không cập nhật được chế độ hiển thị quiz.');
      }
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleDelete = async (key: string, action: () => Promise<void>, errorMessage: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa mục này?')) return;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await action();
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) setError(err?.message || errorMessage);
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubject.name.trim()) {
      setError('Vui lòng nhập tên môn học.');
      return;
    }
    const key = 'SUBJECT-CREATE';
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.createSubject({
        name: newSubject.name.trim(),
        description: newSubject.description?.trim() || undefined,
      });
      if (isMountedRef.current) setNewSubject({ name: '', description: '' });
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) setError(err?.message || 'Không tạo được môn học.');
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    const key = `SUBJECT-${editingSubject.id}-UPDATE`;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.updateSubject(editingSubject.id, {
        name: editingSubject.name.trim(),
        description: editingSubject.description?.trim() || undefined,
      });
      if (isMountedRef.current) setEditingSubject(null);
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) setError(err?.message || 'Không cập nhật được môn học.');
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      setError('Vui lòng nhập tên role.');
      return;
    }
    const permissions = newRole.permissions.map((p) => p.trim()).filter(Boolean);
    const key = 'ROLE-CREATE';
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.createRole({ name: newRole.name.trim(), permissions });
      if (isMountedRef.current) {
        setNewRole({ name: '', permissions: [] });
      }
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) setError(err?.message || 'Không tạo được role.');
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    const permissions = editingRole.permissions.map((p) => p.trim()).filter(Boolean);
    const key = `ROLE-${editingRole.id}-UPDATE`;
    if (isMountedRef.current) {
      setUpdatingKey(key);
      setError(null);
    }
    try {
      await adminService.updateRole(editingRole.id, {
        name: editingRole.name.trim(),
        permissions,
      });
      if (isMountedRef.current) setEditingRole(null);
      await fetchList();
    } catch (err: any) {
      if (isMountedRef.current) setError(err?.message || 'Không cập nhật được role.');
    } finally {
      if (isMountedRef.current) setUpdatingKey(null);
    }
  };

  const statusOptions = useMemo(() => {
    if (activeTab === 'USERS') return ['ALL', 'ACTIVE', 'PENDING', 'BANNED'];
    if (activeTab === 'GROUPS') return ['ALL', 'ACTIVE', 'ARCHIVED', 'BLOCKED'];
    if (activeTab === 'QUIZZES') return ['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (activeTab === 'RESULTS') return ['ALL', 'IN_PROGRESS', 'DONE', 'MISSED'];
    return ['ALL'];
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/40 via-transparent to-indigo-200/30" />
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="absolute left-10 -bottom-16 h-48 w-48 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="relative container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-foreground text-background">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Trung tâm điều hành Thế Giới
                  </p>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    Admin Dashboard <Sparkles className="h-5 w-5 text-emerald-600" />
                  </h1>
                </div>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Last 7 days
                </Button>
                <Button size="sm" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Live monitor
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3">
                {error}
              </div>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Card key={`sk-${idx}`}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="mt-3 h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Users"
                value={dashboard?.counts.totalUsers ?? 0}
                delta={`+${dashboard?.counts.newUsers7d ?? 0} last 7d`}
                icon={<UsersRound className="h-4 w-4" />}
              />
              <MetricCard
                title="Groups"
                value={dashboard?.counts.totalGroups ?? 0}
                delta={`+${dashboard?.counts.newGroups7d ?? 0} last 7d`}
                icon={<Boxes className="h-4 w-4" />}
              />
              <MetricCard
                title="Quizzes"
                value={dashboard?.counts.totalQuizzes ?? 0}
                delta={`${dashboard?.counts.activeQuizzes ?? 0} active`}
                icon={<BookOpenCheck className="h-4 w-4" />}
              />
              <MetricCard
                title="Results"
                value={dashboard?.counts.totalResults ?? 0}
                delta={`+${dashboard?.counts.newResults7d ?? 0} last 7d`}
                icon={<GraduationCap className="h-4 w-4" />}
              />
            </div>
          )}

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Management Console
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                {tabConfig.map((tab) => (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'default' : 'outline'}
                    size="sm"
                    className="gap-2"
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.icon}
                    {tab.label}
                  </Button>
                ))}
                <div className="ml-auto flex flex-wrap gap-2">
                  <div className="relative">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={`Search ${activeTab.toLowerCase()}`}
                      className="min-w-[200px] bg-background"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        {statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {statusOptions.map((opt) => (
                        <DropdownMenuItem key={opt} onClick={() => setStatusFilter(opt)}>
                          {opt}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-4">
                {listLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <Skeleton key={`row-${idx}`} className="h-14 w-full" />
                    ))}
                  </div>
                ) : (
                  <>
                    {activeTab === 'USERS' && (
                      <AdminTable
                        headers={['User', 'Email', 'Roles', 'Status', 'Quizzes', 'Groups', 'Actions']}
                        rows={(users?.items || []).map((u) => [
                          u.userName,
                          u.email,
                          u.roles.join(', '),
                          <Badge key={`u-${u.id}`} variant={u.status === 'BANNED' ? 'destructive' : 'secondary'}>
                            {u.status}
                          </Badge>,
                          String(u.quizTakenCount),
                          String(u.groupCount),
                          <DropdownMenu key={`u-action-${u.id}`}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={updatingKey === `USER-${u.id}`}
                              >
                                Manage
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Update status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {(['ACTIVE', 'PENDING', 'BANNED'] as AdminUserStatus[]).map((status) => (
                                <DropdownMenuItem
                                  key={`u-status-${u.id}-${status}`}
                                  disabled={u.status === status || updatingKey === `USER-${u.id}`}
                                  onClick={() => handleUserStatusChange(u.id, status)}
                                >
                                  {status}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={updatingKey === `USER-${u.id}-DELETE`}
                                onClick={() =>
                                  handleDelete(
                                    `USER-${u.id}-DELETE`,
                                    () => adminService.deleteUser(u.id),
                                    'Không xóa được người dùng.'
                                  )
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>,
                        ])}
                        emptyLabel="No users found."
                      />
                    )}
                    {activeTab === 'GROUPS' && (
                      <AdminTable
                        headers={['Group', 'Owner', 'Members', 'Quizzes', 'Status', 'Actions']}
                        rows={(groups?.items || []).map((g) => [
                          g.name,
                          g.ownerName,
                          String(g.memberCount),
                          String(g.quizCount),
                          <Badge key={`g-${g.id}`} variant={g.status === 'BLOCKED' ? 'destructive' : 'secondary'}>
                            {g.status}
                          </Badge>,
                          <DropdownMenu key={`g-action-${g.id}`}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={updatingKey === `GROUP-${g.id}`}
                              >
                                Manage
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Update status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {(['ACTIVE', 'ARCHIVED', 'BLOCKED'] as AdminGroupStatus[]).map((status) => (
                                <DropdownMenuItem
                                  key={`g-status-${g.id}-${status}`}
                                  disabled={g.status === status || updatingKey === `GROUP-${g.id}`}
                                  onClick={() => handleGroupStatusChange(g.id, status)}
                                >
                                  {status}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={updatingKey === `GROUP-${g.id}-DELETE`}
                                onClick={() =>
                                  handleDelete(
                                    `GROUP-${g.id}-DELETE`,
                                    () => adminService.deleteGroup(g.id),
                                    'Không xóa được nhóm.'
                                  )
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>,
                        ])}
                        emptyLabel="No groups found."
                      />
                    )}
                    {activeTab === 'QUIZZES' && (
                      <AdminTable
                        headers={['Quiz', 'Owner', 'Group', 'Visibility', 'Status', 'Attempts', 'Actions']}
                        rows={(quizzes?.items || []).map((q) => [
                          q.title,
                          q.ownerName,
                          q.groupName || '—',
                          q.visibility,
                          <Badge key={`q-${q.id}`} variant={q.status === 'ARCHIVED' ? 'outline' : 'secondary'}>
                            {q.status}
                          </Badge>,
                          String(q.attemptsCount),
                          <DropdownMenu key={`q-action-${q.id}`}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={
                                  updatingKey === `QUIZ-${q.id}-STATUS` ||
                                  updatingKey === `QUIZ-${q.id}-VISIBILITY`
                                }
                              >
                                Manage
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Update status</DropdownMenuLabel>
                              {(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as AdminQuizStatus[]).map((status) => (
                                <DropdownMenuItem
                                  key={`q-status-${q.id}-${status}`}
                                  disabled={q.status === status || updatingKey === `QUIZ-${q.id}-STATUS`}
                                  onClick={() => handleQuizStatusChange(q.id, status)}
                                >
                                  {status}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update visibility</DropdownMenuLabel>
                              {(['PUBLIC', 'PRIVATE', 'GROUP'] as AdminQuizVisibility[]).map((visibility) => (
                                <DropdownMenuItem
                                  key={`q-visibility-${q.id}-${visibility}`}
                                  disabled={q.visibility === visibility || updatingKey === `QUIZ-${q.id}-VISIBILITY`}
                                  onClick={() => handleQuizVisibilityChange(q.id, visibility)}
                                >
                                  {visibility}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={updatingKey === `QUIZ-${q.id}-DELETE`}
                                onClick={() =>
                                  handleDelete(
                                    `QUIZ-${q.id}-DELETE`,
                                    () => adminService.deleteQuiz(q.id),
                                    'Không xóa được quiz.'
                                  )
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>,
                        ])}
                        emptyLabel="No quizzes found."
                      />
                    )}
                    {activeTab === 'RESULTS' && (
                      <AdminTable
                        headers={['Quiz', 'User', 'Group', 'Status', 'Score', 'Submitted', 'Actions']}
                        rows={(results?.items || []).map((r) => [
                          r.quizTitle,
                          r.userName,
                          r.groupName || '—',
                          <Badge key={`r-${r.id}`} variant={r.status === 'MISSED' ? 'destructive' : 'secondary'}>
                            {r.status}
                          </Badge>,
                          r.score != null ? String(r.score) : '—',
                          r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('vi-VN') : '—',
                          <DropdownMenu key={`r-action-${r.id}`}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={updatingKey === `RESULT-${r.id}-DELETE`}
                              >
                                Manage
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled={updatingKey === `RESULT-${r.id}-DELETE`}
                                onClick={() =>
                                  handleDelete(
                                    `RESULT-${r.id}-DELETE`,
                                    () => adminService.deleteResult(r.id),
                                    'Không xóa được kết quả.'
                                  )
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>,
                        ])}
                        emptyLabel="No results found."
                      />
                    )}
                    {activeTab === 'SUBJECTS' && (
                      <div className="space-y-4">
                        <div className="rounded-lg border bg-muted/20 p-4">
                          <h3 className="text-sm font-medium mb-3">Create subject</h3>
                          <div className="flex flex-wrap gap-3">
                            <Input
                              value={newSubject.name}
                              onChange={(e) => setNewSubject((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="Subject name"
                              className="min-w-[200px]"
                            />
                            <Input
                              value={newSubject.description || ''}
                              onChange={(e) => setNewSubject((prev) => ({ ...prev, description: e.target.value }))}
                              placeholder="Description"
                              className="min-w-[240px]"
                            />
                            <Button
                              size="sm"
                              onClick={handleCreateSubject}
                              disabled={updatingKey === 'SUBJECT-CREATE'}
                            >
                              Create
                            </Button>
                          </div>
                        </div>
                        <AdminTable
                          headers={['Subject', 'Description', 'Active', 'Quizzes', 'Actions']}
                          rows={(subjects || []).map((s) => [
                            s.name,
                            s.description || '—',
                            s.active ? 'Yes' : 'No',
                            String(s.quizCount ?? 0),
                            <DropdownMenu key={`s-action-${s.id}`}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  disabled={
                                    updatingKey === `SUBJECT-${s.id}-DELETE` ||
                                    updatingKey === `SUBJECT-${s.id}-UPDATE`
                                  }
                                >
                                  Manage
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  disabled={updatingKey === `SUBJECT-${s.id}-UPDATE`}
                                  onClick={() => setEditingSubject({ ...s })}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  disabled={updatingKey === `SUBJECT-${s.id}-DELETE`}
                                  onClick={() =>
                                    handleDelete(
                                      `SUBJECT-${s.id}-DELETE`,
                                      () => adminService.deleteSubject(s.id),
                                      'Không xóa được môn học.'
                                    )
                                  }
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>,
                          ])}
                          emptyLabel="No subjects found."
                        />
                        {editingSubject && (
                          <div className="rounded-lg border bg-background p-4">
                            <h3 className="text-sm font-medium mb-3">Edit subject</h3>
                            <div className="flex flex-wrap gap-3">
                              <Input
                                value={editingSubject.name}
                                onChange={(e) =>
                                  setEditingSubject((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                                }
                                placeholder="Subject name"
                                className="min-w-[200px]"
                              />
                              <Input
                                value={editingSubject.description || ''}
                                onChange={(e) =>
                                  setEditingSubject((prev) =>
                                    prev ? { ...prev, description: e.target.value } : prev
                                  )
                                }
                                placeholder="Description"
                                className="min-w-[240px]"
                              />
                              <Button
                                size="sm"
                                onClick={handleUpdateSubject}
                                disabled={updatingKey === `SUBJECT-${editingSubject.id}-UPDATE`}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSubject(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 'ROLES' && (
                      <div className="space-y-4">
                        <div className="rounded-lg border bg-muted/20 p-4">
                          <h3 className="text-sm font-medium mb-3">Create role</h3>
                          <div className="flex flex-wrap gap-3">
                            <Input
                              value={newRole.name}
                              onChange={(e) => setNewRole((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="Role name"
                              className="min-w-[200px]"
                            />
                            <Button
                              size="sm"
                              onClick={handleCreateRole}
                              disabled={updatingKey === 'ROLE-CREATE'}
                            >
                              Create
                            </Button>
                          </div>
                          
                        </div>
                        <div className="rounded-lg border bg-background p-4">
                          <h3 className="text-sm font-medium mb-3">Role permissions</h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <Input
                              value={roleFilter}
                              onChange={(e) => setRoleFilter(e.target.value)}
                              placeholder="Filter roles"
                              className="min-w-[200px]"
                            />
                            <div className="min-w-[220px]">
                              <Select
                                value={selectedRoleId ? String(selectedRoleId) : undefined}
                                onValueChange={(value) => {
                                  const roleId = Number(value);
                                  setSelectedRoleId(roleId);
                                  const nextRole = roles?.find((role) => role.id === roleId);
                                  setEditingRole(nextRole ? { ...nextRole } : null);
                                }}
                                disabled={!visibleRoles.length}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {visibleRoles.map((role) => (
                                    <SelectItem key={role.id} value={String(role.id)}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              size="sm"
                              onClick={handleUpdateRole}
                              disabled={
                                !editingRole ||
                                updatingKey === (editingRole ? `ROLE-${editingRole.id}-UPDATE` : '')
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const source = roles?.find((role) => role.id === selectedRoleId);
                                setEditingRole(source ? { ...source } : null);
                              }}
                              disabled={!selectedRoleId}
                            >
                              Reset
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={!selectedRoleId || updatingKey === `ROLE-${selectedRoleId}-DELETE`}
                              onClick={() => {
                                if (!selectedRoleId) return;
                                handleDelete(
                                  `ROLE-${selectedRoleId}-DELETE`,
                                  () => adminService.deleteRole(selectedRoleId),
                                  'Không xóa được role.'
                                );
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                          {editingRole ? (
                            <>
                              <div className="mt-4">
                                <Input
                                  value={editingRole.name}
                                  onChange={(e) =>
                                    setEditingRole((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                                  }
                                  placeholder="Role name"
                                  className="min-w-[200px]"
                                />
                              </div>
                              <div className="mt-4">
                                <PermissionMatrix
                                  value={editingRole.permissions}
                                  onChange={(permissions) =>
                                    setEditingRole((prev) => (prev ? { ...prev, permissions } : prev))
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            <p className="mt-4 text-sm text-muted-foreground">No roles found.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                Recent system activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard?.recent?.length ? (
                <ul className="space-y-2">
                  {dashboard.recent.slice(0, 6).map((item) => (
                    <li
                      key={`${item.type}-${item.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

function MetricCard({
  title,
  value,
  delta,
  icon,
}: {
  title: string;
  value: number;
  delta: string;
  icon: ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-foreground/5" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-medium">{value}</p>
        <p className="text-xs text-muted-foreground">{delta}</p>
      </CardContent>
    </Card>
  );
}

function AdminTable({
  headers,
  rows,
  emptyLabel,
}: {
  headers: string[];
  rows: Array<Array<string | ReactNode>>;
  emptyLabel: string;
}) {
  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`row-${idx}`} className="border-t">
              {row.map((cell, cIdx) => (
                <td key={`cell-${idx}-${cIdx}`} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermissionMatrix({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [objectFilter, setObjectFilter] = useState('');
  const togglePermission = (permission: string) => {
    if (value.includes(permission)) {
      onChange(value.filter((p) => p !== permission));
      return;
    }
    onChange([...value, permission]);
  };

  const unknownPermissions = value.filter((permission) => !AVAILABLE_PERMISSION_SET.has(permission as any));
  const filteredRows = useMemo(() => {
    const filter = objectFilter.trim().toLowerCase();
    if (!filter) return PERMISSION_MATRIX;
    return PERMISSION_MATRIX.filter((row) => {
      if (row.resourceLabel.toLowerCase().includes(filter)) return true;
      if (row.resourceKey.toLowerCase().includes(filter)) return true;
      return Object.values(row.permissions).some((perm) => perm?.toLowerCase().includes(filter));
    });
  }, [objectFilter]);

  return (
    <div className="space-y-3">
      <Input
        value={objectFilter}
        onChange={(e) => setObjectFilter(e.target.value)}
        placeholder="Filter objects (e.g., user, quiz, subject)"
        className="max-w-xs"
      />
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Object</th>
              {PERMISSION_ACTIONS.map((action) => (
                <th key={action} className="px-3 py-2 text-center font-medium">
                  {PERMISSION_ACTION_LABELS[action]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.resourceKey} className="border-t">
                <td className="px-3 py-2 font-medium">{row.resourceLabel}</td>
                {PERMISSION_ACTIONS.map((action) => {
                  const permission = row.permissions[action];
                  if (!permission) {
                    return (
                      <td key={`${row.resourceKey}-${action}`} className="px-3 py-2 text-center text-muted-foreground">
                        —
                      </td>
                    );
                  }
                  const isSelected = value.includes(permission);
                  return (
                    <td key={`${row.resourceKey}-${action}`} className="px-3 py-2 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => togglePermission(permission)}
                        aria-label={`${isSelected ? 'Revoke' : 'Grant'} ${PERMISSION_ACTION_LABELS[action]} ${row.resourceLabel}`}
                        className="h-4 w-4 border-muted-foreground/40 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {unknownPermissions.length > 0 && (
        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Extra permissions: {unknownPermissions.join(', ')}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
