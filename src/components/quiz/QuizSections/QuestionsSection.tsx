
import { useState } from "react";
import { Plus, FileText, UploadCloud, FolderOpen, BrainCircuit, Database, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
}

interface QuizSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface QuestionsSectionProps {
  sections?: QuizSection[];
  questions?: Question[];
  addSection?: (section: QuizSection) => void;
  updateSection?: (id: string, section: QuizSection) => void;
  removeSection?: (id: string) => void;
  addQuestion: (sectionIdOrQuestion: string | Question, questionOrIndex?: Question | number, question?: Question) => void;
  updateQuestion: (sectionIdOrIndex: string | number, indexOrQuestion?: number | Question, question?: Question) => void;
  removeQuestion: (sectionIdOrIndex: string | number, index?: number) => void;
  quizData: {
    questionNumbering: string;
    questionsPerPage: number;
    answersPerRow: number;
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
  };
  onChange: (field: string, value: unknown) => void;
}

const safeNum = (v: string, fallback: number) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
};

const QuestionsSection = ({ 
  sections: propSections,
  questions: propQuestions,
  addSection, 
  updateSection, 
  removeSection, 
  addQuestion, 
  updateQuestion, 
  removeQuestion, 
  quizData, 
  onChange 
}: QuestionsSectionProps) => {
  // Handle both old (flat questions) and new (sections) format
  const isLegacyMode = !propSections && propQuestions;
  const initialSections: QuizSection[] = isLegacyMode
    ? [{
        id: "default-section",
        title: "Phần 1",
        description: "",
        questions: propQuestions || [],
      }]
    : (propSections || []);

  const [internalSections, setInternalSections] = useState<QuizSection[]>(initialSections);
  
  const shuffleValue =
    quizData.randomizeQuestions && quizData.randomizeOptions
      ? "trộn tất cả"
      : quizData.randomizeQuestions
        ? "trộn câu hỏi"
        : quizData.randomizeOptions
          ? "trộn đáp án"
          : "không trộn";

  const handleShuffleChange = (value: string) => {
    switch (value) {
      case "trộn câu hỏi":
        onChange("randomizeQuestions", true);
        onChange("randomizeOptions", false);
        break;
      case "trộn đáp án":
        onChange("randomizeQuestions", false);
        onChange("randomizeOptions", true);
        break;
      case "trộn tất cả":
        onChange("randomizeQuestions", true);
        onChange("randomizeOptions", true);
        break;
      default:
        onChange("randomizeQuestions", false);
        onChange("randomizeOptions", false);
    }
  };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(internalSections.map((s) => s.id))
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(internalSections[0]?.id || null);
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const updatedOptions = currentQuestion.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }));
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleSaveQuestion = () => {
    if (!activeSectionId) return;

    if (isLegacyMode) {
      // Legacy mode: pass question to parent callback
      if (editingIndex !== null) {
        updateQuestion(editingIndex, currentQuestion);
      } else {
        addQuestion(currentQuestion);
      }
    } else {
      // New mode: pass sectionId and index
      if (editingIndex !== null) {
        updateQuestion(activeSectionId, editingIndex, currentQuestion);
      } else {
        addQuestion(activeSectionId, currentQuestion);
      }
    }
    
    // Update internal state AFTER calling parent callbacks
    setInternalSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              questions:
                editingIndex !== null
                  ? s.questions.map((q, i) => (i === editingIndex ? currentQuestion : q))
                  : [...s.questions, currentQuestion],
            }
          : s
      )
    );

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

  const handleEditQuestion = (sectionId: string, index: number) => {
    const section = internalSections.find((s) => s.id === sectionId);
    if (!section) return;

    const question = section.questions[index];
    setCurrentQuestion(question);
    setEditingIndex(index);
    setActiveSectionId(sectionId);
    const correctOption = question.options.find((opt) => opt.isCorrect);
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

  const handleAddSection = () => {
    const newSection: QuizSection = {
      id: `section-${Date.now()}`,
      title: `Phần ${internalSections.length + 1}`,
      description: "",
      questions: [],
    };
    
    if (isLegacyMode || !addSection) {
      setInternalSections((prev) => [...prev, newSection]);
    } else {
      addSection(newSection);
    }
    
    setActiveSectionId(newSection.id);
    setExpandedSections((prev) => new Set([...prev, newSection.id]));
  };

  const activeSection = internalSections.find((s) => s.id === activeSectionId);
  const questionNumber = (activeSection?.questions.length || 0) + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border rounded-xl px-6 py-4 shadow-sm bg-white">
        <h3 className="font-medium text-lg">Cài đặt câu hỏi</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Select value={shuffleValue} onValueChange={handleShuffleChange}>
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
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Số thứ tự câu hỏi</Label>
            <Select
              value={quizData.questionNumbering}
              onValueChange={(v) => onChange("questionNumbering", v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A, B, C...">A, B, C...</SelectItem>
                <SelectItem value="1, 2, 3...">1, 2, 3...</SelectItem>
                <SelectItem value="none">Không đánh số</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Số câu hỏi/trang</Label>
            <Select
              value={quizData.questionsPerPage.toString()}
              onValueChange={(v) => onChange("questionsPerPage", safeNum(v, 50))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground whitespace-nowrap">Đáp án/hàng</Label>
            <Select
              value={quizData.answersPerRow.toString()}
              onValueChange={(v) => onChange("answersPerRow", safeNum(v, 1))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sections Layout */}
      <div className="space-y-3">
        {internalSections.map((section) => (
          <div key={section.id} className="border rounded-xl shadow-sm overflow-hidden">
            {/* Section Header */}
            <div
              className="flex items-center justify-between px-6 py-4 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    expandedSections.has(section.id) ? "rotate-180" : ""
                  }`}
                />
                <div>
                  <h4 className="font-semibold">{section.title}</h4>
                  {section.description && (
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {section.questions.length} câu hỏi
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLegacyMode || !removeSection) {
                      setInternalSections((prev) => prev.filter((s) => s.id !== section.id));
                    } else {
                      removeSection(section.id);
                    }
                    if (activeSectionId === section.id) {
                      setActiveSectionId(internalSections[0]?.id || null);
                    }
                  }}
                  aria-label="Xóa phần"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {/* Section Content */}
            {expandedSections.has(section.id) && (
              <div className="px-6 py-4 space-y-3 bg-white">
                {/* Questions List */}
                {section.questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="border rounded-lg p-4 hover:border-primary transition-colors group cursor-pointer"
                    onClick={() => handleEditQuestion(section.id, index)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium">Câu {index + 1}</h5>
                        <span className="text-xs text-muted-foreground">{q.points} điểm</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLegacyMode) {
                            removeQuestion(index);
                            setInternalSections((prev) =>
                              prev.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      questions: s.questions.filter((_, i) => i !== index),
                                    }
                                  : s
                              )
                            );
                          } else {
                            removeQuestion(section.id, index);
                          }
                          if (editingIndex === index && activeSectionId === section.id) {
                            handleCancelEdit();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm mb-2">{q.text}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, optIndex) => (
                        <div key={opt.id} className="text-xs">
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                          <span className={opt.isCorrect ? "font-semibold text-primary ml-1" : " ml-1"}>
                            {opt.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add Question Form */}
                {activeSectionId === section.id && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-medium mb-4">
                      {editingIndex !== null ? `Chỉnh sửa câu ${editingIndex + 1}` : `Câu ${questionNumber}`}
                    </h5>
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
                      className="space-y-2 mb-4"
                    >
                      {currentQuestion.options.map((option, idx) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                          <div className="flex gap-2 items-center flex-1">
                            <Label htmlFor={option.id} className="font-medium min-w-fit">
                              {String.fromCharCode(65 + idx)}.
                            </Label>
                            <Input
                              value={option.text}
                              onChange={(e) => {
                                const updatedOptions = [...currentQuestion.options];
                                updatedOptions[idx].text = e.target.value;
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
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="points" className="text-sm">
                        Điểm
                      </Label>
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
                        className="w-20 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      {editingIndex !== null && (
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          Hủy
                        </Button>
                      )}
                      <Button onClick={handleSaveQuestion} size="sm" className="bg-primary text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        {editingIndex !== null ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <div className="flex space-x-2 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSection}
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span>Thêm phần</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Database className="h-4 w-4" />
            <span>Ngân hàng câu hỏi</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Tải file lên</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Thư viện</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>AI</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
