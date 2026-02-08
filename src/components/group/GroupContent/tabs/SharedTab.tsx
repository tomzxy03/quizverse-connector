import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Group } from '../types';

const SharedTab = ({ group }: { group: Group }) => {
  const link = `https://quizplatform.com/join/${group.id}`;

  return (
    <Card className="max-w-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Chia sẻ nhóm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Gửi link này cho bạn bè để tham gia nhóm.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 px-3 py-2 text-sm bg-muted/30 border border-border rounded-md text-foreground"
          />
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharedTab;
