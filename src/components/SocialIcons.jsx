// Brand glyphs as inline SVG (lucide-react v1 no longer ships brand icons).
const ICONS = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  Facebook: <path d="M14 21v-7h2.4l.4-3H14V9.1c0-.9.24-1.5 1.6-1.5H17V5.2C16.7 5.15 15.9 5 14.9 5c-2.1 0-3.5 1.28-3.5 3.63V11H9v3h2.4v7z" fill="currentColor" stroke="none" />,
  Call: <path d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.25-.25.6-.32.92-.2 1 .33 2.1.5 3.2.5.5 0 .9.4.9.9V19c0 .5-.4.9-.9.9C10.6 19.9 4.1 13.4 4.1 5.3c0-.5.4-.9.9-.9H8c.5 0 .9.4.9.9 0 1.1.17 2.2.5 3.2.1.32.02.67-.22.92z" fill="currentColor" stroke="none" />,
}

const LINKS = {
  Instagram: 'https://www.instagram.com/fitup_fitnesslifestyle/',
  Facebook: 'https://www.facebook.com/Fit-Up-Fitness-Lifestyle-107',
  Call: 'tel:+919571995817',
}

export default function SocialIcons({ className = '' }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {Object.entries(ICONS).map(([name, glyph]) => (
        <li key={name}>
          <a
            href={LINKS[name]}
            target={LINKS[name].startsWith('http') ? '_blank' : undefined}
            rel={LINKS[name].startsWith('http') ? 'noreferrer' : undefined}
            aria-label={name}
            data-cursor="button"
            className="group grid h-11 w-11 place-items-center rounded-full border border-line text-fg transition-[background-color,color,border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
            >
              {glyph}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
