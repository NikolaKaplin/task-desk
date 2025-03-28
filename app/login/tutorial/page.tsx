"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tutorialSlides } from "@/app/constants";
import { getUserSession } from "@/lib/get-session-server";

export default function TutorialPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserSession();
      if (user && user.role != "UNVERIFIED") {
        return;
      } else {
        router.push("/login");
      }
    })();
  }, [router]);

  const totalSlides = 7;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(currentSlide + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(currentSlide - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToSlide = (index: any) => {
    if (index !== currentSlide && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const completeTutorial = () => {
    router.push("/profile");
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, isAnimating]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: any) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: any) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      // Минимальное расстояние для определения свайпа (в пикселях)
      const minSwipeDistance = 50;

      if (touchStartX - touchEndX > minSwipeDistance && !isAnimating) {
        // Свайп влево
        nextSlide();
      } else if (touchEndX - touchStartX > minSwipeDistance && !isAnimating) {
        // Свайп вправо
        prevSlide();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide, isAnimating]);

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Прогресс барчик */}
      <div className="min-w-full h-[1vh] bg-gray-700">
        <div
          className="min-h-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Счет слайдов */}
      <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden">
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 text-xs sm:text-sm font-medium bg-black/50 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
          {currentSlide + 1} / {totalSlides}
        </div>

        {/* Карусель */}
        <div className="w-full h-full">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {tutorialSlides.map((slide, index) => (
              <div
                key={index}
                className="w-full h-full flex-shrink-0 flex items-center justify-center"
              >
                {slide.isLastSlide ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-4 py-6 sm:py-0">
                    <div className="relative mb-4 sm:mb-8">
                      <div className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8 animate-pulse">
                        <Sparkles className="h-4 w-4 sm:h-8 sm:w-8 text-yellow-400" />
                      </div>
                      <div className="absolute -top-2 -right-4 sm:-top-4 sm:-right-8 animate-pulse delay-300">
                        <Sparkles className="h-4 w-4 sm:h-8 sm:w-8 text-yellow-400" />
                      </div>
                      <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 px-6">
                        {slide.title}
                      </h1>
                      <div className="absolute -bottom-2 -right-4 sm:-bottom-4 sm:-right-8 animate-pulse delay-150">
                        <Sparkles className="h-4 w-4 sm:h-8 sm:w-8 text-yellow-400" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 animate-pulse delay-500">
                        <Sparkles className="h-4 w-4 sm:h-8 sm:w-8 text-yellow-400" />
                      </div>
                    </div>
                    <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-3xl h-auto aspect-video rounded-lg overflow-hidden shadow-xl mb-4 sm:mb-8 transform transition-transform hover:scale-105 duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        className="object-contain w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 z-20">
                        <p className="text-base sm:text-xl md:text-2xl text-white font-medium">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                    <div className="relative mt-4 sm:mt-8">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-75 blur-md animate-pulse"></div>
                      <Button
                        onClick={completeTutorial}
                        className="relative px-4 sm:px-8 py-3 sm:py-6 rounded-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold text-sm sm:text-xl shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        Перейти к Altergemu
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-6 sm:w-6" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6 sm:py-0 gap-4 sm:gap-8">
                    <div className="min-w-full flex justify-center">
                      <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-2xl h-auto aspect-video rounded-lg overflow-hidden shadow-xl">
                        <img
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-center sm:items-center space-y-2 sm:space-y-4 text-center sm:text-left">
                      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
                        {slide.title}
                      </h1>
                      <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-md sm:max-w-lg">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Навигационные кнопки*/}
        <Button
          size="icon"
          onClick={prevSlide}
          disabled={currentSlide === 0 || isAnimating}
          className="absolute left-2 sm:left-4 md:left-8 z-50 rounded-full h-[5vh] w-[5vh] sm:h-[5vh] sm:w-[5vh] bg-black/50 hover:bg-black/70 border-0"
        >
          <ChevronLeft className="h-[1vh] w-[1vh] sm:h-[2vh] sm:w-[2vh]" />
        </Button>

        {currentSlide !== totalSlides - 1 && (
          <Button
            size="icon"
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-2 sm:right-4 md:right-8 z-50 rounded-full h-[5vh] w-[5vh] sm:h-[5vh] sm:w-[5vh] bg-black/50 hover:bg-black/70 border-0"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        )}
      </div>

      {/* Нижняя навигация*/}
      <div className="min-w-full py-2 sm:py-4 flex justify-center items-center bg-black/30">
        <div className="flex space-x-2 sm:space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-[1vh] h-[1vh] sm:w-[1vh] sm:h-[1vh] rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-green-500 scale-125"
                  : "bg-gray-600"
              }`}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
