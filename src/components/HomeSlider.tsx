
import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Master Your Knowledge",
    description: "Test your skills with thousands of quizzes in our library",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 2,
    title: "Collaborate with Friends",
    description: "Create study groups and share quizzes with your classmates",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: 3,
    title: "Learn Anywhere, Anytime",
    description: "Access your quizzes on any device, whenever you want",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startAutoSlide = () => {
    intervalRef.current = window.setInterval(() => {
      goToNextSlide();
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToPrevSlide = () => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    startAutoSlide();
    
    return () => {
      stopAutoSlide();
    };
  }, []);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl max-w-lg animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {slide.description}
            </p>
          </div>
        </div>
      ))}
      
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors"
        onClick={goToPrevSlide}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors"
        onClick={goToNextSlide}
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;
