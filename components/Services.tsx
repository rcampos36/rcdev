"use client";

import { useEffect, useRef, useState } from "react";

export default function Services() {
  const [visibleServices, setVisibleServices] = useState<number[]>([]);
  const [animatedBorder, setAnimatedBorder] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Observe the section for scroll-based animations
    if (!sectionRef.current) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionVisible(true);
            setAnimatedBorder(true);
          } else {
            setSectionVisible(false);
            setAnimatedBorder(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    sectionObserver.observe(sectionRef.current);

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const observers = serviceRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleServices((prev) => {
                if (!prev.includes(index)) {
                  return [...prev, index];
                }
                return prev;
              });
            } else {
              setVisibleServices((prev) => {
                return prev.filter((i) => i !== index);
              });
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => {
        if (observer) observer.disconnect();
      });
    };
  }, []);

  const services = [
    {
      title: "FRONTEND DEVELOPMENT",
      number: "01",
      description: "Front-end interfaces built from scratch \nResponsive layouts and accessibility \nUser experience best practices \nPerformance-friendly animations.",
    },
    {
      title: "WORDPRESS DEVELOPMENT",
      number: "02",
      description: "Brand-driven WordPress solutions \nCohesive, scalable digital experiences \nVisual direction and layout systems \nConsistent styling across your site.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`pt-32 pb-0 px-6 lg:px-8 bg-white transition-all duration-700 ease-out ${
        sectionVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-[1800px] mx-auto">
        <h2 className="font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 font-big-shoulders tracking-tight uppercase relative py-2" style={{ fontSize: 'clamp(2rem, 8vw, 167px)' }}>
          SERVICES
          <span 
            suppressHydrationWarning
            className="absolute top-0 left-1/2 h-0.5 bg-gray-300"
            style={{
              width: '100%',
              transform: animatedBorder 
                ? 'translateX(-50%) scaleX(1)' 
                : 'translateX(-50%) scaleX(0)',
              transformOrigin: 'center',
              transition: 'transform 0.7s ease-out'
            }}
          ></span>
          <span 
            suppressHydrationWarning
            className="absolute bottom-0 left-1/2 h-0.5 bg-gray-300"
            style={{
              width: '100%',
              transform: animatedBorder 
                ? 'translateX(-50%) scaleX(1)' 
                : 'translateX(-50%) scaleX(0)',
              transformOrigin: 'center',
              transition: 'transform 0.7s ease-out'
            }}
          ></span>
        </h2>

        {/* Two column layout */}
        <div className="mb-32 grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-big-shoulders uppercase tracking-tight">
              Open to new challenges in two core areas of specialization. —
            </h3>
            <p className="text-base font-normal text-gray-400 font-big-shoulders uppercase mb-8">
              Let&apos;s work together to create something exceptional for your business. —
            </p>
            <button className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-big-shoulders uppercase tracking-tight text-sm font-semibold hover:bg-gray-300 transition-colors">
              CURRENTLY AVAILABLE
            </button>
          </div>

          {/* Right Column - Services List */}
          <div>
            {services.map((service, index) => (
              <div
                key={index}
                ref={(el) => {
                  serviceRefs.current[index] = el;
                }}
                className={`mb-12 pb-12 transition-all duration-700 ease-out ${
                  index === 0 ? "border-b border-gray-200" : ""
                } ${
                  visibleServices.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3 font-big-shoulders uppercase tracking-tight">
                      {service.title}
                    </h4>
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-normal text-gray-900 font-big-shoulders">
                        [{service.number}]
                      </span>
                      <p className="text-lg font-normal text-gray-600 font-big-shoulders flex-1 whitespace-pre-line">
                        {service.description}
                      </p>
                      <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors flex-shrink-0">
                        <span className="text-2xl font-light">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
