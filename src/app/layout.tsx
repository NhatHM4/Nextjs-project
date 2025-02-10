import NextAuthWrapper from '@/app/lib/next.auth.provider';
import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
const DRAWER_WIDTH = 240;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper>
            <AppHeader />
            {children}
            <AppFooter />
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
