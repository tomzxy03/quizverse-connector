
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import HomeSlider from '../components/HomeSlider';
import { BookOpen, Users, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="container px-4 py-6 md:py-10">
          <HomeSlider />
        </section>
        
        <section className="container px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to QuizVerse</h2>
            <p className="text-lg text-muted-foreground">
              Your ultimate platform for creating, sharing, and taking quizzes. Whether you're a student, teacher, or quiz enthusiast, QuizVerse has everything you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl card-shadow text-center">
              <div className="w-16 h-16 bg-quiz-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-quiz-darkBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Extensive Library</h3>
              <p className="text-muted-foreground">
                Access thousands of quizzes across various subjects and difficulty levels, created by educators and enthusiasts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl card-shadow text-center">
              <div className="w-16 h-16 bg-quiz-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-quiz-darkBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Groups</h3>
              <p className="text-muted-foreground">
                Create study groups, share quizzes, and learn together with friends, classmates, or colleagues.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl card-shadow text-center">
              <div className="w-16 h-16 bg-quiz-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-quiz-darkBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed analytics and performance metrics on every quiz you take.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-quiz-lightBlue">
          <div className="container px-4">
            <div className="bg-white p-8 md:p-12 rounded-xl card-shadow flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-4">Ready to start your learning journey?</h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of students and teachers who are already using QuizVerse to enhance their learning experience.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Students studying" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-border">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-semibold text-primary">
                QuizVerse
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                © 2023 QuizVerse. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
