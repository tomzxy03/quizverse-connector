import { useEffect, useState } from 'react';
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
import { subjectRepository } from '@/repositories';
import type { Subject } from '@/domains/subject/subject.types';
import type { SubjectDetailResDTO } from '@/domains/subject/subject.dto';

const CATEGORY_ICONS = [Code, Calculator, Scale, Heart, Briefcase, Beaker, BookOpen, Languages, Cpu, Globe];
const CATEGORY_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-amber-500 to-amber-600',
  'from-red-500 to-red-600',
  'from-teal-500 to-teal-600',
  'from-green-500 to-green-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-cyan-500 to-cyan-600',
  'from-orange-500 to-orange-600',
];

type CategoryItem = {
  id: number;
  name: string;
  count: number;
  icon: typeof Code;
  color: string;
};

interface CategoryNavigationProps {
  title?: string;
  showCount?: boolean;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ 
  title = 'Khám phá theo môn học',
  showCount = true
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        setLoading(true);
        const [subjects, counts] = await Promise.all([
          subjectRepository.getAll(),
          subjectRepository.getQuizCounts(),
        ]);
        const countMap = new Map<number, SubjectDetailResDTO>();
        counts.forEach((c) => countMap.set(c.id, c));
        const items = subjects.map((subject: Subject, idx: number) => ({
          id: subject.id,
          name: subject.name,
          count: countMap.get(subject.id)?.countQuiz ?? 0,
          icon: CATEGORY_ICONS[idx % CATEGORY_ICONS.length],
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        }));
        if (!cancelled) setCategories(items);
      } catch (error) {
        console.error('Failed to load categories:', error);
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

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
          {loading && (
            <div className="col-span-full text-center text-sm text-slate-500">
              Đang tải danh mục...
            </div>
          )}
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <Link
                key={category.id}
                to={`/library/${category.id}`}
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
                  <h3 className="text-center font-medium text-slate-900 mb-2">
                    {category.name}
                  </h3>

                  {/* Quiz Count */}
                  {showCount && (
                    <p className="text-center text-sm text-slate-500">
                      {category.count} quiz
                    </p>
                  )}

                  {/* Hover Effect Gradient */}
                  <div
                    className={`
                      absolute inset-0 
                      bg-gradient-to-br ${category.color}
                      opacity-0 group-hover:opacity-5
                      transition-opacity duration-300
                    `}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Browse All Link */}
        <div className="text-center mt-8">
          <Link
            to="/library"
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
