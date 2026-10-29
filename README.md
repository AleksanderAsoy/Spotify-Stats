# My React Website

A modern, responsive React website built with Vite.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Header.jsx      # Navigation header
│   └── Footer.jsx      # Site footer
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── About.jsx       # About page
│   └── Contact.jsx     # Contact page
├── styles/             # CSS styles
│   └── main.css        # Main stylesheet
├── assets/             # Static assets
│   └── images/         # Image files
├── utils/              # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## Features

- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern React**: Uses React 19 with hooks and functional components
- **Fast Development**: Built with Vite for instant hot module replacement
- **Clean Architecture**: Organized folder structure for scalability
- **Accessibility**: Semantic HTML and ARIA labels
- **Modern CSS**: Custom properties, transitions, and animations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the page to the switch statement in `App.jsx`
3. Add navigation link in `Header.jsx`

### Styling
- Main styles are in `src/styles/main.css`
- Uses CSS custom properties for easy theming
- Responsive breakpoints: 768px and 480px

### Components
- All components are functional components using React hooks
- Props are passed down from App.jsx for state management
- Components are designed to be reusable and modular

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **ESLint** - Code linting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Local browser
 - http://127.0.0.1:5173
