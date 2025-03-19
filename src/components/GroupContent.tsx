import { useState } from 'react';
import { Bell, FileText, Users, PlusCircle, Search, UserPlus, Share2 } from 'lucide-react';
import QuizCard, { QuizCardProps } from './QuizCard';
import { Button } from './ui/button';

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

type ContentTab = 'announcements' | 'quizzes' | 'members' | 'shared';

const GroupContent = ({ group }: GroupContentProps) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('announcements');
  const [copySuccess, setCopySuccess] = useState(false);

  const shareLink = `https://quizplatform.com/join/${group.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };

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
        
        <button 
          className={`px-6 py-3 flex items-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === 'shared' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('shared')}
        >
          <Share2 className="h-4 w-4" />
          <span>Shared</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Announcements</h2>
              {group.isOwned && (
                <Button className="flex items-center space-x-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Announcement</span>
                </Button>
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
                  <Button className="flex items-center space-x-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Quiz</span>
                  </Button>
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
                  <Button className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Invite Member</span>
                  </Button>
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

        {activeTab === 'shared' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Share Group</h2>
            </div>
            
            <div className="mt-6 bg-white p-8 rounded-xl card-shadow max-w-2xl mx-auto">
              <h3 className="text-lg font-medium mb-4">Invite others to join this group</h3>
              <p className="text-muted-foreground mb-6">
                Share the link below with anyone you'd like to invite to join "{group.name}". 
                They'll be able to access all group quizzes and announcements.
              </p>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={shareLink} 
                  readOnly
                  className="w-full px-4 py-3 pr-28 border border-border rounded-lg bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button 
                  className="absolute right-1.5 top-1.5"
                  onClick={handleCopyLink}
                >
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-2">Or share via</h4>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span>Twitter</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupContent;
