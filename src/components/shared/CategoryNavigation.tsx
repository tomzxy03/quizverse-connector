import { Link } from 'react-router-dom';
import {
  Code,
  Calculator,
  Scale,
  Heart,
  Briefcase,
  Beaker,
  BookOpen,
  Globe,
  Languages,
  Cpu
} from 'lucide-react';

// Category configurations
export const categories = [
  {
    id: 'programming',
    name: 'Lập trình',
    icon: Code,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    count: 248
  },
  {
    id: 'economics',
    name: 'Kinh tế',
    icon: Calculator,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    count: 156
  },
  {
    id: 'law',
    name: 'Pháp luật',
    icon: Scale,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    count: 89
  },
  {
    id: 'medicine',
    name: 'Y khoa',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    count: 134
  },
  {
    id: 'business',
    name: 'Quản trị',
    icon: Briefcase,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    count: 201
  },
  {
    id: 'science',
    name: 'Khoa học',
    icon: Beaker,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    count: 112
  },
  {
    id: 'literature',
    name: 'Văn học',
    icon: BookOpen,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    count: 78
  },
  {
    id: 'languages',
    name: 'Ngoại ngữ',
    icon: Languages,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    count: 167
  },
  {
    id: 'engineering',
    name: 'Kỹ thuật',
    icon: Cpu,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    count: 143
  },
  {
    id: 'social',
    name: 'Xã hội',
    icon: Globe,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    count: 94
  }
];

interface CategoryNavigationProps {
  title?: string;
  showCount?: boolean;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ 
  title = 'Khám phá theo môn học',
  showCount = true
}) => {
  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {title}
          </h2>
          <p className="text-slate-600">
            Chọn môn học để xem tất cả quiz liên quan
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link
                key={category.id}
                to={`/subjects/${category.id}`}
                className="group"
              >
                <div className={`
                  relative overflow-hidden
                  bg-white rounded-xl border-2 border-slate-200
                  hover:border-indigo-300 hover:shadow-lg
                  transition-all duration-300
                  p-6
                `}>
                  {/* Icon Circle */}
                  <div className={`
                    w-14 h-14 rounded-full mb-4 mx-auto
                    flex items-center justify-center
                    bg-gradient-to-br ${category.color}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-center font-semibold text-slate-900 mb-2">
                    {category.name}
                  </h3>

                  {/* Quiz Count */}
                  {showCount && (
                    <p className="text-center text-sm text-slate-500">
                      {category.count} quiz
                    </p>
                  )}

                  {/* Hover Effect Gradient */}
                  <div className={`
                    absolute inset-0 
                    bg-gradient-to-br ${category.color}
                    opacity-0 group-hover:opacity-5
                    transition-opacity duration-300
                  `} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Browse All Link */}
        <div className="text-center mt-8">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Xem tất cả môn học
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryNavigation;