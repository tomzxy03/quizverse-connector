import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const safeNum = (v: string, fallback: number) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
};

interface AdvancedSettingsProps {
  quizData: {
    maxPoints: number;
    autoDistributePoints: boolean;
    showStudentWork: boolean;
    showCorrectAnswers?: boolean;
    maxAttempts: number;
    resultDisplay: string;
  };
  onChange: (field: string, value: unknown) => void;
}

const AdvancedSettings = ({ quizData, onChange }: AdvancedSettingsProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-medium mb-4">Hiển thị kết quả trắc nghiệm</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxPoints" className="font-medium">
              Điểm tối đa cho bài kiểm tra
            </Label>
            <Input
              id="maxPoints"
              type="number"
              min={0}
              value={quizData.maxPoints === 0 ? "" : quizData.maxPoints}
              onChange={(e) => onChange("maxPoints", safeNum(e.target.value, 10))}
              className="w-20 text-center"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Hệ thống sẽ tự động chia điểm</p>
              <p className="text-sm text-muted-foreground">Tự động chia đều điểm cho các câu hỏi</p>
            </div>
            <Switch
              checked={quizData.autoDistributePoints}
              onCheckedChange={(checked) => onChange("autoDistributePoints", checked)}
            />
          </div>

          <div>
            <Label className="font-medium mb-2 block">Kết quả sẽ hiển thị</Label>
            <Select
              value={quizData.resultDisplay}
              onValueChange={(v) => onChange("resultDisplay", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn thời điểm hiển thị kết quả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after_grading">Sau khi giáo viên chấm bài</SelectItem>
                <SelectItem value="after_deadline">Sau khi kết thúc thời gian làm bài</SelectItem>
                <SelectItem value="after_submission">Sau khi học sinh nộp bài</SelectItem>
              </SelectContent>
            </Select>
            {quizData.resultDisplay === "after_grading" && (
              <div className="mt-2 ml-4 bg-muted/30 p-4 rounded-md">
                <p className="text-sm">Kết quả hiển thị sau khi giáo viên chấm xong</p>
              </div>
            )}
            {quizData.resultDisplay === "after_deadline" && (
              <div className="mt-2 ml-4 bg-muted/30 p-4 rounded-md">
                <p className="text-sm">Kết quả hiển thị sau khi hết thời gian làm bài</p>
              </div>
            )}
            {quizData.resultDisplay === "after_submission" && (
              <div className="mt-2 ml-4 bg-muted/30 p-4 rounded-md">
                <p className="text-sm">Kết quả hiển thị ngay sau khi nộp bài</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cho phép hiển thị bài làm của học sinh</p>
              <p className="text-sm text-muted-foreground">
                Học sinh xem được nội dung bài làm sau khi nộp
              </p>
            </div>
            <Switch
              checked={quizData.showStudentWork}
              onCheckedChange={(checked) => {
                onChange("showStudentWork", checked);
                onChange("showCorrectAnswers", checked);
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-4">Nộp bài</h3>
        <div>
          <Label htmlFor="maxAttempts" className="block mb-2">
            Số lần nộp bài
          </Label>
          <Input
            id="maxAttempts"
            type="number"
            min={1}
            value={quizData.maxAttempts === 0 ? "" : quizData.maxAttempts}
            onChange={(e) => onChange("maxAttempts", Math.max(1, safeNum(e.target.value, 1)))}
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
