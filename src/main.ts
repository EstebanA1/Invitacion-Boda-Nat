type WeddingAppModule = typeof import('./mountWeddingApp');

const params = new URLSearchParams(window.location.search);
const initialTarget = window.location.hash.slice(1);
const isCoverRoute = !params.get('admin')
  && params.get('guide') !== '1'
  && (!initialTarget || initialTarget === 'scene-cover' || initialTarget === 'inicio');

(window as Window & { __WEDDING_DIRECT_ENTRY__?: boolean }).__WEDDING_DIRECT_ENTRY__ = !isCoverRoute;

let appModulePromise: Promise<WeddingAppModule> | null = null;
let isMounting = false;

function prepareWeddingApp() {
  appModulePromise ??= import('./mountWeddingApp');
  void import('./components/DigitalWeddingInvitation');
  return appModulePromise;
}

async function mountWeddingApp(targetId: string) {
  if (isMounting) return;
  isMounting = true;

  const nextUrl = `${window.location.pathname}${window.location.search}${targetId ? `#${targetId}` : ''}`;
  window.history.replaceState(null, '', nextUrl);
  document.documentElement.dataset.entry = 'journey';

  const appModule = await prepareWeddingApp();
  appModule.mountWeddingApp();
}

function bindCoverInteractions() {
  const openCard = document.getElementById('cover-open-button') as HTMLButtonElement | null;
  const openHint = document.getElementById('cover-open-hint') as HTMLButtonElement | null;
  const quickRsvp = document.getElementById('quick-rsvp-button') as HTMLButtonElement | null;
  const seal = document.getElementById('cover-seal');
  let isOpening = false;

  const openInvitation = () => {
    if (isOpening || !openCard) return;
    isOpening = true;
    openCard.disabled = true;
    if (openHint) openHint.disabled = true;

    void prepareWeddingApp();
    seal?.classList.add('is-popping');

    window.setTimeout(() => {
      seal?.classList.remove('is-popping');
      openCard.classList.add('is-opening');
      window.setTimeout(() => void mountWeddingApp('scene-envelope'), 760);
    }, 430);
  };

  openCard?.addEventListener('click', openInvitation);
  openHint?.addEventListener('click', openInvitation);
  quickRsvp?.addEventListener('click', () => void mountWeddingApp('rsvp'));
}

function bindDirectEnvelopeInteractions() {
  const quickRsvp = document.getElementById('quick-rsvp-button') as HTMLButtonElement | null;
  const passiveEvents = ['pointerdown', 'touchstart', 'wheel'] as const;
  let hasRequestedMount = false;

  const cleanup = () => {
    passiveEvents.forEach((eventName) => window.removeEventListener(eventName, revealJourney, { capture: true }));
    window.removeEventListener('keydown', revealJourney, { capture: true });
    quickRsvp?.removeEventListener('click', openRsvp);
  };

  const mountFromPrerender = (targetId: string, revealFullJourney: boolean) => {
    if (hasRequestedMount) return;
    hasRequestedMount = true;
    cleanup();
    if (revealFullJourney) {
      (window as Window & { __WEDDING_DIRECT_ENTRY__?: boolean }).__WEDDING_DIRECT_ENTRY__ = false;
    }
    void mountWeddingApp(targetId);
  };

  function revealJourney(event: Event) {
    const eventTarget = event.target;
    if (eventTarget instanceof Element && eventTarget.closest('#quick-rsvp-button')) return;
    mountFromPrerender('scene-envelope', true);
  }

  function openRsvp() {
    mountFromPrerender('rsvp', false);
  }

  passiveEvents.forEach((eventName) => {
    window.addEventListener(eventName, revealJourney, { passive: true, capture: true });
  });
  window.addEventListener('keydown', revealJourney, { capture: true });
  quickRsvp?.addEventListener('click', openRsvp);
}

if (isCoverRoute) {
  bindCoverInteractions();
} else if (initialTarget === 'scene-envelope' && document.getElementById('scene-envelope-prerender')) {
  bindDirectEnvelopeInteractions();
} else {
  void mountWeddingApp(initialTarget);
}
