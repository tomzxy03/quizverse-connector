
import { useState } from "react";
import { Plus, FileText, UploadCloud, FolderOpen, BrainCircuit, MoreVertical, Copy, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { Card } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
}

interface Section {
  id: string;
  title: string;
  description: string;
  shuffleType: string;
  questions: Question[];
}

interface QuestionsSectionProps {
  questions: Question[];
  addQuestion: (question: Question) => void;
}

const QuestionsSection = ({ questions, addQuestion }: QuestionsSectionProps) => {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([
    {
      id: `section-${Date.now()}`,
      title: "Phần 1",
      description: "",
      shuffleType: "không trộn",
      questions: [],
    },
  ]);

  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

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

  const handleAddQuestion = () => {
    // First find the active section
    const newSections = [...sections];
    const sectionIndex = newSections.findIndex(s => s.id === activeSection);
    
    if (sectionIndex !== -1) {
      // Add the question to the section
      newSections[sectionIndex].questions.push(currentQuestion);
      setSections(newSections);
    }
    
    // Reset the current question
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
    setIsAddingQuestion(false);
    
    toast({
      title: "Thêm câu hỏi thành công",
      description: "Câu hỏi đã được thêm vào phần",
    });
  };

  const handleSectionUpdate = (sectionId: string, field: string, value: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, [field]: value };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleAddOption = () => {
    const newOption = {
      id: `opt-${currentQuestion.options.length + 1}-${Date.now()}`,
      text: "",
      isCorrect: false,
    };
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, newOption],
    });
  };

  const handleDeleteOption = (optionId: string) => {
    if (currentQuestion.options.length <= 2) {
      return; // Keep at least 2 options
    }
    
    const updatedOptions = currentQuestion.options.filter(
      (option) => option.id !== optionId
    );
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
    
    if (selectedOption === optionId) {
      setSelectedOption(undefined);
    }
  };

  const handleDeleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.filter(q => q.id !== questionId)
        };
      }
      return section;
    });
    
    setSections(updatedSections);
    setSelectedQuestionId(null);
    
    toast({
      title: "Xóa câu hỏi thành công",
      description: "Câu hỏi đã được xóa khỏi bài kiểm tra",
    });
  };

  const handleUpdateQuestion = (sectionId: string, questionId: string, updatedQuestion: Partial<Question>) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map(q => 
            q.id === questionId ? { ...q, ...updatedQuestion } : q
          )
        };
      }
      return section;
    });
    
    setSections(updatedSections);
  };

  const renderSectionEditor = (section: Section) => {
    if (isEditingSection && activeSection === section.id) {
      return (
        <div className="space-y-4 p-4 border rounded-xl bg-background">
          <Input
            value={section.title}
            onChange={(e) => handleSectionUpdate(section.id, "title", e.target.value)}
            placeholder="Nhập tiêu đề phần"
            className="mb-2"
          />
          <Textarea
            value={section.description}
            onChange={(e) => handleSectionUpdate(section.id, "description", e.target.value)}
            placeholder="Nhập mô tả"
            className="min-h-20"
          />
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditingSection(false)}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button onClick={() => setIsEditingSection(false)}>
              Lưu
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const handleSelectQuestion = (questionId: string) => {
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    } else {
      // Tìm câu hỏi trong tất cả các phần để thiết lập làm câu hỏi hiện tại
      for (const section of sections) {
        const question = section.questions.find(q => q.id === questionId);
        if (question) {
          setCurrentQuestion({...question});
          setSelectedOption(question.options.find(opt => opt.isCorrect)?.id);
          break;
        }
      }
      
      setSelectedQuestionId(questionId);
      setIsAddingQuestion(false);
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={section.id} className="space-y-4">
          <div className="flex justify-between items-center border rounded-xl px-6 py-4 shadow-sm">
            <h3 className="font-medium">{section.title}</h3>
            <div className="flex items-center gap-2">
              <Select 
                defaultValue={section.shuffleType}
                onValueChange={(value) => handleSectionUpdate(section.id, "shuffleType", value)}
              >
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setActiveSection(section.id);
                  setIsEditingSection(!isEditingSection);
                }}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {renderSectionEditor(section)}

          {isEditingSection && activeSection === section.id ? null : (
            <>
              {section.questions.map((question, qIndex) => (
                <Card 
                  key={question.id} 
                  className={`border rounded-xl p-6 shadow-sm cursor-pointer ${selectedQuestionId === question.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelectQuestion(question.id)}
                >
                  <div className="flex justify-between mb-4">
                    <h4 className="font-medium">Câu {qIndex + 1}:</h4>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(section.id, question.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="mb-4">{question.text || "Chưa có nội dung câu hỏi"}</p>
                  <div className="mt-2 space-y-2">
                    {question.options.map((opt, optIndex) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={opt.id}
                          id={`${question.id}-${opt.id}`}
                          checked={opt.isCorrect}
                          disabled
                        />
                        <Label htmlFor={`${question.id}-${opt.id}`} className="font-medium">
                          {String.fromCharCode(65 + optIndex)}.
                        </Label>
                        <p>{opt.text || "Câu trả lời chưa có nội dung"}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center border rounded p-2">
                    <Label className="mr-2 text-sm">Điểm</Label>
                    <span className="text-sm">{question.points}</span>
                  </div>
                </Card>
              ))}

              {selectedQuestionId && !isAddingQuestion ? (
                <Card className="border rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Chỉnh sửa câu hỏi</h4>
                    <Button variant="outline" size="sm" onClick={() => setSelectedQuestionId(null)}>
                      Đóng
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Nhập nội dung câu hỏi ?"
                    className="w-full"
                    value={currentQuestion.text}
                    onChange={(e) => {
                      setCurrentQuestion({...currentQuestion, text: e.target.value});
                      const section = sections.find(s => s.questions.some(q => q.id === selectedQuestionId));
                      if (section) {
                        handleUpdateQuestion(section.id, selectedQuestionId, {text: e.target.value});
                      }
                    }}
                  />
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={option.id}
                          id={`edit-option-${option.id}`}
                          checked={option.isCorrect}
                          onClick={() => {
                            const updatedOptions = currentQuestion.options.map(opt => ({
                              ...opt,
                              isCorrect: opt.id === option.id
                            }));
                            setCurrentQuestion({...currentQuestion, options: updatedOptions});
                            
                            const section = sections.find(s => s.questions.some(q => q.id === selectedQuestionId));
                            if (section) {
                              handleUpdateQuestion(section.id, selectedQuestionId, {options: updatedOptions});
                            }
                          }}
                        />
                        <div className="flex gap-2 items-center flex-1">
                          <Label htmlFor={`edit-option-${option.id}`} className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </Label>
                          <Input
                            placeholder="Câu trả lời..."
                            className="flex-1"
                            value={option.text}
                            onChange={(e) => {
                              const updatedOptions = [...currentQuestion.options];
                              updatedOptions[index].text = e.target.value;
                              setCurrentQuestion({...currentQuestion, options: updatedOptions});
                              
                              const section = sections.find(s => s.questions.some(q => q.id === selectedQuestionId));
                              if (section) {
                                handleUpdateQuestion(section.id, selectedQuestionId, {options: updatedOptions});
                              }
                            }}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              if (currentQuestion.options.length <= 2) return;
                              
                              const updatedOptions = currentQuestion.options.filter(opt => opt.id !== option.id);
                              setCurrentQuestion({...currentQuestion, options: updatedOptions});
                              
                              const section = sections.find(s => s.questions.some(q => q.id === selectedQuestionId));
                              if (section) {
                                handleUpdateQuestion(section.id, selectedQuestionId, {options: updatedOptions});
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => {
                        const newOption = {
                          id: `opt-${currentQuestion.options.length + 1}-${Date.now()}`,
                          text: "",
                          isCorrect: false,
                        };
                        const updatedOptions = [...currentQuestion.options, newOption];
                        setCurrentQuestion({...currentQuestion, options: updatedOptions});
                        
                        const section = sections.find(s => s.questions.some(q => q.id === selectedQuestionId));
                        if (section) {
                          handleUpdateQuestion(section.id, selectedQuestionId, {options: updatedOptions});
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Thêm câu trả lời
                    </Button>
                    
                    <div className="flex items-center border rounded p-2">
                      <Label htmlFor="edit-points" className="mr-2 text-sm">Điểm</Label>
                      <Input
                        id="edit-points"
                        type="number"
                        min="0"
                        value={currentQuestion.points}
                        onChange={(e) => {
                          const points = parseInt(e.target.value) || 0;
                          setCurrentQuestion({...currentQuestion, points});
                          
                          const section = sections.find(s => s.questions.some(q => q.id === selectedQuestionId));
                          if (section) {
                            handleUpdateQuestion(section.id, selectedQuestionId, {points});
                          }
                        }}
                        className="w-16 h-8 text-sm"
                      />
                    </div>
                  </div>
                </Card>
              ) : null}

              {isAddingQuestion && activeSection === section.id ? (
                <Card className="border rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between mb-4">
                    <h4 className="font-medium">Câu {section.questions.length + 1}:</h4>
                  </div>
                  <Input
                    value={currentQuestion.text}
                    onChange={(e) =>
                      setCurrentQuestion({ ...currentQuestion, text: e.target.value })
                    }
                    placeholder="Nhập nội dung câu hỏi ?"
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
                            placeholder="Câu trả lời..."
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteOption(option.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={handleAddOption}
                    >
                      <Plus className="h-4 w-4" />
                      Thêm câu trả lời
                    </Button>
                    
                    <div className="flex items-center border rounded p-2">
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
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setIsAddingQuestion(false)}
                    >
                      Hủy
                    </Button>
                    <Button 
                      onClick={handleAddQuestion}
                    >
                      Lưu
                    </Button>
                  </div>
                </Card>
              ) : null}

              {!isAddingQuestion && !selectedQuestionId && (
                <div className="flex justify-between py-4">
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
                  <Button
                    onClick={() => {
                      setIsAddingQuestion(true);
                      setActiveSection(section.id);
                      setSelectedQuestionId(null);
                      
                      // Reset current question
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
                    }}
                    className="flex items-center gap-1 bg-primary text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm câu hỏi</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionsSection;
