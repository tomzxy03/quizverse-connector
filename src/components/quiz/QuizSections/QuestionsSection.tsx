
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, FileText, UploadCloud, BrainCircuit, Database, Trash2, ChevronDown, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { folderService, questionService } from "@/services";
import { toast } from "@/hooks/use-toast";

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

interface BankQuestion {
  id: string;
  questionName: string;
  answers: { text: string; isCorrect: boolean }[];
  points?: number;
  folderId?: string;
}

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const mapBackendFolders = (folders: any[]): FolderNode[] => {
  return folders.map((f) => ({
    id: String(f.id),
    name: f.name || "Thư mục không tên",
    children: f.children ? mapBackendFolders(f.children) : undefined,
  }));
};

const getAllFolderIds = (nodes: FolderNode[]): { id: string; name: string }[] => {
  const out: { id: string; name: string }[] = [];
  const walk = (list: FolderNode[], prefix = "") => {
    list.forEach((n) => {
      if (n.id !== "root") out.push({ id: n.id, name: prefix + n.name });
      if (n.children?.length) walk(n.children, prefix + n.name + " / ");
    });
  };
  walk(nodes);
  return out;
};

interface QuestionsSectionProps {
  sections?: QuizSection[];
  questions?: Question[];
  addSection?: (section: QuizSection) => void;
  updateSection?: (id: string, section: QuizSection) => void;
  removeSection?: (id: string) => void;
  addQuestion: (sectionIdOrQuestion: string | Question, questionOrIndex?: Question | number, question?: Question) => void;
  updateQuestion: (sectionIdOrIndex: string | number, indexOrQuestion?: number | Question, question?: Question) => void;
  removeQuestion: (sectionIdOrIndex: string | number, index?: number) => void;
  groupId?: number;
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

const formatQuestionLabel = (index: number, numbering?: string) => {
  if (numbering === "A, B, C...") {
    return String.fromCharCode(65 + index);
  }
  if (numbering === "1, 2, 3...") {
    return String(index + 1);
  }
  if (numbering === "none") {
    return "";
  }
  return String(index + 1);
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
  groupId,
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
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [bankFolders, setBankFolders] = useState<FolderNode[]>([]);
  const [selectedBankFolderId, setSelectedBankFolderId] = useState<string>("root");
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(new Set());

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

  const loadBankQuestions = async () => {
    setBankLoading(true);
    try {
      let allQuestionsRaw: any[] = [];
      const [qRes, foldersRes] = await Promise.all([
        questionService.getAllQuestionsByBank(0, 1000),
        folderService.getFolderTree(),
      ]);
      if (Array.isArray(qRes)) allQuestionsRaw = qRes;
      else if (Array.isArray(qRes?.content)) allQuestionsRaw = qRes.content;
      else if (Array.isArray(qRes?.items)) allQuestionsRaw = qRes.items;
      else if (qRes?.items?.items && Array.isArray(qRes.items.items)) {
        allQuestionsRaw = qRes.items.items;
      }

      const mappedQuestions: BankQuestion[] = allQuestionsRaw.map((raw: any, idx: number) => {
        const q = raw.question || raw;
        return {
          id: q.id != null ? String(q.id) : `tmp-${idx}`,
          questionName: q.questionName || q.content || "Untitled",
          points: q.points || 1,
          folderId: raw.folderId ? String(raw.folderId) : (q.folderId ? String(q.folderId) : "root"),
          answers: q.answers?.map((a: any) => ({
            text: a.answerText || a.answerName || a.text || "",
            isCorrect: a.answerCorrect || a.isCorrect || false,
          })) ?? [],
        };
      });
      setBankQuestions(mappedQuestions);
      const mappedFolders = mapBackendFolders(foldersRes || []);
      setBankFolders([
        { id: "root", name: "Tất cả câu hỏi", children: mappedFolders },
      ]);
    } catch (error) {
      console.error(error);
      toast({ title: "Lỗi tải ngân hàng câu hỏi", variant: "destructive" });
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    if (!bankDialogOpen) return;
    if (bankQuestions.length === 0) {
      loadBankQuestions();
    }
  }, [bankDialogOpen, bankQuestions.length]);

  const visibleBankQuestions = useMemo(() => {
    let filtered = bankQuestions;
    if (selectedBankFolderId !== "root") {
      filtered = filtered.filter((q) => q.folderId === selectedBankFolderId);
    }
    if (!bankSearch.trim()) return filtered;
    const term = bankSearch.toLowerCase();
    return filtered.filter((q) => q.questionName.toLowerCase().includes(term));
  }, [bankQuestions, bankSearch, selectedBankFolderId]);

  const toggleBankSelect = (id: string) => {
    setSelectedBankIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const mapBankToQuizQuestion = (q: BankQuestion): Question => ({
    id: `q-bank-${q.id}`,
    text: q.questionName,
    options: (q.answers || []).map((a, idx) => ({
      id: `opt-bank-${q.id}-${idx}`,
      text: a.text,
      isCorrect: a.isCorrect,
    })),
    points: q.points || 1,
  });

  const appendQuestionsToActiveSection = (newQuestions: Question[]) => {
    if (!activeSectionId) {
      toast({ title: "Vui lòng chọn phần để thêm câu hỏi.", variant: "destructive" });
      return;
    }

    if (isLegacyMode) {
      newQuestions.forEach((q) => addQuestion(q));
    } else {
      newQuestions.forEach((q) => addQuestion(activeSectionId, q));
    }

    setInternalSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? { ...s, questions: [...s.questions, ...newQuestions] }
          : s
      )
    );
  };

  const handleAddSelectedBankQuestions = () => {
    const selected = bankQuestions.filter((q) => selectedBankIds.has(q.id));
    if (selected.length === 0) return;
    const newQuestions = selected.map(mapBankToQuizQuestion);
    appendQuestionsToActiveSection(newQuestions);
    setSelectedBankIds(new Set());
    setBankDialogOpen(false);
  };

  const handleImportQuestions = async (file: File) => {
    setIsImporting(true);
    try {
      const imported = groupId
        ? await questionService.importQuestionsFromExcelForGroup(groupId, file)
        : await questionService.importQuestionsFromExcel(file);
      const mappedQuestions: Question[] = (imported || []).map((q: any, idx: number) => ({
        id: q.id != null ? `q-import-${q.id}` : `q-import-${Date.now()}-${idx}`,
        text: q.questionName || "Untitled",
        options: (q.answers || []).map((a: any, aIdx: number) => ({
          id: a.id != null ? `opt-import-${a.id}` : `opt-import-${idx}-${aIdx}`,
          text: a.answerText || "",
          isCorrect: a.isCorrect === true,
        })),
        points: q.points || 1,
      }));

      if (mappedQuestions.length === 0) {
        toast({ title: "File không có câu hỏi hợp lệ.", variant: "destructive" });
        return;
      }

      appendQuestionsToActiveSection(mappedQuestions);
      toast({ title: `Đã nhập ${mappedQuestions.length} câu hỏi.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Không thể nhập file Excel.", variant: "destructive" });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
                  <h4 className="font-medium">{section.title}</h4>
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
                        <h5 className="font-medium">
                          {(() => {
                            const label = formatQuestionLabel(index, quizData.questionNumbering);
                            return label ? `Câu ${label}` : "Câu hỏi";
                          })()}
                        </h5>
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
                    <div
                      className={
                        quizData.answersPerRow === 2
                          ? "grid grid-cols-2 gap-x-6 gap-y-1"
                          : "space-y-1"
                      }
                    >
                      {q.options.map((opt, optIndex) => (
                        <div key={opt.id} className="text-xs">
                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                          <span className={opt.isCorrect ? "font-medium text-primary ml-1" : " ml-1"}>
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
                      {editingIndex !== null
                        ? (() => {
                            const label = formatQuestionLabel(editingIndex, quizData.questionNumbering);
                            return label ? `Chỉnh sửa câu ${label}` : "Chỉnh sửa câu hỏi";
                          })()
                        : (() => {
                            const label = formatQuestionLabel(questionNumber - 1, quizData.questionNumbering);
                            return label ? `Câu ${label}` : "Câu hỏi";
                          })()}
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
                      className={
                        quizData.answersPerRow === 2
                          ? "grid grid-cols-2 gap-x-6 gap-y-2 mb-4"
                          : "space-y-2 mb-4"
                      }
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
          <Dialog
            open={bankDialogOpen}
            onOpenChange={(open) => {
              if (!open) setSelectedBankIds(new Set());
              setBankDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Database className="h-4 w-4" />
                <span>Ngân hàng câu hỏi</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chọn câu hỏi từ ngân hàng</DialogTitle>
                <DialogDescription>Chọn nhiều câu hỏi và thêm vào phần đang chọn.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">Thư mục</Label>
                  <Select value={selectedBankFolderId} onValueChange={setSelectedBankFolderId}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Chọn thư mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Tất cả câu hỏi</SelectItem>
                      {getAllFolderIds(bankFolders).map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Tìm câu hỏi..."
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[360px] rounded-lg border">
                  <div className="divide-y">
                    {bankLoading ? (
                      <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải câu hỏi...
                      </div>
                    ) : visibleBankQuestions.length === 0 ? (
                      <div className="p-6 text-sm text-muted-foreground">Không có câu hỏi phù hợp.</div>
                    ) : (
                      visibleBankQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-start gap-3 p-3 hover:bg-muted/40 cursor-pointer"
                          onClick={() => toggleBankSelect(q.id)}
                        >
                          <Checkbox
                            checked={selectedBankIds.has(q.id)}
                            onCheckedChange={() => toggleBankSelect(q.id)}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{q.questionName}</p>
                            {q.answers?.length > 0 && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {q.answers.map((a, idx) => `${String.fromCharCode(65 + idx)}. ${a.text}`).join(" • ")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBankDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleAddSelectedBankQuestions}
                  disabled={selectedBankIds.size === 0}
                >
                  Thêm {selectedBankIds.size} câu hỏi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={isImporting}
              >
                <UploadCloud className="h-4 w-4" />
                <span>{isImporting ? "Đang nhập..." : "Tải file lên"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Questions</DialogTitle>
                <DialogDescription className="sr-only">
                  Upload file to import questions.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-center">
                <Button
                  type="button"
                  variant="default"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>{isImporting ? "Uploading..." : "Upload file"}</span>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Select or drag and drop files
                </p>
              </div>
              <div className="grid gap-3 pt-2 sm:grid-cols-1">
                <div className="flex items-center justify-between rounded-xl border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-16 place-items-center rounded-lg border bg-muted/30">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Download template</p>
                      <p className="text-xs text-muted-foreground">Excel (.xlsx)</p>
                    </div>
                  </div>
                  <a
                    href="/templates/quiz-questions-template.xlsx"
                    download
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span>Download</span>
                    <span className="text-lg leading-none">↓</span>
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImportQuestions(file);
                setUploadDialogOpen(false);
              }
            }}
          />
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
