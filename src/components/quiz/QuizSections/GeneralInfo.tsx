import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlignLeft, Type, BookOpen, Gauge, Globe, Clock } from "lucide-react";

const SUBJECT_OPTIONS = ["Toán", "Vật lý", "Hóa học", "Sinh học", "Tiếng Anh", "Lịch sử", "Địa lý", "Lập trình", "Khác"];
const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Dễ" },
  { value: "medium", label: "Trung bình" },
  { value: "hard", label: "Khó" },
] as const;

interface GeneralInfoProps {
  quizData: {
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    isPublic: boolean;
    duration: number;
    useStartTime: boolean;
    useEndTime: boolean;
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  };
  onChange: (field: string, value: unknown) => void;
}

const GeneralInfo = ({ quizData, onChange }: GeneralInfoProps) => {
  const safeNum = (v: string, fallback: number) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? fallback : n;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Type className="text-muted-foreground" size={20} />
          <Label htmlFor="title" className="text-base font-medium">
            Tiêu đề bài kiểm tra
          </Label>
        </div>
        <Input
          id="title"
          value={quizData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Nhập tiêu đề..."
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <AlignLeft className="text-muted-foreground" size={20} />
          <Label htmlFor="description" className="text-base font-medium">
            Mô tả ngắn gọn
          </Label>
        </div>
        <Textarea
          id="description"
          value={quizData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Mô tả ngắn gọn về bài kiểm tra..."
          className="min-h-[120px] w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-muted-foreground" size={20} />
          <Label htmlFor="subject" className="text-base font-medium">
            Môn học
          </Label>
        </div>
        <Select
          value={quizData.subject || undefined}
          onValueChange={(v) => onChange("subject", v)}
        >
          <SelectTrigger id="subject">
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {/* <div className="flex items-center gap-3">
          <Gauge className="text-muted-foreground" size={20} />
          <Label className="text-base font-medium">
            Độ khó
          </Label>
        </div>
        <Select
          value={quizData.difficulty || undefined}
          onValueChange={(v) => onChange("difficulty", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn độ khó" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <Globe className="text-muted-foreground" size={20} />
          <div>
            <p className="font-medium">Công khai</p>
            <p className="text-sm text-muted-foreground">
              Quiz công khai có thể được tìm thấy trong thư viện
            </p>
          </div>
        </div>
        <Switch
          checked={quizData.isPublic}
          onCheckedChange={(checked) => onChange("isPublic", checked)}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="text-muted-foreground" size={20} />
          <Label className="text-base font-medium">Cài đặt thời gian</Label>
        </div>
        <div className="space-y-6 pl-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={quizData.duration > 0}
                onCheckedChange={(checked) => onChange("duration", checked ? 1 : 0)}
              />
              <div>
                <p className="font-medium">Thời gian làm bài</p>
                <p className="text-sm text-muted-foreground">
                  Thời gian tối đa làm bài kiểm tra khi bắt đầu làm
                </p>
              </div>
            </div>
            <div className="mt-2 pl-10">
              <div className="flex items-center">
                <Input
                  type="number"
                  min={0}
                  value={quizData.duration === 0 ? "" : quizData.duration}
                  onChange={(e) => onChange("duration", safeNum(e.target.value, 0))}
                  className="w-32"
                />
                <span className="ml-4">Phút</span>
              </div>
            </div>
            
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={quizData.useStartTime}
                onCheckedChange={(checked) => onChange("useStartTime", checked)}
              />
              <div>
                <p className="font-medium">Thời gian bắt đầu làm bài</p>
                <p className="text-sm text-muted-foreground">
                  Quy định thời gian người dùng có thể bắt đầu làm bài kiểm tra
                </p>
              </div>
            </div>
            {quizData.useStartTime && (
            <div className="mt-2 pl-10 flex flex-wrap gap-4">
              <Input
                type="time"
                value={quizData.startTime}
                onChange={(e) => onChange("startTime", e.target.value)}
                className="w-36"
              />
              <Input
                type="date"
                value={quizData.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
                className="w-40"
              />
            </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={quizData.useEndTime}
                onCheckedChange={(checked) => onChange("useEndTime", checked)}
              />
              <div>
                <p className="font-medium">Thời gian kết thúc làm bài</p>
                <p className="text-sm text-muted-foreground">
                  Sau mốc thời gian này bài làm sẽ tự động nộp
                </p>
              </div>
            </div>
            {quizData.useEndTime && (
            <div className="mt-2 pl-10 flex flex-wrap gap-4">
              <Input
                type="time"
                value={quizData.endTime}
                onChange={(e) => onChange("endTime", e.target.value)}
                className="w-36"
              />
              <Input
                type="date"
                value={quizData.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
                className="w-40"
              />
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
