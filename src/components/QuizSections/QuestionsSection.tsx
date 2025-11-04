
import { useState } from "react";
import { Plus, FileText, UploadCloud, FolderOpen, BrainCircuit, Database } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
}

interface QuestionsSectionProps {
  questions: Question[];
  addQuestion: (question: Question) => void;
  updateQuestion: (index: number, question: Question) => void;
}

const QuestionsSection = ({ questions, addQuestion, updateQuestion }: QuestionsSectionProps) => {
  const [sectionTitle, setSectionTitle] = useState("Phần 1");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: `q-${Date.now()}`,
    text: "",
    options: [
      { id: `opt-1-${Date.now()}`, text: "", isCorrect: false },
      { id: `opt-2-${Date.now()}`, text: "", isCorrect: false },
      { id: `opt-3-${Date.now()}`, text: "", isCorrect: false },
      { id: `opt-4-${Date.now()}`, text: "", isCorrect: false },
    ],
    points: 1,
  });

  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const updatedOptions = currentQuestion.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }));
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleSaveQuestion = () => {
    if (editingIndex !== null) {
      // Update existing question
      updateQuestion(editingIndex, currentQuestion);
    } else {
      // Add new question
      addQuestion(currentQuestion);
    }
    
    // Reset form
    setCurrentQuestion({
      id: `q-${Date.now()}`,
      text: "",
      options: [
        { id: `opt-1-${Date.now()}`, text: "", isCorrect: false },
        { id: `opt-2-${Date.now()}`, text: "", isCorrect: false },
        { id: `opt-3-${Date.now()}`, text: "", isCorrect: false },
        { id: `opt-4-${Date.now()}`, text: "", isCorrect: false },
      ],
      points: 1,
    });
    setSelectedOption(undefined);
    setEditingIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setCurrentQuestion(question);
    setEditingIndex(index);
    // Find the correct option
    const correctOption = question.options.find(opt => opt.isCorrect);
    setSelectedOption(correctOption?.id);
  };

  const handleCancelEdit = () => {
    setCurrentQuestion({
      id: `q-${Date.now()}`,
      text: "",
      options: [
        { id: `opt-1-${Date.now()}`, text: "", isCorrect: false },
        { id: `opt-2-${Date.now()}`, text: "", isCorrect: false },
        { id: `opt-3-${Date.now()}`, text: "", isCorrect: false },
        { id: `opt-4-${Date.now()}`, text: "", isCorrect: false },
      ],
      points: 1,
    });
    setSelectedOption(undefined);
    setEditingIndex(null);
  };

  const questionNumber = questions.length + 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border rounded-xl px-6 py-4 shadow-sm">
        <h3 className="font-medium">{sectionTitle}</h3>
        <Select defaultValue="không trộn">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Chọn kiểu trộn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="không trộn">Không trộn</SelectItem>
            <SelectItem value="trộn câu hỏi">Trộn câu hỏi</SelectItem>
            <SelectItem value="trộn đáp án">Trộn đáp án</SelectItem>
            <SelectItem value="trộn tất cả">Trộn tất cả</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questions.map((q, index) => (
        <div 
          key={q.id} 
          className="border rounded-xl p-6 shadow-sm cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleEditQuestion(index)}
        >
          <div className="flex justify-between mb-4">
            <h4 className="font-medium">Câu {index + 1}:</h4>
            <span className="text-sm text-muted-foreground">{q.points} điểm</span>
          </div>
          <p className="mb-4">{q.text}</p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                <p className={opt.isCorrect ? "font-medium text-primary" : ""}>{opt.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between mb-4">
          <h4 className="font-medium">
            {editingIndex !== null ? `Chỉnh sửa câu ${editingIndex + 1}` : `Câu ${questionNumber}`}:
          </h4>
        </div>
        <Input
          value={currentQuestion.text}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, text: e.target.value })
          }
          placeholder="Nhập nội dung câu hỏi..."
          className="w-full mb-4"
        />
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionSelect}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="mt-1"
              />
              <div className="flex gap-2 items-center flex-1">
                <Label htmlFor={option.id} className="font-medium">
                  {String.fromCharCode(65 + index)}.
                </Label>
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const updatedOptions = [...currentQuestion.options];
                    updatedOptions[index].text = e.target.value;
                    setCurrentQuestion({
                      ...currentQuestion,
                      options: updatedOptions,
                    });
                  }}
                  placeholder="Câu trả lời chưa có nội dung"
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-4">
          <div className="flex items-center border rounded p-2 w-max">
            <Label htmlFor="points" className="mr-2 text-sm">Điểm</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={currentQuestion.points}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  points: parseInt(e.target.value) || 0,
                })
              }
              className="w-16 h-8 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span>Phần</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Database className="h-4 w-4" />
            <span>Ngân hàng câu hỏi</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Tải file lên</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Thư viện</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>AI</span>
          </Button>
        </div>
        <div className="flex gap-2">
          {editingIndex !== null && (
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="flex items-center gap-1"
            >
              <span>Hủy</span>
            </Button>
          )}
          <Button
            onClick={handleSaveQuestion}
            className="flex items-center gap-1 bg-primary text-white"
          >
            <Plus className="h-4 w-4" />
            <span>{editingIndex !== null ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
