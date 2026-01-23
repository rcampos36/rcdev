export default function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-gray-900">
          About Me
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              I&apos;m a passionate developer with a love for creating beautiful,
              functional, and user-friendly applications. With expertise in
              modern web technologies, I bring ideas to life through clean code
              and thoughtful design.
            </p>
            <p>
              My journey in development has been driven by curiosity and a
              constant desire to learn and improve. I enjoy tackling complex
              problems and turning them into elegant solutions.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies,
              contributing to open-source projects, or sharing knowledge with
              the developer community.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                What I Do
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">▹</span>
                  <span>Full-stack web development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">▹</span>
                  <span>UI/UX design and implementation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">▹</span>
                  <span>Mobile app development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">▹</span>
                  <span>API design and development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-bold">▹</span>
                  <span>Performance optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
