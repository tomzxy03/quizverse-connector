
import { useState } from 'react';
import { Bell, FileText, Users, PlusCircle, Search } from 'lucide-react';
import QuizCard, { QuizCardProps } from './QuizCard';

interface Member {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isOwned: boolean;
}

interface GroupContentProps {
  group: Group;
}

const dummyMembers: Member[] = [
  { id: '1', name: 'John Doe', role: 'owner', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Bob Johnson', role: 'member', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Alice Williams', role: 'member', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Charlie Brown', role: 'member', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Diana Prince', role: 'member', avatar: 'https://i.pravatar.cc/150?img=6' },
];

const dummyAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Quiz Added',
    content: 'Check out the new math quiz I just added to the group!',
    date: '2023-09-15',
    author: 'John Doe'
  },
  {
    id: '2',
    title: 'Upcoming Group Study',
    content: 'We will have a group study session on Friday at 5 PM. Make sure to prepare your questions!',
    date: '2023-09-10',
    author: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Quiz Results',
    content: 'The results for last week\'s quiz are now available. Congrats to everyone who participated!',
    date: '2023-09-05',
    author: 'Bob Johnson'
  },
];

const dummyQuizzes: QuizCardProps[] = [
  {
    id: '1',
    title: 'Algebra Basics',
    description: 'Test your knowledge of basic algebraic concepts and equations.',
    subject: 'Math',
    questionCount: 15,
    duration: 20,
    participants: 120,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    description: 'Explore the principles of classical mechanics with this physics quiz.',
    subject: 'Physics',
    questionCount: 10,
    duration: 15,
    participants: 85,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1636466497217-26a368c2f1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '3',
    title: 'Cell Biology',
    description: 'Test your understanding of cell structures and functions.',
    subject: 'Biology',
    questionCount: 20,
    duration: 25,
    participants: 67,
    difficulty: 'hard',
    image: 'https://images.unsplash.com/photo-1576086776739-258d7e1da372?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
];

type ContentTab = 'announcements' | 'quizzes' | 'members';

const GroupContent = ({ group }: GroupContentProps) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('announcements');

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <div className="p-6 border-b border-border bg-white">
        <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
        <p className="text-muted-foreground">
          {group.memberCount} members · {group.isOwned ? 'You are the owner' : 'You are a member'}
        </p>
      </div>
      
      <div className="bg-white border-b border-border flex">
        <button 
          className={`px-6 py-3 flex items-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === 'announcements' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('announcements')}
        >
          <Bell className="h-4 w-4" />
          <span>Announcements</span>
        </button>
        
        <button 
          className={`px-6 py-3 flex items-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === 'quizzes' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('quizzes')}
        >
          <FileText className="h-4 w-4" />
          <span>Quizzes</span>
        </button>
        
        <button 
          className={`px-6 py-3 flex items-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === 'members' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('members')}
        >
          <Users className="h-4 w-4" />
          <span>Members</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Announcements</h2>
              {group.isOwned && (
                <button className="btn-primary flex items-center space-x-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Announcement</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4 mt-4">
              {dummyAnnouncements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="bg-white p-4 rounded-xl card-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                  <p className="text-xs text-right text-muted-foreground">Posted by {announcement.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quizzes</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search quizzes..." 
                    className="pl-10 pr-4 py-2 border border-border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {group.isOwned && (
                  <button className="btn-primary flex items-center space-x-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Quiz</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {dummyQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} {...quiz} />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Members</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search members..." 
                    className="pl-10 pr-4 py-2 border border-border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {group.isOwned && (
                  <button className="btn-primary flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Invite Member</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {dummyMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center space-x-3 p-3 bg-white rounded-xl card-shadow"
                >
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
                  </div>
                  {group.isOwned && member.role !== 'owner' && (
                    <button className="text-xs text-muted-foreground hover:text-foreground">
                      •••
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupContent;
