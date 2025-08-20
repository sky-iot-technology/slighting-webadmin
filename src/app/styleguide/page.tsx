import { Metadata } from 'next';
import { StyleguidePage } from '@/features/styleguide/styleguide-page';

export const metadata: Metadata = {
  title: 'Styleguide - UI Components',
  description: 'Complete showcase of all available UI components and their usage examples',
};

export default function StyleguidePageRoute() {
  return <StyleguidePage />;
}
