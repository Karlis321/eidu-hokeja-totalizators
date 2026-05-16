import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EIDU Hokeja Totalizators',
  description: 'Ģimenes hokeja prognožu spēle',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lv">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
