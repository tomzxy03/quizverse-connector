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
    reviewScore?: boolean;
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
            
            <div className="flex items-center justify-between ">
              <div>
                <p className="font-medium">Cho phép học sinh xem điểm</p>
                <p className="text-sm text-muted-foreground">
                  Điểm sẽ được hiển thị sau khi hết thời gian làm bài hoặc nộp bài
                </p>
              </div>
              <Switch
                checked={quizData.reviewScore ?? false}
                onCheckedChange={(checked) => onChange("reviewScore", checked)}
              />
            </div>
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
