"use client";

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Observe the section for scroll-based animations
    if (!sectionRef.current) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionVisible(true);
          } else {
            setSectionVisible(false);
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

  return (
    <footer
      ref={sectionRef}
      className={`bg-white py-12 px-6 lg:px-8 transition-all duration-700 ease-out ${
        sectionVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-[1800px] mx-auto">
        {/* Top horizontal line */}
        <div className="mb-12">
          <div className="h-0.5 bg-gray-300"></div>
        </div>

        {/* Footer content */}
        <div className="grid md:grid-cols-3 gap-8 items-end">
          {/* Left: Name */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 font-big-shoulders uppercase tracking-tight">
              ROGER CAMPOS
            </h3>
          </div>

          {/* Center-Right: Freelancer info */}
          <div className="md:text-center md:col-start-2">
            <h4 className="text-xl font-bold text-gray-900 mb-2 font-big-shoulders uppercase tracking-tight">
              FREELANCER
            </h4>
            <p className="text-sm font-normal text-gray-600 font-big-shoulders">
              passionate about meaningful web projects —
            </p>
          </div>

          {/* Right: Copyright */}
          <div className="md:text-right">
            <p className="text-sm font-normal text-gray-600 font-big-shoulders">
              ©{new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
