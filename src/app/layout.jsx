import './globals.css';
import { AppProvider } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: 'NGO Management System',
  description: 'Full-stack NGO Beneficiary & Education Management Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
