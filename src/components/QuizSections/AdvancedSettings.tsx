
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

interface AdvancedSettingsProps {
  quizData: {
    maxPoints: number;
    autoDistributePoints: boolean;
    showStudentWork: boolean;
    questionNumbering: string;
    questionsPerPage: number;
    answersPerRow: number;
    maxAttempts: number;
  };
  onChange: (field: string, value: any) => void;
}

const AdvancedSettings = ({ quizData, onChange }: AdvancedSettingsProps) => {
  const [resultDisplay, setResultDisplay] = useState<string>("after_grading");

  const handleResultDisplayChange = (value: string) => {
    setResultDisplay(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-medium mb-4">Hiển thị kết quả trắc nghiệm:</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxPoints" className="font-medium">
              Điểm tối đa cho bài kiểm tra
            </Label>
            <Input
              id="maxPoints"
              type="number"
              value={quizData.maxPoints}
              onChange={(e) => onChange("maxPoints", parseInt(e.target.value))}
              className="w-20 text-center"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Hệ thống sẽ tự động chia điểm</p>
              <p className="text-sm text-muted-foreground">Tính năng tự động chia đều điểm cho các câu hỏi</p>
            </div>
            <Switch
              checked={quizData.autoDistributePoints}
              onCheckedChange={(checked) => onChange("autoDistributePoints", checked)}
            />
          </div>
          
          <div>
            <Label className="font-medium mb-2 block">
              Kết quả sẽ hiển thị
            </Label>
            <Select value={resultDisplay} onValueChange={handleResultDisplayChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn thời điểm hiển thị kết quả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after_grading">Sau khi giáo viên chấm bài</SelectItem>
                <SelectItem value="after_deadline">Sau khi kết thúc thời gian quy định làm bài</SelectItem>
                <SelectItem value="after_submission">Sau khi học sinh nộp bài</SelectItem>
              </SelectContent>
            </Select>
            
            {resultDisplay === "after_grading" && (
              <div className="mt-2 ml-4 bg-muted/30 p-4 rounded-md">
                <p className="text-sm">
                  Kết quả bài kiểm tra sẽ hiển thị ngay sau khi giáo viên chấm
                  xong bài kiểm tra
                </p>
              </div>
            )}
            {resultDisplay === "after_deadline" && (
              <div className="mt-2 ml-4 bg-muted/30 p-4 rounded-md">
                <p className="text-sm">
                  Kết quả bài kiểm tra sẽ hiển thị ngay sau khi học sinh kết
                  thúc thời gian làm bài
                </p>
              </div>
            )}
            {resultDisplay === "after_submission" && (
              <div className="mt-2 ml-4 bg-muted/30 p-4 rounded-md">
                <p className="text-sm">
                  Kết quả bài kiểm tra sẽ hiển thị ngay sau khi học sinh nộp
                  bài kiểm tra
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cho phép hiển thị bài làm của học sinh</p>
              <p className="text-sm text-muted-foreground">
                Bật tính năng này thì người làm bài kiểm tra sẽ thấy
                được nội dung làm bài kiểm tra của mình sau khi nộp
                bài, nếu tắt thì học sinh chỉ thấy được nội dung bài kiểm
                tra đã làm sau khi bài kiểm tra được xác nhận điểm
              </p>
            </div>
            <Switch
              checked={quizData.showStudentWork}
              onCheckedChange={(checked) => onChange("showStudentWork", checked)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-base font-medium mb-4">Hiển thị câu hỏi và câu trả lời</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="questionNumbering" className="block mb-2">
              Số thứ tự câu hỏi
            </Label>
            <Select 
              value={quizData.questionNumbering}
              onValueChange={(value) => onChange("questionNumbering", value)}
            >
              <SelectTrigger id="questionNumbering">
                <SelectValue placeholder="Chọn kiểu đánh số" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A, B, C...">A, B, C...</SelectItem>
                <SelectItem value="1, 2, 3...">1, 2, 3...</SelectItem>
                <SelectItem value="none">Không đánh số</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="questionsPerPage" className="block mb-2">
              Số câu hỏi trên trang làm bài
            </Label>
            <Select
              value={quizData.questionsPerPage.toString()}
              onValueChange={(value) => onChange("questionsPerPage", parseInt(value))}
            >
              <SelectTrigger id="questionsPerPage">
                <SelectValue placeholder="Chọn số câu hỏi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="answersPerRow" className="block mb-2">
              Số câu trả lời trên 1 hàng
            </Label>
            <Select
              value={quizData.answersPerRow.toString()}
              onValueChange={(value) => onChange("answersPerRow", parseInt(value))}
            >
              <SelectTrigger id="answersPerRow">
                <SelectValue placeholder="Chọn số câu trả lời" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="maxAttempts" className="block mb-2">
              Số lần nộp bài
            </Label>
            <Input
              id="maxAttempts"
              type="number"
              min="1"
              value={quizData.maxAttempts}
              onChange={(e) => onChange("maxAttempts", parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
