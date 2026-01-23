"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Contact() {
  const [sectionVisible, setSectionVisible] = useState(false);
  const [animatedBorder, setAnimatedBorder] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

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



  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`pt-0 pb-20 px-6 lg:px-8 bg-white transition-all duration-700 ease-out ${
        sectionVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-[1800px] mx-auto">
        <h2 className="font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 font-big-shoulders tracking-tight uppercase relative py-2" style={{ fontSize: 'clamp(2rem, 8vw, 167px)' }}>
          CONTACT
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
            {/* Profile Picture */}
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden relative">
                <Image
                  src="/profile.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>
            
            {/* Designer Label */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-big-shoulders uppercase tracking-tight">
              Frontend/WordPress Developer
            </h3>
            
            {/* Passion Text */}
            <p className="text-base font-normal text-gray-900 font-big-shoulders">
              with a passion for creating —
            </p>
          </div>

          {/* Right Column */}
          <div>
            {/* Main Heading */}
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-big-shoulders leading-tight">
            Freelance frontend and WordPress developer who enjoys building quality web experiences and collaborating on new projects.
            </h3>
            
            {/* Description Text */}
            <p className="text-base font-normal text-gray-900 mb-12 font-big-shoulders uppercase tracking-tight">
              I DEVELOP RESPONSIVE WEBSITES AND APPS — FOCUSED ON UNDERSTANDING NEEDS AND COMMITTED TO EVERY NEW PROJECT.
            </p>
            
            {/* Email Section */}
            <div className="mb-8">
              <p className="text-base font-normal text-gray-900 mb-2 font-big-shoulders">
                E-mail —
              </p>
              <a
                href="mailto:hello@rogercampos.dev"
                className="text-3xl font-bold text-gray-900 font-big-shoulders hover:text-gray-600 transition-colors block"
              >
                info@rcdev.me 
              </a>
            </div>
            
            {/* Phone Section */}
            <div className="mb-8">
              <p className="text-base font-normal text-gray-900 mb-2 font-big-shoulders">
                Phone —
              </p>
              <a
                href="tel:804-855-7079"
                className="text-3xl font-bold text-gray-900 font-big-shoulders hover:text-gray-600 transition-colors block"
              >
                804-855-7079
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
