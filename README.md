# AppScuola

A modern Progressive Web App (PWA) for students with advanced learning features.

## Features

- **Notes Management**: Create, edit, and organize study notes
- **Flashcards**: Create and study with digital flashcards
- **Tasks**: Manage homework and assignments
- **Calendar**: Track important dates and deadlines
- **AI Assistant**: Get help with your studies through AI
- **Progressive Web App**: Install on any device for offline use
- **AR/VR Support**: Enhanced learning through augmented and virtual reality

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- Dexie.js (IndexedDB)
- OpenAI API
- Next-PWA

## Development

1. Clone the repository:
```
git clone https://github.com/ajdohaxhia/appscuola.git
cd appscuola
```

2. Install dependencies:
```
npm install
```

3. Create a `.env.local` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```
npm run dev
```

5. Build for production:
```
npm run build
```

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file includes all necessary configurations.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ajdohaxhia/appscuola)

## License

MIT 