export const checkSupabaseConnection = async (supabaseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 401;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

export const getConnectionErrorMessage = (): string => {
  return `
🚨 Supabase Connection Failed - India DNS Issue

Supabase India mein block ho gaya hai kuch ISPs ke through (Jio, Airtel, etc.).

QUICK FIX (2 minutes):

Option 1: Change DNS to Cloudflare
1. Settings > Network > DNS
2. Change to: 1.1.1.1 and 1.0.0.1
3. Browser restart karo

Option 2: Use VPN (Fastest)
1. Download Cloudflare WARP: https://1.1.1.1
2. Install and turn ON
3. Login again

Option 3: Use Google DNS
1. Settings > Network > DNS
2. Change to: 8.8.8.8 and 8.8.4.4
3. Browser restart karo

Detailed instructions: Check INDIA_DNS_FIX.md file

Status: https://status.supabase.com
  `.trim();
};

export const showConnectionError = (onRetry?: () => void) => {
  const message = getConnectionErrorMessage();

  console.error(message);

  if (typeof window !== 'undefined') {
    const shouldRetry = window.confirm(
      `${message}\n\nPress OK to retry connection, Cancel to see detailed instructions.`
    );

    if (shouldRetry && onRetry) {
      onRetry();
    } else {
      window.open('https://1.1.1.1', '_blank');
    }
  }
};

export const isIndianISP = (): boolean => {
  if (typeof window === 'undefined') return false;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta';
};
