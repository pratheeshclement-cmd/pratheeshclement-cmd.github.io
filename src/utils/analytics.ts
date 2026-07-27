// Analytics & Cookie-Consent gating engine for GA4 & Meta Pixel

export const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Placeholder as requested
export const META_PIXEL_ID = '983425767341384'; // Actual user provided Meta Pixel ID

let ga4Loaded = false;
let metaPixelLoaded = false;

export function initAnalytics(consent: { analytics: boolean; marketing: boolean }) {
  if (consent.analytics && !ga4Loaded && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    loadGA4(GA4_MEASUREMENT_ID);
  }
  if (consent.marketing && !metaPixelLoaded) {
    loadMetaPixel(META_PIXEL_ID);
  }
}

function loadGA4(id: string) {
  if (ga4Loaded) return;
  ga4Loaded = true;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}');
  `;
  document.head.appendChild(script2);
}

function loadMetaPixel(id: string) {
  if (metaPixelLoaded) return;
  metaPixelLoaded = true;

  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${id}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
}

// Event listener for consent granted
if (typeof window !== 'undefined') {
  window.addEventListener('consent-granted', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) {
      initAnalytics(detail);
    }
  });
}
