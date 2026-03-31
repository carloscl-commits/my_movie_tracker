# My Movie Tracker

A personal web application to manage your movie collection with search, ratings, filters, and theme customization.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

### 🎬 Movie Management
- **Search & Add**: Query TMDB API with debounced search (300ms)
- **View Details**: Click cards to see synopsis, year, genres
- **Rate Movies**: 1-5 star rating system
- **Track Status**: Mark as Unseen / Seen / Favorite
- **Delete**: Remove movies from collection with confirmation

### 🎨 Customization
- **Dark/Light Mode**: Toggle with persistent storage
- **Accent Colors**: 6 presets + custom color picker with hex input
- **Responsive Design**: Mobile, tablet, and desktop layouts

### 🔍 Filtering & Organization
- **Status Filters**: All, Favorites, Unseen, Seen
- **Genre Filters**: Filter by movie genre from TMDB
- **Movie Counter**: Shows filtered/total movie count
- **Collapsible Sidebar**: Save screen space with toggle button

### 🔐 Security
- **Authentication**: Username/password login with NextAuth
- **Protected Routes**: Middleware redirects unauthenticated users to login
- **Session Management**: Secure session handling

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules + CSS custom properties
- **Auth UI**: NextAuth with credentials provider

### Backend
- **Database**: SQLite with Prisma ORM
- **API**: Next.js API routes
- **Auth**: NextAuth.js with credentials provider
- **External API**: TMDB API for movie data

### Development
- **Build Tool**: Turbopack (Next.js 16)
- **Linting**: ESLint
- **Package Manager**: npm

## Installation

### Prerequisites
- Node.js 18+
- npm 8+

### Setup Steps

1. **Clone or download the repository**
   ```bash
   cd My_Movie_Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add:
   ```env
   # Database (already configured for SQLite)
   DATABASE_URL=file:./prisma/dev.db

   # Get from https://www.themoviedb.org/settings/api
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

   # Auth credentials (change in production!)
   AUTH_USERNAME=admin
   AUTH_PASSWORD=password

   # NextAuth configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key_change_this
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage Guide

### Login
- Navigate to `http://localhost:3000`
- Use default credentials:
  - **Username**: `admin`
  - **Password**: `password`
- Change these in `.env` for security

### Add Movies
1. Click **+ Add Movie** button in sidebar/gallery header
2. Search for a movie by title
3. Click result to add instantly (saved as "Unseen")

### View & Edit Movies
1. Click any movie card to open detail modal
2. **Edit Rating**: Click stars (1-5), or "Clear" to remove
3. **Change Status**: Click Unseen/Seen/Favorite buttons
4. **Delete**: Click "Delete Movie" button (with confirmation)

### Filter Gallery
1. Use **Status** filter: All, Favorites, Unseen, Seen
2. Use **Genre** filter: Select any genre
3. Filters combine (status AND genre)
4. Movie counter updates dynamically

### Customize Theme
1. Click **☀️/🌙** to toggle dark/light mode
2. Click color swatch to open color picker:
   - Click preset colors (6 options)
   - Use native color picker
   - Enter hex color manually (#RRGGBB)
3. Changes save instantly to database

### Sidebar
- Click **◀/▶** button to collapse/expand sidebar
- Saves more screen space on mobile
- All filters still accessible

## Project Structure

```
My_Movie_Tracker/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts      # NextAuth config
│   │   ├── movies/route.ts                  # GET/POST movies
│   │   ├── movies/[id]/route.ts             # GET/PUT/DELETE movie
│   │   ├── preferences/route.ts             # Theme/color storage
│   │   └── tmdb/
│   │       ├── search/route.ts              # TMDB search proxy
│   │       └── genres/route.ts              # TMDB genres list
│   ├── login/
│   │   ├── page.tsx                         # Login page
│   │   └── login.module.css                 # Login styles
│   ├── layout.tsx                           # Root layout
│   ├── page.tsx                             # Home/gallery
│   ├── page.module.css                      # Gallery styles
│   ├── globals.css                          # Global CSS + theme vars
│   └── providers.tsx                        # NextAuth SessionProvider
├── components/
│   ├── MovieSearch.tsx                      # Search input + dropdown
│   ├── MovieSearch.module.css
│   ├── AddMovieModal.tsx                    # Add movie dialog
│   ├── AddMovieModal.module.css
│   ├── MovieDetailModal.tsx                 # Edit/delete modal
│   ├── MovieDetailModal.module.css
│   ├── MovieSidebar.tsx                     # Filters + collapse
│   ├── MovieSidebar.module.css
│   ├── ThemeCustomizer.tsx                  # Theme toggle + color picker
│   └── ThemeCustomizer.module.css
├── lib/
│   ├── prisma.ts                            # Prisma client singleton
│   ├── useTheme.ts                          # Theme hook
│   └── useGenres.ts                         # Genres hook
├── prisma/
│   ├── schema.prisma                        # Database schema
│   ├── migrations/                          # Migration history
│   └── dev.db                               # SQLite database
├── middleware.ts                            # Route protection
├── .env                                     # Environment variables
├── .env.example                             # Template
├── .gitignore                               # Git ignore rules
├── tsconfig.json                            # TypeScript config
├── next.config.js                           # Next.js config
├── package.json                             # Dependencies
└── README.md                                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` — NextAuth callback

### Movies
- `GET /api/movies` — List all movies
- `POST /api/movies` — Create movie
- `GET /api/movies/[id]` — Get movie details
- `PUT /api/movies/[id]` — Update rating/status
- `DELETE /api/movies/[id]` — Delete movie

### User Preferences
- `GET /api/preferences` — Get theme/color settings
- `PUT /api/preferences` — Update theme/color

### TMDB Integration
- `GET /api/tmdb/search?q=query` — Search movies
- `GET /api/tmdb/genres` — Get all genres

## Database Schema

### Movie Table
| Column | Type | Notes |
|--------|------|-------|
| id | Int | Primary key |
| tmdbId | Int | TMDB API ID (unique) |
| title | String | Movie title |
| year | Int? | Release year |
| synopsis | String? | Movie description |
| posterUrl | String? | Poster image URL |
| genres | String? | JSON array of genre IDs |
| personalRating | Int? | User rating (1-5) |
| status | String | "unseen" / "seen" / "favorite" |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### UserPreferences Table
| Column | Type | Notes |
|--------|------|-------|
| id | Int | Always 1 (single row) |
| theme | String | "light" or "dark" |
| accentColor | String | Hex color (#RRGGBB) |
| updatedAt | DateTime | Last update timestamp |

## Environment Variables

### Required
```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_from_tmdb_org
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
NEXTAUTH_SECRET=random_string_min_32_chars
```

### Optional
```env
DATABASE_URL=file:./prisma/dev.db  # Default, modify for different location
NEXTAUTH_URL=http://localhost:3000  # Change for production
```

## Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Hooks & Utilities

#### useTheme
Manages dark/light mode and accent color persistence.
```typescript
const { theme, isLoading, updateTheme } = useTheme();
updateTheme({ theme: 'dark' });
updateTheme({ accentColor: '#ff0000' });
```

#### useGenres
Fetches and caches TMDB genres.
```typescript
const { genres, isLoading, getGenreNames } = useGenres();
const names = getGenreNames([28, 12]); // ['Action', 'Adventure']
```

## Theme & Styling

### CSS Custom Properties
```css
--accent-color      /* Primary button/link color */
--bg-primary        /* Main background */
--bg-secondary      /* Sidebar/component background */
--text-primary      /* Main text */
--text-secondary    /* Secondary text */
--border-color      /* Borders */
```

### Dark Mode
Toggled via `data-theme="dark"` attribute on `<html>` element.

### Color Scheme
- **Light**: White backgrounds, dark text
- **Dark**: Dark backgrounds (#1f2937), light text
- **Smooth transitions**: 0.3s ease on theme change

## Troubleshooting

### TMDB API Key Issues
- Get your API key from https://www.themoviedb.org/settings/api
- Ensure key is in `.env` as `NEXT_PUBLIC_TMDB_API_KEY`
- Restart dev server after adding key

### Database Errors
```bash
# Reset database
rm prisma/dev.db

# Reinitialize
npx prisma migrate dev
```

### Login Not Working
- Verify `.env` has `AUTH_USERNAME` and `AUTH_PASSWORD`
- Check `NEXTAUTH_SECRET` is set (min 32 chars recommended)
- Clear browser cookies and try again

### Movies Not Showing
- Ensure database is initialized: `npx prisma migrate dev`
- Check browser console for API errors
- Verify authentication by checking redirect to login

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Performance Optimizations

- **Debounced search**: 300ms delay reduces TMDB API calls
- **Optimistic UI**: Modal closes immediately, reloads in background
- **Selective re-renders**: Filters calculated only when changed
- **CSS modules**: Scoped styling prevents conflicts
- **Image optimization**: TMDB poster images cached by browser

## Security Notes

⚠️ **Production Deployment**:
- Change `AUTH_USERNAME` and `AUTH_PASSWORD`
- Generate strong `NEXTAUTH_SECRET` (min 32 chars)
- Use environment-specific `.env.production`
- Enable HTTPS (required for production cookies)
- Review TMDB API rate limits
- Consider adding additional auth methods

## Known Limitations

- Single user only (no multi-user support)
- No social/sharing features
- No offline support
- Movies stored locally only
- TMDB API subject to rate limits

## Future Enhancements

Potential features for future versions:
- [ ] Export/import movie collections
- [ ] Advanced search and sorting
- [ ] Movie statistics and charts
- [ ] Multi-user support
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] Watchlist with reminders
- [ ] Integration with streaming services

## Contributing

This is a personal project. Feel free to fork and customize for your needs!

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API endpoint documentation
3. Check browser console for errors
4. Verify environment configuration

## Credits

- **TMDB API**: Movie data and metadata
- **Next.js**: Framework and tooling
- **Prisma**: Database ORM
- **NextAuth.js**: Authentication

---

**Last Updated**: 2026-03-31
**Status**: Production Ready ✅
