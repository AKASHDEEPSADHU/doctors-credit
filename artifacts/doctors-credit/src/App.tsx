import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider';
import SiteHeader from '@/components/SiteHeader';
import WhatsAppFab from '@/components/WhatsAppFab';
import { whatsappEnabled, whatsappHref } from '@/lib/whatsapp';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const { t } = useLanguage();
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-teal sm:text-sm">
        {t.hero.label}
      </p>
      <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] text-brand-navy sm:text-5xl lg:text-6xl">
        {t.hero.before}
        <em className="not-italic text-brand-navy-mid">{t.hero.em}</em>
        {t.hero.after}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
        {t.hero.lede}
      </p>
      {whatsappEnabled ? (
        <a
          href={whatsappHref(t.whatsapp.greeting)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-12 items-center rounded-md bg-brand-navy px-6 text-sm font-medium text-white transition duration-200 hover:bg-brand-navy-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal active:scale-[0.98]"
        >
          {t.hero.cta}
        </a>
      ) : null}
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <div id="top" className="min-h-screen bg-brand-paper text-brand-ink">
            <SiteHeader />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <WhatsAppFab />
          </div>
        </LanguageProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
