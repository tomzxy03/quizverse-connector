import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    User,
    Mail,
    Edit3,
    Save,
    X,
    Trophy,
    Clock,
    Target,
    BarChart3,
    BookOpen,
    ChevronRight,
    Shield,
    Loader2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts';
import { examService, userService } from '@/services';
import type { UserStatisticsResDTO } from '@/domains';

const Profile = () => {
    const { user, setUser } = useAuth();
    const { toast } = useToast();

    const [stats, setStats] = useState<UserStatisticsResDTO | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({ userName: '', email: '' });

    useEffect(() => {
        if (!user?.id) return;
        loadStats();
    }, [user?.id]);

    const loadStats = async () => {
        if (!user?.id) return;
        setLoadingStats(true);
        try {
            const data = await examService.getUserStatistics(user.id);
            setStats(data);
        } catch (err) {
            console.error('Failed to load statistics:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    const startEditing = () => {
        setEditForm({
            userName: user?.userName || '',
            email: user?.email || '',
        });
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setSaving(true);
        try {
            const updated = await userService.updateProfile(user.id, {
                userName: editForm.userName,
                email: editForm.email,
            });
            if (setUser) setUser(updated);
            setEditing(false);
            toast({ title: 'Cập nhật thành công', description: 'Thông tin cá nhân đã được cập nhật.' });
        } catch (err: any) {
            toast({
                title: 'Cập nhật thất bại',
                description: err?.message || 'Có lỗi xảy ra.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const formatMinutes = (mins: number) => {
        if (mins < 60) return `${mins} phút`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h}h ${m}m` : `${h} giờ`;
    };

    const subjectEntries = stats?.quizzesBySubject ? Object.entries(stats.quizzesBySubject) : [];
    const maxSubjectCount = subjectEntries.length > 0 ? Math.max(...subjectEntries.map(([, v]) => v)) : 1;

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <Header />

            <main className="flex-1 container px-4 py-8 max-w-5xl mx-auto">
                {/* Hero / Profile Card */}
                <div className="relative mb-8">
                    {/* Decorative bg */}
                    <div className="absolute inset-0 -top-4 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent -z-10 blur-xl" />

                    <Card className="border-border/40 bg-background/60 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
                        {/* Header accent bar */}
                        <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-accent relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
                        </div>

                        <CardContent className="relative px-6 pb-6 -mt-12">
                            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                                {/* Avatar */}
                                <div className="relative group">
                                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-accent border-4 border-background shadow-xl flex items-center justify-center text-primary-foreground text-3xl font-black transition-transform group-hover:scale-105">
                                        {user?.profilePictureUrl ? (
                                            <img
                                                src={user.profilePictureUrl}
                                                alt={user.userName}
                                                className="h-full w-full rounded-2xl object-cover"
                                            />
                                        ) : (
                                            (user?.userName || 'U').charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>

                                {/* User info */}
                                <div className="flex-1 pt-2">
                                    {!editing ? (
                                        <>
                                            <h1 className="text-2xl font-black text-foreground tracking-tight">
                                                {user?.userName || 'Người dùng'}
                                            </h1>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                {user?.email || ''}
                                            </p>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {(user?.roles || []).map((role) => (
                                                    <Badge key={role} variant="secondary" className="rounded-full text-xs px-3 py-0.5 gap-1">
                                                        <Shield className="h-3 w-3" />
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-3 max-w-sm">
                                            <div>
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Tên người dùng
                                                </Label>
                                                <Input
                                                    value={editForm.userName}
                                                    onChange={(e) => setEditForm((f) => ({ ...f, userName: e.target.value }))}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Email
                                                </Label>
                                                <Input
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                                                    className="mt-1 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 shrink-0">
                                    {!editing ? (
                                        <Button
                                            variant="outline"
                                            onClick={startEditing}
                                            className="rounded-xl gap-2 border-border/50 bg-background/50 backdrop-blur"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="ghost"
                                                onClick={cancelEditing}
                                                disabled={saving}
                                                className="rounded-xl"
                                            >
                                                <X className="h-4 w-4 mr-1" />
                                                Hủy
                                            </Button>
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="rounded-xl gap-2 shadow-lg shadow-primary/10"
                                            >
                                                {saving ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                Lưu
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Stats Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        {loadingStats ? (
                            <StatsSkeleton />
                        ) : stats ? (
                            <>
                                {/* Quick Stats */}
                                <Card className="border-border/40 bg-background/60 backdrop-blur-sm shadow-md rounded-2xl">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-primary" />
                                            Thống kê tổng quan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <StatCard
                                            icon={<BookOpen className="h-5 w-5" />}
                                            label="Quiz đã làm"
                                            value={stats.totalQuizzesTaken}
                                            color="text-primary"
                                            bg="bg-primary/10"
                                        />
                                        <StatCard
                                            icon={<Trophy className="h-5 w-5" />}
                                            label="Tổng điểm"
                                            value={stats.totalPoints}
                                            color="text-amber-500"
                                            bg="bg-amber-500/10"
                                        />
                                        <StatCard
                                            icon={<Target className="h-5 w-5" />}
                                            label="TB điểm"
                                            value={`${Math.round(stats.averageScore)}%`}
                                            color="text-emerald-500"
                                            bg="bg-emerald-500/10"
                                        />
                                        <StatCard
                                            icon={<Clock className="h-5 w-5" />}
                                            label="Thời gian"
                                            value={formatMinutes(stats.totalTimeSpent)}
                                            color="text-violet-500"
                                            bg="bg-violet-500/10"
                                        />
                                    </CardContent>
                                </Card>

                                {/* Average Score Progress */}
                                <Card className="border-border/40 bg-background/60 backdrop-blur-sm shadow-md rounded-2xl">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-bold text-muted-foreground">Điểm trung bình</span>
                                            <span className="text-2xl font-black text-foreground">
                                                {Math.round(stats.averageScore)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.round(stats.averageScore)}
                                            className="h-3 rounded-full"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Dựa trên {stats.totalQuizzesTaken} bài quiz đã hoàn thành
                                        </p>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="border-border/40 rounded-2xl">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    Không thể tải thống kê
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Links */}
                        <Card className="border-border/40 bg-background/60 backdrop-blur-sm shadow-md rounded-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold">Truy cập nhanh</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <QuickLink to="/history" label="Lịch sử thi" icon={<BarChart3 className="h-4 w-4" />} />
                                <QuickLink to="/question-bank" label="Ngân hàng câu hỏi" icon={<BookOpen className="h-4 w-4" />} />
                                <QuickLink to="/groups" label="Nhóm học" icon={<User className="h-4 w-4" />} />
                                <QuickLink to="/library" label="Thư viện Quiz" icon={<Target className="h-4 w-4" />} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Subject Breakdown */}
                        {loadingStats ? (
                            <Skeleton className="h-64 rounded-2xl" />
                        ) : subjectEntries.length > 0 ? (
                            <Card className="border-border/40 bg-background/60 backdrop-blur-sm shadow-md rounded-2xl">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Quiz theo môn học
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {subjectEntries.map(([subject, count]) => (
                                        <div key={subject}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm font-medium text-foreground">{subject}</span>
                                                <span className="text-xs font-bold text-muted-foreground">{count} quiz</span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                                                    style={{ width: `${(count / maxSubjectCount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : null}

                        {/* Recent Activity */}
                        {loadingStats ? (
                            <Skeleton className="h-48 rounded-2xl" />
                        ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            <Card className="border-border/40 bg-background/60 backdrop-blur-sm shadow-md rounded-2xl">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Hoạt động gần đây
                                        </CardTitle>
                                        <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs">
                                            <Link to="/history">
                                                Xem tất cả <ChevronRight className="h-3 w-3 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {stats.recentActivity.slice(0, 5).map((attempt) => (
                                            <li
                                                key={attempt.id}
                                                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-foreground truncate">
                                                        {attempt.title || 'Quiz'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {attempt.date} · {attempt.duration}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-full text-xs font-bold px-2.5"
                                                    >
                                                        {attempt.score}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" asChild className="rounded-lg h-8 px-2">
                                                        <Link to={`/history/${attempt.id}`}>
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-border/40 rounded-2xl">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">Chưa có hoạt động nào</p>
                                    <p className="text-sm mt-1">Hãy tham gia quiz để bắt đầu!</p>
                                    <Button asChild className="mt-4 rounded-xl">
                                        <Link to="/library">Khám phá thư viện</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

/* ── Utility sub-components ── */

function StatCard({
    icon,
    label,
    value,
    color,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    bg: string;
}) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-lg font-black leading-none text-foreground">{value}</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{label}</p>
            </div>
        </div>
    );
}

function QuickLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
    return (
        <Link
            to={to}
            className="flex items-center justify-between p-3 rounded-xl border border-border/30 hover:bg-muted/30 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>
                <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
    );
}

function StatsSkeleton() {
    return (
        <div className="space-y-6">
            <Card className="rounded-2xl">
                <CardHeader>
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                </CardContent>
            </Card>
            <Card className="rounded-2xl">
                <CardContent className="py-6 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full rounded-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
