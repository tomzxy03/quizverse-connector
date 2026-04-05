import { X } from 'lucide-react';

type AboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-border overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About Quizory</p>
            <h2 className="text-lg font-semibold text-foreground">Thông tin dự án</h2>
          </div>
          <button
            type="button"
            className="p-2 rounded-md hover:bg-muted transition-colors"
            onClick={onClose}
            aria-label="Close about"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 text-sm text-foreground">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="font-medium text-amber-900">Cảnh báo dữ liệu</p>
            <p className="mt-1 text-amber-800">
              Một số dữ liệu trong hệ thống chỉ mang tính minh hoạ. Vui lòng không sử dụng cho mục đích chính thức.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="font-medium">Nguồn dự án</p>
            <p className="mt-1 text-muted-foreground">
              Nếu bạn cần source code hoặc muốn tham khảo, hãy xem tại Github của mình.
            </p>
            Backend: 
            <a
              className="mt-2 inline-flex items-center text-primary font-medium hover:underline"
              href="https://github.com/tomzxy03/webquiz.git"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/tomzxy03/webquiz.git
            </a>
            <br />
            Frontend: 
            <a
              className="mt-2 inline-flex items-center text-primary font-medium hover:underline"
              href="https://github.com/tomzxy03/quizverse-connector.git"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/tomzxy03/quizverse-connector.git
            </a>
          </div>

          <div className="rounded-lg border border-border px-4 py-3">
            <p className="font-medium">Liên hệ</p>
            <p className="mt-1 text-muted-foreground">
              Mọi góp ý hoặc phát hiện lỗi vui lòng liên hệ trực tiếp với mình để cải thiện sản phẩm.
              Email: thichcakhia20@gmail.com
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
