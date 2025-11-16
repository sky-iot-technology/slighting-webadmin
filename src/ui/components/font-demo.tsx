import { fontPrimary, fontSecondary } from '@/lib/font';

export default function FontDemo() {
  return (
    <div className='space-y-6 p-8'>
      <h1 className={`text-4xl font-bold ${fontPrimary.className}`}>
        Nunito - Primary Font
      </h1>

      <p className={`text-lg ${fontSecondary.className}`}>
        This text uses Manrope as the secondary font. It&apos;s perfect for body
        text, descriptions, and secondary content that needs to be easily
        readable.
      </p>

      <div className='space-y-4'>
        <h2 className={`text-2xl font-semibold ${fontPrimary.className}`}>
          Heading with Nunito
        </h2>

        <p className={`${fontSecondary.className}`}>
          Body text with Manrope provides excellent readability for longer
          content. The combination of Nunito for headings and Manrope for body
          text creates a beautiful typographic hierarchy.
        </p>

        <h3 className={`text-xl font-medium ${fontPrimary.className}`}>
          Subheading with Nunito
        </h3>

        <p className={`${fontSecondary.className}`}>
          You can use the font classes directly in your components:
          <br />• <code>fontPrimary.className</code> for Nunito
          <br />• <code>fontSecondary.className</code> for Manrope
          <br />• <code>font-secondary</code> CSS class for Manrope
        </p>
      </div>
    </div>
  );
}
