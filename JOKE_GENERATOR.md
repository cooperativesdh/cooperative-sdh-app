# Random Joke Generator - Feature Addition

A simple joke generator feature using the Official Joke API to add entertainment to the Cooperative SDH app.

## 🎯 Overview

This feature adds a random joke generator to the dashboard for light-hearted breaks during work.

## 📦 Installation

### Backend - Add Joke Route

1. **Install axios** (if not already installed):
```bash
cd backend
npm install axios
```

2. **Create joke service** - `backend/src/services/joke.ts`:
```typescript
import axios from 'axios';

export async function getRandomJoke(): Promise<{ setup: string; punchline: string }> {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    return {
      setup: response.data.setup,
      punchline: response.data.punchline
    };
  } catch (error) {
    console.error('Error fetching joke:', error);
    throw new Error('Failed to fetch joke');
  }
}
```

3. **Add joke route** - `backend/src/routes/jokes.ts`:
```typescript
import express, { Response } from 'express';
import { getRandomJoke } from '../services/joke';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get random joke
router.get('/random', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const joke = await getRandomJoke();
    res.json(joke);
  } catch (error) {
    console.error('Error getting joke:', error);
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

export default router;
```

4. **Register route in `backend/src/index.ts`**:
```typescript
import jokeRoutes from './routes/jokes';

// Add this line with other routes
app.use('/api/jokes', jokeRoutes);
```

### Frontend - Add Joke Component

1. **Create Joke Widget** - `frontend/src/components/JokeWidget.tsx`:
```typescript
import React, { useState } from 'react';
import api from '../services/api';

interface Joke {
  setup: string;
  punchline: string;
}

const JokeWidget: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setShowPunchline(false);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/jokes/random', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoke(response.data);
    } catch (error) {
      console.error('Error fetching joke:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">😂 Blague du jour</h2>
      
      {joke && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-lg text-gray-700 mb-4">{joke.setup}</p>
          {showPunchline && (
            <p className="text-lg font-semibold text-blue-600">{joke.punchline}</p>
          )}
          {!showPunchline && (
            <button
              onClick={() => setShowPunchline(true)}
              className="text-blue-600 hover:text-blue-800 underline font-semibold"
            >
              Voir la chute...
            </button>
          )}
        </div>
      )}

      <button
        onClick={fetchJoke}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        {loading ? '⏳ Chargement...' : '🎲 Nouvelle blague'}
      </button>
    </div>
  );
};

export default JokeWidget;
```

2. **Add to Dashboard** - Update `frontend/src/pages/Dashboard.tsx`:
```typescript
import JokeWidget from '../components/JokeWidget';

// Add in the Dashboard component, after the welcome section:
<JokeWidget />
```

## 🔗 API Used

**Official Joke API** - Free, no authentication required
- Endpoint: `https://official-joke-api.appspot.com/random_joke`
- Returns: `{ id, type, setup, punchline, created_at }`
- Rate limit: Generous (suitable for testing)

### Alternative APIs

If you want more variety:

1. **JokeAPI.dev** (more languages/categories):
   ```
   https://v2.jokeapi.dev/joke/Any?safe-mode
   ```

2. **Rapid API** (requires key):
   ```
   https://www.rapidapi.com/KegenGuyll/api/dad-jokes/
   ```

## 🎨 Features

✅ Random joke display  
✅ Setup + Punchline reveal (suspense effect)  
✅ Beautiful UI with Tailwind CSS  
✅ Loading state  
✅ Error handling  
✅ Authenticated endpoint  

## 📱 Usage

1. Go to Dashboard
2. See the "Blague du jour" widget
3. Click "Nouvelle blague" to fetch a random joke
4. Click "Voir la chute..." to reveal the punchline
5. Repeat for more laughs!

## 🔒 Security Notes

- Endpoint is authenticated (requires JWT token)
- External API calls are wrapped in try-catch
- No data stored locally (stateless)
- Safe for production use

## 📊 Performance

- API response time: ~200-500ms
- No database queries
- Lightweight component
- Can be cached if needed

## 🚀 Future Enhancements

- [ ] Store favorite jokes in DB
- [ ] Filter by joke type/category
- [ ] Custom joke submissions
- [ ] Joke ratings (like/dislike)
- [ ] Daily joke of the day
- [ ] Multiple language support

---

**Enjoy your jokes while managing cooperatives!** 😄
