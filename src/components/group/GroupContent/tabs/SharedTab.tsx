import { useEffect, useMemo, useState } from 'react';
import { Copy, Link2, RefreshCw, Search, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { groupService } from '@/services';
import { toast } from '@/hooks/use-toast';
import type { LobbyResDTO } from '@/domains';
import { Group } from '../types';

const SharedTab = ({ group }: { group: Group }) => {
  const groupId = Number(group.id);
  const canManage = group.role === 'OWNER' || group.role === 'ADMIN';
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<LobbyResDTO | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const inviteLink = useMemo(() => {
    if (!inviteCode) return '';
    return `https://quizplatform.com/join/${inviteCode}`;
  }, [inviteCode]);

  useEffect(() => {
    let mounted = true;

    const loadInviteCode = async () => {
      setIsLoading(true);
      try {
        const res = await groupService.getCodeInvite(groupId);
        if (mounted) {
          setInviteCode(res.codeInvite || '');
        }
      } catch (error) {
        toast({ title: 'Không thể tải mã mời', variant: 'destructive' });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (!Number.isNaN(groupId)) {
      void loadInviteCode();
    }

    return () => {
      mounted = false;
    };
  }, [groupId]);

  const handleCopy = async (value: string, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `Đã sao chép ${label}` });
    } catch (error) {
      toast({ title: 'Không thể sao chép', variant: 'destructive' });
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    try {
      const res = await groupService.reloadCodeInvite(groupId);
      setInviteCode(res.codeInvite || '');
      toast({ title: 'Đã làm mới mã mời' });
    } catch (error) {
      toast({ title: 'Làm mới mã mời thất bại', variant: 'destructive' });
    } finally {
      setIsReloading(false);
    }
  };

  const handleSearch = async () => {
    const trimmed = searchCode.trim();
    if (!trimmed) {
      setSearchError('Vui lòng nhập mã mời');
      setSearchResult(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await groupService.findLobbyByCode(trimmed);
      setSearchResult(res);
    } catch (error) {
      setSearchResult(null);
      setSearchError('Không tìm thấy nhóm với mã này');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Chia sẻ nhóm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Chia sẻ mã mời hoặc đường dẫn để bạn bè tham gia nhóm.
          </p>

          <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="h-4 w-4 text-muted-foreground" />
                Mã mời
              </div>
              {canManage && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReload}
                  disabled={isReloading || isLoading}
                >
                  {isReloading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Làm mới
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                readOnly
                value={isLoading ? 'Đang tải...' : inviteCode || 'Chưa có mã mời'}
                className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground"
              />
              <Button
                variant="outline"
                onClick={() => handleCopy(inviteCode, 'mã mời')}
                disabled={!inviteCode || isLoading}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              Đường dẫn mời
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                readOnly
                value={inviteLink || 'Sẽ hiển thị khi có mã mời'}
                className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground"
              />
              <Button
                variant="outline"
                onClick={() => handleCopy(inviteLink, 'đường dẫn')}
                disabled={!inviteLink}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Kiểm tra mã mời</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Nhập mã mời để kiểm tra thông tin nhóm trước khi chia sẻ.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              value={searchCode}
              onChange={(event) => setSearchCode(event.target.value)}
              placeholder="Nhập mã mời..."
              className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-muted/30 border border-border rounded-md text-foreground"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Tìm nhóm
            </Button>
          </div>

          {searchError && (
            <div className="text-sm text-destructive">{searchError}</div>
          )}

          {searchResult && !searchError && (
            <div className="rounded-lg border bg-background p-4">
              <div className="text-sm text-muted-foreground">Nhóm tìm thấy</div>
              <div className="mt-2 text-base font-semibold text-foreground">
                {searchResult.lobbyName}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Chủ nhóm: {searchResult.hostName || 'Chưa cập nhật'}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Thành viên: {searchResult.totalMembers ?? 'N/A'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedTab;
