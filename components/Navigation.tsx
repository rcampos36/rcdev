"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Calculate scrollbar width
      const width = window.innerWidth - document.documentElement.clientWidth;
      setScrollbarWidth(width);
      // Prevent body scroll when modal is open and preserve scrollbar space
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${width}px`;
      // Trigger animation after modal is mounted
      setTimeout(() => setIsModalVisible(true), 10);
    } else {
      setIsModalVisible(false);
      setScrollbarWidth(0);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = 'unset';
    }
    
    return () => {
      // Cleanup: restore body scroll on unmount
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#projects", label: "Projects" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-6 pb-6 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white"
        }`}
        style={{ paddingRight: isMobileMenuOpen ? `${scrollbarWidth}px` : '0' }}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a
              href="#home"
              className="flex flex-col leading-none"
              style={{ fontFamily: 'Archivo, sans-serif' }}
            >
              <span className="font-normal text-gray-900 tracking-tight" style={{ fontSize: '37px' }}>Roger</span>
              <span className="font-normal text-gray-900 tracking-tight" style={{ fontSize: '37px' }}>Campos</span>
            </a>

            {/* Hamburger Menu Button */}
            <button
              className="group rounded-full bg-black flex items-center justify-center hover:bg-orange-500 transition-all duration-300"
              style={{ width: '64px', height: '64px', flexShrink: 0 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span className="absolute w-6 h-0.5 bg-white -translate-y-1 transition-all duration-300"></span>
                <span className="absolute w-6 h-0.5 bg-white translate-y-1 transition-all duration-300"></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu Modal */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-0 bg-black z-[100] flex flex-col overflow-y-auto transition-all duration-500 ease-out ${
          isModalVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Close Button */}
          <div className="absolute right-0 z-[101] w-full" style={{ top: '60px' }}>
            <div className="max-w-[1800px] mx-auto px-6 lg:px-8 flex justify-end" style={{ paddingBottom: '60px' }}>
              <button
                className={`group w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-orange-500 transition-all duration-300 ${
                  isModalVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-0'
                }`}
                style={{
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                  transitionDelay: '0.2s'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span className="absolute w-6 h-0.5 bg-black group-hover:bg-white rotate-45 transition-all duration-300"></span>
                  <span className="absolute w-6 h-0.5 bg-black group-hover:bg-white -rotate-45 transition-all duration-300"></span>
                </div>
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute left-0 right-0 z-[101] w-full" style={{ top: '60px' }}>
            <div className="max-w-[1800px] mx-auto px-6 lg:px-8" style={{ paddingBottom: '60px' }}>
              <a
                href="#home"
                className={`flex flex-col leading-none ${
                  isModalVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  fontFamily: 'Archivo, sans-serif',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                  transitionDelay: '0.2s'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-normal text-white tracking-tight" style={{ fontSize: '37px' }}>Roger</span>
                <span className="font-normal text-white tracking-tight" style={{ fontSize: '37px' }}>Campos</span>
              </a>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col w-full" style={{ paddingTop: '240px' }}>
            <div className="max-w-[1800px] mx-auto w-full px-6 lg:px-8 space-y-8 group/menu">
              {navLinks.map((link, index) => (
                <div 
                  key={link.href} 
                  className="relative transition-opacity duration-500 group/item"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: isModalVisible ? 1 : 0 
                  }}
                >
                  {/* Top border - for Home, Projects, and Services */}
                  {(index === 0 || index === 1 || index === 2) && (
                    <div className="mb-4 transition-opacity duration-200 group-hover/menu:opacity-50 group-hover/item:!opacity-100">
                      <div className="h-px bg-white"></div>
                    </div>
                  )}
                  <a
                    href={link.href}
                    className="block text-white transition-all duration-200 font-big-shoulders font-bold uppercase group-hover/menu:opacity-50 group-hover/item:!opacity-100"
                    style={{ fontSize: 'clamp(3rem, 8vw, 186px)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                  {/* Bottom border - for Services and Contact */}
                  {(index === 2 || index === 3) && (
                    <div className="mt-4 transition-opacity duration-200 group-hover/menu:opacity-50 group-hover/item:!opacity-100">
                      <div className="h-px bg-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full pb-12">
            <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
              {/* Top horizontal line */}
              <div className="mb-12">
                <div className="h-0.5 bg-white"></div>
              </div>

              {/* Footer content */}
              <div className="grid md:grid-cols-3 gap-8 items-end">
                {/* Left: Name */}
                <div>
                  <h3 className="text-2xl font-bold text-white font-big-shoulders uppercase tracking-tight">
                    ROGER CAMPOS
                  </h3>
                </div>

                {/* Center-Right: Freelancer info */}
                <div className="md:text-center md:col-start-2">
                  <h4 className="text-xl font-bold text-white mb-2 font-big-shoulders uppercase tracking-tight">
                    FREELANCER
                  </h4>
                  <p className="text-sm font-normal text-gray-300 font-big-shoulders">
                    passionate about meaningful web projects —
                  </p>
                </div>

                {/* Right: Copyright */}
                <div className="md:text-right">
                  <p className="text-sm font-normal text-gray-300 font-big-shoulders">
                    ©{new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
