import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { BookOpen, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  // Mock data - replace with real data later
  const recentQuizzes = [
    { id: 1, title: "JavaScript Basics", questions: 10, subject: "Programming" },
    { id: 2, title: "World History", questions: 15, subject: "History" },
    { id: 3, title: "Biology 101", questions: 20, subject: "Science" },
  ];

  const myGroups = [
    { id: 1, name: "Study Group A", members: 12 },
    { id: 2, name: "Computer Science", members: 24 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to QuizVerse</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Start learning, create quizzes, or join study groups
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/library">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Browse Library
              </Button>
            </Link>
            <Link to="/groups/add-quiz">
              <Button size="lg" variant="outline" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Quiz
              </Button>
            </Link>
            <Link to="/groups">
              <Button size="lg" variant="outline" className="gap-2">
                <Users className="h-5 w-5" />
                My Groups
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quizzes Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+12%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+5%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myGroups.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active groups
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Quizzes */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Quizzes</h2>
              <Link to="/library">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.questions} questions</CardDescription>
                      </div>
                      <span className="text-xs bg-quiz-blue text-quiz-darkBlue px-3 py-1 rounded-full">
                        {quiz.subject}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* My Groups */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Groups</h2>
              <Link to="/groups">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {myGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription>{group.members} members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      View Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <Link to="/groups">
                    <Button variant="ghost" className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Join or Create Group
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
