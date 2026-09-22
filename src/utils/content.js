import { IMAGES } from './images'

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Programs', href: '#programs' },
  { label: 'Membership', href: '#membership' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'About', href: '#about' },
]

export const FOOTER_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Programs', href: '#programs' },
  { label: 'Membership', href: '#membership' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Contact', href: '#contact' },
]

export const DUMBBELL_CHAPTERS = [
  {
    index: '01',
    title: 'Enter',
    line: 'Every rep starts with a decision.',
    copy: 'Hand-machined steel, knurled for grip. Built to be picked up again and again.',
  },
  {
    index: '02',
    title: 'Focus',
    line: 'Lock in. Everything else fades.',
    copy: 'The noise drops away. It is you, the weight, and the next rep.',
  },
  {
    index: '03',
    title: 'Rotate',
    line: '360° of pure intent.',
    copy: 'Precision-balanced plates. Zero wobble. Every angle engineered.',
  },
  {
    index: '04',
    title: 'Move',
    line: 'Momentum is earned.',
    copy: 'Progress is never a straight line. But it is always forward.',
  },
  {
    index: '05',
    title: 'Flip',
    line: 'Turn resistance into fuel.',
    copy: 'What pushes against you is exactly what makes you stronger.',
  },
  {
    index: '06',
    title: 'Release',
    line: 'Rest. Recover. Return heavier.',
    copy: 'Growth happens between sessions. Come back ready for more.',
  },
]

export const PROGRAMS = [
  { title: 'Strength', tagline: 'Power. Control. Discipline.', image: IMAGES.strength, meta: '5×5 · Compound lifts', number: '01' },
  { title: 'Hypertrophy', tagline: 'Build. Grow. Repeat.', image: IMAGES.hypertrophy, meta: 'Volume · Tempo · Pump', number: '02' },
  { title: 'Conditioning', tagline: 'Push your limits.', image: IMAGES.conditioning, meta: 'HIIT · Engine · Grit', number: '03' },
  { title: 'Mobility', tagline: 'Move better. Perform better.', image: IMAGES.mobility, meta: 'Range · Recovery · Flow', number: '04' },
]

export const FEATURES = [
  'Unlimited Gym Access',
  'Personal Training',
  'Nutrition Guidance',
  'Workout Tracking',
  'Recovery Zone',
]

export const PLANS = [
  { name: 'Basic', level: '01', price: 999, blurb: 'The foundation. Train on your terms.', included: [true, false, false, true, false] },
  { name: 'Pro', level: '02', price: 1999, blurb: 'Coached progression for serious results.', included: [true, true, true, true, false], featured: true },
  { name: 'Elite', level: '03', price: 3999, blurb: 'Everything. No limits. No compromise.', included: [true, true, true, true, true] },
]

export const STATS = [
  { value: 12000, suffix: '+', label: 'Members' },
  { value: 85, suffix: '+', label: 'Trainers' },
  { value: 42, suffix: '', label: 'Weekly Classes' },
  { value: 98, suffix: '%', label: 'Member Satisfaction' },
]

// Sizes/offsets vary per frame to give the horizontal gallery an editorial rhythm.
export const GALLERY = [
  { image: IMAGES.lifting, title: 'Overhead Press', tag: 'Athlete', size: 'w-[70vw] sm:w-[48vw] lg:w-[28vw] h-[48svh] lg:h-[62vh]', rotate: -2.5, offset: 'self-start mt-[6svh]', depth: 1.2 },
  { image: IMAGES.equipment, title: 'The Rack', tag: 'Equipment', size: 'w-[80vw] sm:w-[60vw] lg:w-[38vw] h-[36svh] lg:h-[44vh]', rotate: 1.8, offset: 'self-end mb-[8svh]', depth: 0.7 },
  { image: IMAGES.training, title: 'Between Sets', tag: 'Training', size: 'w-[64vw] sm:w-[42vw] lg:w-[23vw] h-[46svh] lg:h-[56vh]', rotate: -1.2, offset: 'self-center', depth: 1.4 },
  { image: IMAGES.running, title: 'Stair Sprints', tag: 'Running', size: 'w-[72vw] sm:w-[50vw] lg:w-[28vw] h-[40svh] lg:h-[48vh]', rotate: 2.2, offset: 'self-start mt-[10svh]', depth: 0.9 },
  { image: IMAGES.boxing, title: 'Fight Night', tag: 'Boxing', size: 'w-[82vw] sm:w-[62vw] lg:w-[34vw] h-[48svh] lg:h-[64vh]', rotate: -1.8, offset: 'self-end mb-[5svh]', depth: 1.3 },
  { image: IMAGES.squat, title: 'Back Squat', tag: 'Strength', size: 'w-[68vw] sm:w-[46vw] lg:w-[26vw] h-[42svh] lg:h-[52vh]', rotate: 1.4, offset: 'self-center', depth: 0.8 },
]

export const TESTIMONIALS = [
  { quote: 'FIT UP completely changed the way I train.', name: 'Arjun Mehta', role: 'Member since 2022', result: '+42 kg deadlift', depth: 1 },
  { quote: 'Best training environment I’ve ever experienced.', name: 'Rahul Sharma', role: 'Elite member', result: '−11% body fat', depth: -0.7 },
  { quote: 'Discipline became part of my lifestyle.', name: 'Kunal Singh', role: 'Pro member', result: '312 sessions logged', depth: 1.4 },
]
