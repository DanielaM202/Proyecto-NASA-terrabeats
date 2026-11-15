import {
  Cog,
  Headphones,
  Keyboard,
  ListMusic,
  Orbit,
  Play,
  Radio,
  Satellite,
  Square,
  Trees,
  Volume2,
  Waves,
  Wind,
  Zap,
  MoonStar,
  Activity,
  Users,
} from 'lucide-react';

// Decorative lucide icons, hidden from screen readers: every button and heading keeps its text.
const MAP = {
  help: Volume2,
  stop: Square,
  play: Play,
  story: Headphones,
  legend: Headphones,
  shortcuts: Keyboard,
  playlist: ListMusic,
  how: Cog,
  live: Activity,
  player: Radio,
  tracks: Satellite,
  orbit: Orbit,
  team: Users,
  'forest-height': Trees,
  ocean: Waves,
  'night-lights': MoonStar,
  lightning: Zap,
  co2: Wind,
};

export default function Glyph({ name, className = 'h-5 w-5', ...rest }) {
  const C = MAP[name];
  if (!C) return null;
  return <C className={className} aria-hidden="true" focusable="false" strokeWidth={1.75} {...rest} />;
}
