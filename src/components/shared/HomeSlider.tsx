import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuizCard, { Quiz } from '@/components/quiz/QuizCard';

interface QuizSliderProps {
  quizzes: Quiz[];
  title?: string;
  slidesPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const QuizSlider: React.FC<QuizSliderProps> = ({ 
  quizzes,
  title = 'Quiz mới nhất',
  slidesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(slidesPerView.desktop);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(slidesPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(slidesPerView.tablet);
      } else {
        setSlidesToShow(slidesPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesPerView]);

  const maxIndex = Math.max(0, Math.ceil(quizzes.length / slidesToShow) - 1);

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Touch/Mouse drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Snap to nearest slide
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.scrollWidth / quizzes.length;
      const newIndex = Math.round(sliderRef.current.scrollLeft / (cardWidth * slidesToShow));
      setCurrentIndex(Math.min(Math.max(newIndex, 0), maxIndex));
    }
  };

  // Calculate transform for current index
  const translateX = -(currentIndex * (100 / slidesToShow));

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        
        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className={`
              p-2 rounded-lg border transition-all
              ${currentIndex === 0 
                ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                : 'border-slate-300 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50'
              }
            `}
            aria-label="Previous slides"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex === maxIndex}
            className={`
              p-2 rounded-lg border transition-all
              ${currentIndex === maxIndex
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-slate-300 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50'
              }
            `}
            aria-label="Next slides"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
          style={{ 
            transform: `translateX(${translateX}%)`,
            userSelect: isDragging ? 'none' : 'auto'
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex-shrink-0 px-2"
              style={{ 
                width: `${100 / slidesToShow}%`,
                minWidth: `${100 / slidesToShow}%`
              }}
            >
              <QuizCard quiz={quiz} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator - Mobile */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                h-2 rounded-full transition-all
                ${currentIndex === index 
                  ? 'w-6 bg-indigo-600' 
                  : 'w-2 bg-slate-300'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizSlider;