"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Projects() {
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);
  const [animatedBorder, setAnimatedBorder] = useState(false);
  const [mounted, setMounted] = useState(false);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true);
  }, []);

  useEffect(() => {
    const observers = projectRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleProjects((prev) => {
                if (!prev.includes(index)) {
                  return [...prev, index];
                }
                return prev;
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

  useEffect(() => {
    // Animate border on page load (only after mount)
    if (!mounted) return;
    
    // Small delay to ensure hydration is complete, then animate the border
    const timeout = setTimeout(() => {
      setAnimatedBorder(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [mounted]);

  const projects = [
    {
      title: "More Vang",
      date: "04 / 2021",
      tags: ["WordPress", "Responsive"],
      description: "We create valuable consumer experiences —",
      imageUrl: "/images/MV_HERO.jpg",
      url: "https://morevang.com/",
    },
    {
      title: "Mythos",
      date: "03 / 2022",
      tags: ["WordPress", "Responsive"],
      description: "Every gift creates a story —",
      imageUrl: "/images/mythos.jpg",
      url: "https://www.mythosplatform.com/",
    },
    {
      title: "Why We lift",
      date: "02 / 2022",
      tags: ["WordPress", "Responsive"],
      description: "ALL FAMILIES DESERVE A BETTER FUTURE —",
      imageUrl: "/images/Mariela-Banner.jpg",
      url: "https://whywelift.org/",
    },
    {
      title: "CCSS0",
      date: "01 / 2018",
      tags: ["Dupal 8 Theme", "Responsive"],
      description: "States Are Leading to Deliver a High-Quality Education to Each and Every Child —",
      imageUrl: "/images/ccsso_0.png",
      url: "https://ccsso.org/",
    },
    {
      title: "Entrepreneurs' Organization",
      date: "12 / 2023",
      tags: ["Umbraco CMS", "Responsive"],
      description: "Find your place among the world’s leaders —",
      imageUrl: "/images/2024-GSEA.png",
      url: "https://eonetwork.org/",
    },
    {
      title: "Rebuild Rural",
      date: "11 / 2021",
      tags: ["Drupal 8 Theme", "Responsive"],
      description: "The Rebuild Rural Infrastructure Coalition —",
      imageUrl: "/images/rebuild-rural.png",
      url: "https://rebuildrural.com/",
    },
    {
      title: "Farm Credit",
      date: "09 / 2018",
      tags: ["Drupal 8 Theme", "Responsive"],
      description: "Supporting rural communities and agriculture with reliable, consistent credit and financial services —",
      imageUrl: "/images/farmcredit_0.png",
      url: "https://farmcredit.com/",
    },
    {
      title: "Camposville Farm",
      date: "09 / 2025",
      tags: ["React JS", "Responsive"],
      description: "Choose the best healthier way of life —",
      imageUrl: "/images/Banner.jpg",
      url: "https://camposville.vercel.app/",
    },
    {
      title: "Lenca Luxury Restaurant",
      date: "01 / 2025",
      tags: ["Nextjs", "Responsive", "Hospitality"],
      description: "Elegant fine dining and cocktail experience —",
      imageUrl: "/images/luxury-restaurant.png",
      url: "https://lenca.vercel.app/",
    },
    {
      title: "Ikal a Seafood Restaurant",
      date: "02 / 2025",
      tags: ["WordPress", "Responsive", "Hospitality"],
      description: "Elegant fine seafood dining and cocktail experience —",
      imageUrl: "/images/seafood-restaurant.jpg",
      url: "https://lightgrey-walrus-352425.hostingersite.com/",
    },
  ];

  return (
    <section
      id="projects"
      className="pt-[124px] sm:pt-[156px] md:pt-[188px] pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-[1800px] mx-auto">
        <h2 className="font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 font-big-shoulders tracking-tight uppercase relative py-2" style={{ fontSize: 'clamp(2rem, 8vw, 167px)' }}>
          Projects
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
        <div className="mb-16 sm:mb-24 md:mb-32 grid md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-big-shoulders uppercase tracking-tight">FRONTEND/WORDPRESS DEVELOPER</h3>
            <p className="text-sm sm:text-base font-normal text-gray-900 font-big-shoulders">check out the latest projects —</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-big-shoulders leading-tight">Freelance developer focused on purposeful design and impactful web projects. —</p>
            <p className="text-xs sm:text-sm md:text-base font-normal text-gray-600 font-big-shoulders uppercase">I HELP BRANDS AND INDIVIDUALS STAND OUT WITH TAILORED DESIGN AND CREATIVE SOLUTIONS — </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20" style={{ columnGap: 'clamp(20px, 4vw, 30px)', rowGap: 'clamp(40px, 8vw, 80px)' }}>
          {projects.map((project, index) => (
            <div
              key={index}
              ref={(el) => {
                projectRefs.current[index] = el;
              }}
              className={`transition-all duration-800 ease-out group cursor-pointer ${
                visibleProjects.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              onClick={() => {
                if (project.url) {
                  window.open(project.url, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {/* Image Card */}
              <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg mb-4 sm:mb-5 md:mb-6">
                <div className="bg-stone-50 rounded-lg overflow-hidden relative h-48 sm:h-64 md:h-80 lg:h-96">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 2}
                  />
                </div>
              </div>

              {/* Content Below Card */}
              <div style={{ fontFamily: 'Archivo, sans-serif' }}>
                {/* Title and Date */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="font-normal text-gray-900 tracking-tight uppercase relative inline-block text-lg sm:text-xl md:text-2xl lg:text-[28px]">
                    {project.title}
                    <span className="absolute bottom-0 left-0 h-0.5 bg-gray-900 w-0 transition-all duration-700 group-hover:w-full"></span>
                  </h3>
                  <div className="text-gray-600 text-xs sm:text-[12px]">
                    {project.date}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gray-100 text-gray-900 rounded-full uppercase text-[10px] sm:text-xs md:text-[12px] px-2 py-1 sm:px-3 sm:py-1.5 md:px-3 md:py-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-900 uppercase text-[10px] sm:text-xs md:text-[12px] leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
