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

// Decorative icons (lucide, line style). They never carry meaning on their own:
// every button and heading keeps its text, so they are hidden from screen readers.
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
