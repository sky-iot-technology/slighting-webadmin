import { Nunito, Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';

// Primary font for headings and main content
const fontPrimary = Nunito({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  preload: true,
});

// Secondary font for body text and UI elements
const fontSecondary = Manrope({
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
  preload: true,
});

// Export font variables for use in CSS
export const fontVariables = cn(
  fontPrimary.variable,
  fontSecondary.variable
);

// Export individual font objects for specific use cases
export { fontPrimary, fontSecondary };
