# Developer Portfolio

A modern, responsive Next.js portfolio website showcasing projects, skills, and contact information.

## Features

- 🎨 Modern and beautiful UI with gradient effects
- 📱 Fully responsive design
- ⚡ Built with Next.js 14 and TypeScript
- 🎯 Smooth scrolling navigation
- 🌙 Dark theme optimized
- 🚀 Fast and performant

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

1. **Update Personal Information**: Edit the components in the `components/` directory to add your own information:
   - `Hero.tsx` - Update the hero section with your name and tagline
   - `About.tsx` - Add your personal story and what you do
   - `Skills.tsx` - Update with your actual skills
   - `Projects.tsx` - Replace with your real projects
   - `Contact.tsx` - Add your contact information and social links

2. **Styling**: The project uses Tailwind CSS. You can customize colors and styles in:
   - `tailwind.config.ts` - Theme configuration
   - `app/globals.css` - Global styles

3. **Add Your Projects**: Update the projects array in `components/Projects.tsx` with your actual projects, including links to live demos and source code.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Navigation.tsx   # Navigation bar
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Skills.tsx       # Skills section
│   ├── Projects.tsx     # Projects section
│   ├── Contact.tsx      # Contact section
│   └── Footer.tsx       # Footer
└── package.json
```

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- PostCSS
- Autoprefixer

## License

This project is open source and available under the MIT License.
