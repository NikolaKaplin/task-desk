"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TutorialPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const totalSlides = 7;

  const tutorialSlides = [
    {
      title: "Добро пожаловать!",
      description:
        "Мы рады приветствовать вас на нашей платформе. Давайте познакомимся с основными функциями.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
    {
      title: "Ваш личный кабинет",
      description:
        "Здесь вы можете управлять своим профилем, настройками и отслеживать прогресс.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
    {
      title: "Поиск и фильтрация",
      description:
        "Используйте поисковую строку и фильтры для быстрого нахождения нужной информации.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
    {
      title: "Создание проектов",
      description:
        "Нажмите кнопку «Создать» для начала работы над новым проектом.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
    {
      title: "Совместная работа",
      description:
        "Приглашайте коллег и друзей для совместной работы над проектами.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
    {
      title: "Уведомления",
      description:
        "Следите за обновлениями и важными событиями через систему уведомлений.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
    {
      title: "Готово к работе!",
      description:
        "Теперь вы знаете основы работы с платформой. Нажмите «Завершить», чтобы начать.",
      image: "https://s13.stc.yc.kpcdn.net/share/i/12/13994165/wr-960.webp",
    },
  ];

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
    router.push("/");
  };

  // Обработка клавиш стрелок для навигации
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

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden relative">
      {/* Прогресс-бар */}
      <div className="w-full h-2 bg-gray-700">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4 md:px-8 overflow-hidden">
        <div className="absolute top-4 right-4 text-sm font-medium">
          {currentSlide + 1} / {totalSlides}
        </div>

        <div className="carousel-container w-full h-full flex items-center justify-center">
          {tutorialSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide absolute w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 transition-all duration-500 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0 z-10"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full z-0"
                  : "opacity-0 translate-x-full z-0"
              }`}
            >
              {/* Изображение */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Текст */}
              <div className="w-full md:w-1/2 flex flex-col items-start space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {slide.title}
                </h1>
                <p className="text-lg text-gray-300">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Навигация */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          disabled={currentSlide === 0 || isAnimating}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary scale-125" : "bg-gray-600"
              }`}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

        {currentSlide === totalSlides - 1 ? (
          <Button
            onClick={completeTutorial}
            className="rounded-full"
            disabled={isAnimating}
          >
            <Check className="h-5 w-5 mr-2" />
            Завершить
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={isAnimating}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
