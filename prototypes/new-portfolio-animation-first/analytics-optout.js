(() => {
  const key = 'fwidianto.analytics-opt-out';
  const url = new URL(window.location.href);
  const command = url.searchParams.get('analytics');

  if (command === 'off' || command === 'on') {
    try {
      if (command === 'off') localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    } catch {}
    url.searchParams.delete('analytics');
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  let optedOut = command === 'off';
  try {
    optedOut ||= localStorage.getItem(key) === '1';
  } catch {}
  if (optedOut) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-FL42QH3WV0');

  const ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-FL42QH3WV0';
  document.head.appendChild(ga);

  window.clarity = window.clarity || function clarity() {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  const clarity = document.createElement('script');
  clarity.async = true;
  clarity.src = 'https://www.clarity.ms/tag/xefdu66wh2';
  document.head.appendChild(clarity);
})();
