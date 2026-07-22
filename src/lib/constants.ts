export const COMPETITION_NAME = 'Swift Scholars Maths Olympiad';
export const SCHOOL_NAME = 'Seat of Wisdom Montessori School, Ibadan';
export const SCHOOL_TAGLINE = 'Education The Best Legacy';
export const COMPETITION_SUBTITLE = 'Where Young Minds Calculate, Compete, and Conquer!';
export const COMPETITION_FOOTER = 'Let the Battle of Numbers Begin!';
export const COMPETITION_BOTTOM_LINES = [
  'Building Future Mathematicians, Problem Solvers, and Innovators.',
  'Excellence in Mathematics Today, Leaders Tomorrow!',
  'Think. Solve. Achieve. Be a Swift Scholar!',
];

export const CATEGORY_CONFIG: Record<
  string,
  {
    classLabel: string;
    color: string;
    mathSymbol: string;
    icon: string;
  }
> = {
  'Number Sprouts': {
    classLabel: 'Sprout 2',
    color: '#2ecc71',
    mathSymbol: '∑',
    icon: '🌱',
  },
  'Counting Champions': {
    classLabel: 'Sprout 3',
    color: '#e67e22',
    mathSymbol: 'π',
    icon: '🏆',
  },
  'Math Explorers': {
    classLabel: 'Stepping Stone',
    color: '#1abc9c',
    mathSymbol: '√',
    icon: '🔍',
  },
  'Number Navigators': {
    classLabel: 'Grade 1',
    color: '#3498db',
    mathSymbol: '÷',
    icon: '⚙️',
  },
  'Equation Builders': {
    classLabel: 'Grade 2',
    color: '#9b59b6',
    mathSymbol: '×',
    icon: '🧱',
  },
  'Logic Leaders': {
    classLabel: 'Grade 3',
    color: '#27ae60',
    mathSymbol: '=',
    icon: '💡',
  },
  'Problem Solvers': {
    classLabel: 'Grade 4',
    color: '#e74c3c',
    mathSymbol: '%',
    icon: '🧩',
  },
  'Math Mavericks': {
    classLabel: 'Grade 5',
    color: '#2980b9',
    mathSymbol: '²',
    icon: '⭐',
  },
  'Junior Analysts': {
    classLabel: 'JSS 1',
    color: '#8e44ad',
    mathSymbol: '∞',
    icon: '📊',
  },
  'Algebra Masters': {
    classLabel: 'JSS 2',
    color: '#16a085',
    mathSymbol: 'Σ',
    icon: '∑',
  },
  'Olympiad Challengers': {
    classLabel: 'JSS 3',
    color: '#d35400',
    mathSymbol: '∫',
    icon: '🥇',
  },
  'Elite Mathematicians': {
    classLabel: 'SS1',
    color: '#1a5276',
    mathSymbol: 'θ',
    icon: '🎓',
  },
  'Math Titans': {
    classLabel: 'SS2',
    color: '#6c3483',
    mathSymbol: 'Δ',
    icon: '👑',
  },
  'Grand Olympians': {
    classLabel: 'SS3',
    color: '#922b21',
    mathSymbol: 'Ω',
    icon: '🏅',
  },
};

export const MATH_BG_SYMBOLS = [
  'π',
  '∑',
  '√x',
  'a²+b²=c²',
  '÷',
  '×',
  '=',
  '%',
  '∞',
  'θ',
  'Δ',
  'Ω',
  '∫',
  'Σ',
  '123',
  '9',
];

// Difficulty levels repurposed for Maths Olympiad
export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Foundation',
  moderate: 'Intermediate',
  hard: 'Advanced',
  champion: 'Olympiad',
};

// API Configuration Constants
export const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  default: { windowMs: 60 * 1000, maxRequests: 100 },
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  upload: { windowMs: 60 * 1000, maxRequests: 10 },
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

// Admin authentication
export const ADMIN_SESSION_KEY = 'adminAuth';

// UI Configuration
export const TOAST_DURATION = 3000; // milliseconds
