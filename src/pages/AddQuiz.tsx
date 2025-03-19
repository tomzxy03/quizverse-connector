
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import QuizForm from "../components/QuizForm";
import { X, Eye, Download, Save, Send } from "lucide-react";

const AddQuiz = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-2 px-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex space-x-6">
            <button className="px-4 py-2 border-b-2 border-primary font-medium text-primary">
              Bài kiểm tra
            </button>
            <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
              Bài nộp
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
              <Eye className="h-4 w-4" />
              <span>Xem trước</span>
            </button>
            
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors">
              <Save className="h-4 w-4" />
              <span>Lưu nháp</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <Send className="h-4 w-4" />
              <span>Đăng bài</span>
            </button>
            
            <button className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <QuizForm />
      </main>
    </div>
  );
};

export default AddQuiz;
