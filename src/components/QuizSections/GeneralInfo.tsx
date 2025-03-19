
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AlignLeft, Type } from "lucide-react";

interface GeneralInfoProps {
  quizData: {
    title: string;
    description: string;
    duration: number;
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  };
  onChange: (field: string, value: any) => void;
}

const GeneralInfo = ({ quizData, onChange }: GeneralInfoProps) => {
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
        <h3 className="text-base font-medium">Cài đặt thời gian</h3>
        
        <div className="space-y-6 pl-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-5">
                <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                <div className="absolute inset-y-0 left-0 w-5 h-5 bg-primary rounded-full"></div>
              </div>
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
                  min="0"
                  value={quizData.duration}
                  onChange={(e) => onChange("duration", parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="ml-4">Phút</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-5">
                <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                <div className="absolute inset-y-0 left-0 w-5 h-5 bg-primary rounded-full"></div>
              </div>
              <div>
                <p className="font-medium">Thời gian bắt đầu làm bài</p>
                <p className="text-sm text-muted-foreground">
                  Quy định thời gian người dùng có thể bắt đầu làm bài kiểm tra,
                  người dùng không thể bắt đầu làm bài trước mốc thời gian này
                </p>
              </div>
            </div>
            <div className="mt-2 pl-10 flex flex-wrap gap-4">
              <div className="flex items-center">
                <Input
                  type="time"
                  value={quizData.startTime}
                  onChange={(e) => onChange("startTime", e.target.value)}
                  className="w-36"
                />
              </div>
              <div className="flex items-center">
                <Input
                  type="date"
                  value={quizData.startDate}
                  onChange={(e) => onChange("startDate", e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-5">
                <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                <div className="absolute inset-y-0 left-0 w-5 h-5 bg-primary rounded-full"></div>
              </div>
              <div>
                <p className="font-medium">Thời gian kết thúc làm bài</p>
                <p className="text-sm text-muted-foreground">
                  Quy định kết thúc hiệu lực làm bài kiểm tra, người dùng sẽ không
                  thể làm bài khi đến mốc thời gian này hoặc nếu đang làm bài thì
                  bài kiểm tra sẽ dừng và tự động nộp bài.
                </p>
              </div>
            </div>
            <div className="mt-2 pl-10 flex flex-wrap gap-4">
              <div className="flex items-center">
                <Input
                  type="time"
                  value={quizData.endTime}
                  onChange={(e) => onChange("endTime", e.target.value)}
                  className="w-36"
                />
              </div>
              <div className="flex items-center">
                <Input
                  type="date"
                  value={quizData.endDate}
                  onChange={(e) => onChange("endDate", e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
