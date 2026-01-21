// Group Repository - Mock implementation

import {
  Group,
  GroupDetail,
  GroupMember,
  CreateGroupRequest,
  UpdateGroupRequest,
  Announcement,
  CreateAnnouncementRequest,
  SharedResource
} from '@/domains';

export class GroupRepository {
  private mockGroups: Group[] = [
    {
      id: '1',
      name: 'Lớp Toán Cao Cấp',
      description: 'Nhóm học tập môn Toán Cao Cấp',
      memberCount: 25,
      role: 'OWNER',
      creatorId: 'user1',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: '2',
      name: 'TOEIC Study Group',
      description: 'Cùng nhau luyện thi TOEIC',
      memberCount: 45,
      role: 'ADMIN',
      creatorId: 'user2',
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05')
    },
    {
      id: '3',
      name: 'Java Programming',
      description: 'Học lập trình Java từ cơ bản đến nâng cao',
      memberCount: 30,
      role: 'MEMBER',
      creatorId: 'user3',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10')
    }
  ];

  private mockMembers: GroupMember[] = [
    {
      id: '1',
      groupId: '1',
      userId: 'user1',
      name: 'John Doe',
      role: 'OWNER',
      avatar: 'https://i.pravatar.cc/40?img=1',
      joinedAt: new Date('2025-01-01')
    },
    {
      id: '2',
      groupId: '1',
      userId: 'user2',
      name: 'Jane Smith',
      role: 'ADMIN',
      avatar: 'https://i.pravatar.cc/40?img=2',
      joinedAt: new Date('2025-01-02')
    },
    {
      id: '3',
      groupId: '1',
      userId: 'user3',
      name: 'Bob Johnson',
      role: 'MEMBER',
      avatar: 'https://i.pravatar.cc/40?img=3',
      joinedAt: new Date('2025-01-03')
    }
  ];

  private mockAnnouncements: Announcement[] = [
    {
      id: '1',
      groupId: '1',
      authorId: 'user1',
      title: 'Chào mừng các thành viên mới!',
      content: 'Chúc các bạn học tập hiệu quả trong nhóm.',
      isPinned: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: '2',
      groupId: '1',
      authorId: 'user1',
      title: 'Lịch thi giữa kỳ',
      content: 'Thi giữa kỳ sẽ diễn ra vào ngày 15/02/2025.',
      isPinned: false,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05')
    }
  ];

  private mockSharedResources: SharedResource[] = [
    {
      id: '1',
      groupId: '1',
      uploaderId: 'user1',
      title: 'Giáo trình Toán Cao Cấp',
      description: 'Tài liệu học tập chính của môn',
      fileUrl: '/files/giao-trinh-toan.pdf',
      fileType: 'application/pdf',
      fileSize: 5242880,
      uploadedAt: new Date('2025-01-02')
    },
    {
      id: '2',
      groupId: '1',
      uploaderId: 'user2',
      title: 'Bài tập tuần 1',
      description: 'Bài tập về vi phân',
      fileUrl: '/files/bai-tap-tuan-1.pdf',
      fileType: 'application/pdf',
      fileSize: 1048576,
      uploadedAt: new Date('2025-01-03')
    }
  ];

  async getAll(userId: string): Promise<Group[]> {
    return Promise.resolve(this.mockGroups);
  }

  async getById(id: string): Promise<GroupDetail | null> {
    const group = this.mockGroups.find(g => g.id === id);
    if (!group) return null;

    const members = this.mockMembers.filter(m => m.groupId === id);
    const announcements = this.mockAnnouncements.filter(a => a.groupId === id);

    return Promise.resolve({
      ...group,
      members,
      quizzes: [],
      announcements
    });
  }

  async create(data: CreateGroupRequest, userId: string): Promise<Group> {
    const newGroup: Group = {
      id: String(this.mockGroups.length + 1),
      name: data.name,
      description: data.description,
      memberCount: 1,
      role: 'OWNER',
      creatorId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockGroups.push(newGroup);

    // Add creator as owner
    const newMember: GroupMember = {
      id: String(this.mockMembers.length + 1),
      groupId: newGroup.id,
      userId,
      name: 'Current User',
      role: 'OWNER',
      joinedAt: new Date()
    };
    this.mockMembers.push(newMember);

    return Promise.resolve(newGroup);
  }

  async update(id: string, data: UpdateGroupRequest): Promise<Group | null> {
    const index = this.mockGroups.findIndex(g => g.id === id);
    if (index === -1) return null;

    this.mockGroups[index] = {
      ...this.mockGroups[index],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.mockGroups[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.mockGroups.findIndex(g => g.id === id);
    if (index === -1) return false;

    this.mockGroups.splice(index, 1);
    return Promise.resolve(true);
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    const members = this.mockMembers.filter(m => m.groupId === groupId);
    return Promise.resolve(members);
  }

  async addMember(groupId: string, userId: string, role: 'ADMIN' | 'MEMBER'): Promise<GroupMember> {
    const newMember: GroupMember = {
      id: String(this.mockMembers.length + 1),
      groupId,
      userId,
      name: `User ${userId}`,
      role,
      joinedAt: new Date()
    };

    this.mockMembers.push(newMember);

    // Update member count
    const groupIndex = this.mockGroups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
      this.mockGroups[groupIndex].memberCount++;
    }

    return Promise.resolve(newMember);
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const index = this.mockMembers.findIndex(m => m.groupId === groupId && m.userId === userId);
    if (index === -1) return false;

    this.mockMembers.splice(index, 1);

    // Update member count
    const groupIndex = this.mockGroups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
      this.mockGroups[groupIndex].memberCount--;
    }

    return Promise.resolve(true);
  }

  async getAnnouncements(groupId: string): Promise<Announcement[]> {
    const announcements = this.mockAnnouncements.filter(a => a.groupId === groupId);
    return Promise.resolve(announcements.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    }));
  }

  async createAnnouncement(data: CreateAnnouncementRequest, userId: string): Promise<Announcement> {
    const newAnnouncement: Announcement = {
      id: String(this.mockAnnouncements.length + 1),
      groupId: data.groupId,
      authorId: userId,
      title: data.title,
      content: data.content,
      isPinned: data.isPinned || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockAnnouncements.push(newAnnouncement);
    return Promise.resolve(newAnnouncement);
  }

  async getSharedResources(groupId: string): Promise<SharedResource[]> {
    const resources = this.mockSharedResources.filter(r => r.groupId === groupId);
    return Promise.resolve(resources);
  }
}

export const groupRepository = new GroupRepository();
