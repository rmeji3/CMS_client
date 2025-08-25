// Utilities for handling anti-forgery/XSRF tokens in the client

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const cookies = document.cookie?.split('; ') ?? [];
  const match = cookies.find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : undefined;
}

// Try common ASP.NET Core antiforgery cookie names
export function getAntiForgeryTokenFromCookies(): string | undefined {
  // Most common when configured for SPAs
  const xsrf = readCookie('XSRF-TOKEN');
  if (xsrf) return xsrf;

  // Some setups use this name
  const rvt = readCookie('RequestVerificationToken');
  if (rvt) return rvt;

  // Default ASP.NET Core cookie name is random starting with ".AspNetCore.Antiforgery"
  if (typeof document !== 'undefined') {
    const cookies = document.cookie?.split('; ') ?? [];
    const asp = cookies.find((c) => c.startsWith('.AspNetCore.Antiforgery'));
    if (asp) return decodeURIComponent(asp.split('=')[1]);
  }
  return undefined;
}

export function attachAntiForgeryHeaders(headers: Headers): Headers {
  try {
  // Prefer API-style responses over HTML redirects
  headers.set('Accept', 'application/json');
  headers.set('X-Requested-With', 'XMLHttpRequest');

    // Prefer cookie, then localStorage fallbacks
    let token = getAntiForgeryTokenFromCookies();
    if (!token && typeof localStorage !== 'undefined') {
      token =
        localStorage.getItem('XSRF-TOKEN') ||
        localStorage.getItem('RequestVerificationToken') ||
        localStorage.getItem('CSRF-TOKEN') ||
        undefined;
    }
    if (token) {
      // Attach both common header names to maximize compatibility
      headers.set('X-XSRF-TOKEN', token);
      headers.set('RequestVerificationToken', token);
      headers.set('X-CSRF-TOKEN', token);
    }
  } catch (e) {
  }
  return headers;
}

export function clearAntiForgeryStorage(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('XSRF-TOKEN');
      localStorage.removeItem('RequestVerificationToken');
      localStorage.removeItem('CSRF-TOKEN');
    }
  } catch {}
}
