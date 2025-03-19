
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import GeneralInfo from "./QuizSections/GeneralInfo";
import AdvancedSettings from "./QuizSections/AdvancedSettings";
import QuestionsSection from "./QuizSections/QuestionsSection";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
}

const QuizForm = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    duration: 0,
    startTime: "",
    startDate: "",
    endTime: "",
    endDate: "",
    maxPoints: 10,
    autoDistributePoints: true,
    showStudentWork: true,
    questionNumbering: "A, B, C...",
    questionsPerPage: 50,
    answersPerRow: 1,
    maxAttempts: 100,
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuizDataChange = (field: string, value: any) => {
    setQuizData({
      ...quizData,
      [field]: value,
    });
  };

  const addQuestion = (question: Question) => {
    setQuestions([...questions, question]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Accordion type="single" collapsible defaultValue="general" className="w-full">
        <AccordionItem value="general" className="border rounded-xl shadow-sm">
          <AccordionTrigger className="px-6 py-4">Thông tin chung</AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <GeneralInfo quizData={quizData} onChange={handleQuizDataChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced" className="border rounded-xl shadow-sm mt-4">
          <AccordionTrigger className="px-6 py-4">Cài đặt nâng cao</AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <AdvancedSettings quizData={quizData} onChange={handleQuizDataChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <QuestionsSection questions={questions} addQuestion={addQuestion} />
    </div>
  );
};

export default QuizForm;
