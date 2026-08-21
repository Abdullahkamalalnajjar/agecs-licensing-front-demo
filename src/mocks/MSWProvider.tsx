'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { worker } = await import('@/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn on Next.js internal requests
      });
      setMswReady(true);
    };

    if (!mswReady) {
      init();
    }
  }, [mswReady]);

  if (!mswReady) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
