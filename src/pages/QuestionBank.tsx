import Header from '@/components/layout/Header';
import QuestionBankTab from '@/components/group/GroupContent/tabs/QuestionBankTab';

const QuestionBankPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <QuestionBankTab />
        </div>
      </main>
    </div>
  );
};

export default QuestionBankPage;

