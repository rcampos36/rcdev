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
            
            {/* Instagram Section */}
            <div className="mb-8">
              <p className="text-base font-normal text-gray-900 mb-2 font-big-shoulders">
                Instagram —
              </p>
              <a
                href="https://www.instagram.com/rcdev.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-gray-900 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-3xl font-bold font-big-shoulders">@rcdev.me</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
