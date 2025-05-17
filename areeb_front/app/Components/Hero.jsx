'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import conferenceEvent from "../../public/conference.jpg"; // صورة المؤتمر
import celebrationEvent from "../../public/celebration.jpg"; // صورة الاحتفال
import concertEvent from "../../public/concert.jpg"; // صورة الحفل الموسيقي
import exhibitionEvent from "../../public/exhibition.jpg"; // صورة المعرض

export default function Hero() {
  const events = [
    {
      image: conferenceEvent,
      title: "المنتديات والمؤتمرات العالمية",
      description: "نقدم منصة عالمية للحوار وتبادل الخبرات، حيث يلتقي صناع القرار وقادة الفكر لمناقشة أهم القضايا العالمية وصياغة مستقبل أفضل",
      category: "منتديات ومؤتمرات",
      features: [
        "جلسات حوارية تفاعلية",
        "متحدثون عالميون",
        "ورش عمل متخصصة"
      ],
      location: "قاعات المؤتمرات الكبرى"
    },
    {
      image: celebrationEvent,
      title: "الحفلات والمناسبات الخاصة",
      description: "نصمم ونقدم تجارب احتفالية استثنائية تجمع بين الفخامة والإبداع. من حفلات التكريم إلى المناسبات الخاصة، نضمن تجربة لا تُنسى",
      category: "حفلات ومناسبات",
      features: [
        "تنظيم شامل للفعاليات",
        "تجهيزات صوتية وبصرية",
        "خدمات ضيافة راقية"
      ],
      location: "قاعات الاحتفالات المميزة"
    },
    {
      image: concertEvent,
      title: "الفعاليات الفنية والثقافية",
      description: "نقدم باقة متنوعة من العروض الفنية والثقافية التي تثري المشهد الفني وتحتفي بالإبداع في كافة أشكاله",
      category: "فنون وثقافة",
      features: [
        "عروض موسيقية حية",
        "أمسيات شعرية",
        "عروض مسرحية"
      ],
      location: "المسارح والقاعات الفنية"
    },
    {
      image: exhibitionEvent,
      title: "المعارض والفعاليات التجارية",
      description: "نوفر مساحات عرض احترافية ومتكاملة للشركات والعلامات التجارية، مع خدمات تنظيمية شاملة تضمن نجاح المعرض وتحقيق أهدافه",
      category: "معارض",
      features: [
        "منصات عرض احترافية",
        "خدمات تسويقية متكاملة",
        "دعم تقني وفني"
      ],
      location: "مراكز المعارض الدولية"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <div className="relative h-[85vh] overflow-hidden">
      {/* Slides */}
      {events.map((event, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image with stronger overlay */}
          <div className="relative w-full h-full">
            <Image
              src={event.image}
              alt={event.title}
              className="object-cover"
              fill
              priority={index === 0}
            />
            {/* Darker gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          </div>

          {/* Content - Centered with larger text */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6 mb-10">
                {/* Category Badge */}
                <span className="inline-block bg-sky-600 text-white px-6 py-2 rounded-lg text-xl font-semibold mb-4">
                  {event.category}
                </span>

                {/* Title - Larger and more prominent */}
                <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  {event.title}
                </h2>

                {/* Description - Clearer and more readable */}
                <p className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl mx-auto">
                  {event.description}
                </p>

                {/* Features with better spacing */}
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  {event.features.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Location with icon */}
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xl">{event.location}</span>
                </div>

                {/* CTA Button - Larger and more prominent */}
                <button className="mt-8 bg-sky-600 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  تواصل معنا
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Made larger and more visible */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators - Made more visible */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-12 bg-sky-500" : "w-3 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
