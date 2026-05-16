import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EIDU ģimenes hokeja totalizators',
  description: 'Pasaules hokeja čempionāta totalizators ar punktu skaitīšanu',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lv">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
