
import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiêu đề từ layuout',
  description: 'Mô tả từ layout',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>

  );
}
