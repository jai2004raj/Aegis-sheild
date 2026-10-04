/**
 * Visitor Tracking Utility for Aegis Shield
 * Silently captures visitor metrics (Location, IP, ISP, Device, OS, Browser, Referrer)
 * and dispatches an instant email notification to the site administrator.
 */

interface VisitorMetrics {
  ip: string;
  city: string;
  region: string;
  country: string;
  postal?: string;
  isp?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
  device: string;
  os: string;
  browser: string;
  referrer: string;
  pageUrl: string;
  timestamp: string;
  screen: string;
}

function parseDeviceAndBrowser() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let os = 'Unknown OS';

  if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10 / 11';
  else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
  else if (/iPhone/i.test(ua)) os = 'Apple iOS (iPhone)';
  else if (/iPad/i.test(ua)) os = 'Apple iPadOS (iPad)';
  else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'Apple macOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  let browser = 'Unknown Browser';
  if (/Edg\/([0-9.]+)/i.test(ua)) {
    const m = ua.match(/Edg\/([0-9.]+)/i);
    browser = `Microsoft Edge ${m ? m[1].split('.')[0] : ''}`.trim();
  } else if (/Chrome\/([0-9.]+)/i.test(ua) && !/Chromium|OPR/i.test(ua)) {
    const m = ua.match(/Chrome\/([0-9.]+)/i);
    browser = `Google Chrome ${m ? m[1].split('.')[0] : ''}`.trim();
  } else if (/Safari\/([0-9.]+)/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\/([0-9.]+)/i.test(ua)) {
    const m = ua.match(/Firefox\/([0-9.]+)/i);
    browser = `Mozilla Firefox ${m ? m[1].split('.')[0] : ''}`.trim();
  } else if (/OPR\/([0-9.]+)/i.test(ua)) {
    browser = 'Opera';
  }

  let device = '💻 Desktop PC / Laptop';
  if (/iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) {
    device = '📱 Mobile Phone';
  } else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    device = '📱 Tablet';
  }

  return { os, browser, device };
}

export async function trackVisitor(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Prevent duplicate tracking triggers in the same browsing session (within 30 mins)
  const lastTracked = sessionStorage.getItem('aegis_visit_tracked_at');
  if (lastTracked) {
    const elapsedMinutes = (Date.now() - Number(lastTracked)) / 60000;
    if (elapsedMinutes < 30) {
      return;
    }
  }

  try {
    const { os, browser, device } = parseDeviceAndBrowser();

    let geoData: any = null;

    // 1. Primary IP & Geolocation API (free, fast, CORS-enabled)
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        geoData = await res.json();
      }
    } catch {
      // Fallback API if ipwho.is is blocked
      try {
        const fallbackRes = await fetch('https://ipapi.co/json/');
        if (fallbackRes.ok) {
          geoData = await fallbackRes.json();
        }
      } catch {
        // Continue even if geocoding fails
      }
    }

    const screenRes =
      typeof window !== 'undefined' && window.screen
        ? `${window.screen.width}x${window.screen.height} (Scale: ${window.devicePixelRatio || 1}x)`
        : 'Unknown';

    let referrer = document.referrer ? document.referrer : 'Direct Visit (Typed URL or Opened from WhatsApp/App)';
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('ref')) {
        referrer = `Campaign Link (ref=${params.get('ref')})`;
      }
    }

    const payload: VisitorMetrics = {
      ip: geoData?.ip || 'Pending IP',
      city: geoData?.city || 'Unknown City',
      region: geoData?.region || geoData?.region_code || 'Unknown Region',
      country: geoData?.country || 'Unknown Country',
      postal: geoData?.postal,
      isp: geoData?.connection?.isp || geoData?.org || 'Standard ISP',
      org: geoData?.connection?.org || geoData?.org,
      latitude: geoData?.latitude,
      longitude: geoData?.longitude,
      device,
      os,
      browser,
      referrer,
      pageUrl: window.location.href,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Asia/Kolkata',
      }),
      screen: screenRes,
    };

    // Dispatch to Vercel Serverless Function / API
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      sessionStorage.setItem('aegis_visit_tracked_at', String(Date.now()));
    }
  } catch (error) {
    // Non-blocking silent catch
    console.debug('[VisitorTracker] Non-fatal notification error:', error);
  }
}
