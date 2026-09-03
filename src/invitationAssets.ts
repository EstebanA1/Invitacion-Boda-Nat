const invitationRoot = "/invitation";
const sceneRoot = `${invitationRoot}/scene`;

export const invitationAssets = {
  cover: {
    desktop: {
      flowerTop: `${invitationRoot}/cover-flower-top.webp`,
      flowerBottom: `${invitationRoot}/cover-flower-bottom.webp`,
      envelope: `${invitationRoot}/cover-envelope.webp`,
      seal: `${invitationRoot}/cover-seal.webp`,
      bouquet: `${invitationRoot}/cover-bouquet.webp`,
    },
    mobile: {
      flowerTop: `${invitationRoot}/cover-flower-top-mobile.webp`,
      flowerBottom: `${invitationRoot}/cover-flower-bottom-mobile.webp`,
      envelope: `${invitationRoot}/cover-envelope-mobile.webp`,
      seal: `${invitationRoot}/cover-seal-mobile.webp`,
      bouquet: `${invitationRoot}/cover-bouquet-mobile.webp`,
    },
  },
  envelope: {
    desktop: {
      back: `${sceneRoot}/envelope-back.webp`,
      front: `${sceneRoot}/envelope-front.webp`,
      photo: `${sceneRoot}/envelope-looking-september.webp`,
      pearls: `${sceneRoot}/envelope-pearls.webp`,
    },
    mobile: {
      back: `${sceneRoot}/envelope-back-mobile.webp`,
      front: `${sceneRoot}/envelope-front-mobile.webp`,
      photo: `${sceneRoot}/envelope-looking-september-mobile.webp`,
      pearls: `${sceneRoot}/envelope-pearls-mobile.webp`,
    },
  },
  date: {
    frame: `${sceneRoot}/date-frame.webp`,
    flower: `${sceneRoot}/date-flower.webp`,
    dividerMain: `${sceneRoot}/gold-divider-main.webp`,
    dividerSmall: `${sceneRoot}/gold-divider-small.webp`,
  },
  blessing: {
    frame: `${sceneRoot}/blessing-frame.webp`,
    photo: `${sceneRoot}/formal-camera-september.webp`,
    divider: `${sceneRoot}/heart-divider.webp`,
  },
  gallery: [
    {
      id: "rings",
      src: `${invitationRoot}/gallery/rings-720.webp`,
      smallSrc: `${invitationRoot}/gallery/rings-480.webp`,
      alt: "Las manos de Natalia y Gabriel mostrando sus anillos",
      width: 720,
      height: 1280,
    },
    {
      id: "embrace",
      src: `${invitationRoot}/gallery/embrace-720.webp`,
      smallSrc: `${invitationRoot}/gallery/embrace-480.webp`,
      alt: "Natalia y Gabriel abrazados al aire libre",
      width: 720,
      height: 960,
    },
    {
      id: "heart",
      src: `${invitationRoot}/gallery/heart-720.webp`,
      smallSrc: `${invitationRoot}/gallery/heart-480.webp`,
      alt: "Natalia y Gabriel bajo un corazón iluminado",
      width: 720,
      height: 960,
    },
  ],
  details: {
    handwrittenPaper: `${sceneRoot}/handwritten-paper.webp`,
    locationFrame: `${sceneRoot}/location-frame.webp`,
    roseSpray: `${sceneRoot}/rose-spray.webp`,
  },
  gifts: {
    card: `${sceneRoot}/gift-card.webp`,
    bank: `${sceneRoot}/bank.webp`,
  },
  program: {
    envelope: `${sceneRoot}/program-envelope.webp`,
    frame: `${sceneRoot}/program-frame.webp`,
    seal: `${sceneRoot}/program-seal.webp`,
    icons: {
      church: `${sceneRoot}/church.webp`,
      welcome: `${sceneRoot}/welcome.webp`,
      toast: `${sceneRoot}/toast.webp`,
      dinner: `${sceneRoot}/dinner.webp`,
      cake: `${sceneRoot}/cake.webp`,
      car: `${sceneRoot}/car.webp`,
    },
  },
  guides: {
    one: `${invitationRoot}/guides/scene-1.png`,
    two: `${invitationRoot}/guides/scene-2.png`,
    envelope: `${invitationRoot}/guides/scene-3.png`,
    date: `${invitationRoot}/guides/scene-4.png`,
    blessing: `${invitationRoot}/guides/scene-5.png`,
  },
} as const;

export function getResponsiveCoverAssets() {
  return window.matchMedia("(max-width: 480px)").matches
    ? invitationAssets.cover.mobile
    : invitationAssets.cover.desktop;
}

export function getResponsiveEnvelopeAssets() {
  return window.matchMedia("(max-width: 480px)").matches
    ? invitationAssets.envelope.mobile
    : invitationAssets.envelope.desktop;
}

function waitForImage(image: HTMLImageElement) {
  if (image.complete) {
    if (!image.naturalWidth) return Promise.resolve();
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
}

function withTimeout(task: Promise<unknown>, timeoutMs: number) {
  return Promise.race([
    task,
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

export function waitForImagesWithin(container: ParentNode, timeoutMs = 1200) {
  const images = Array.from(container.querySelectorAll<HTMLImageElement>("img"));
  return withTimeout(Promise.allSettled(images.map(waitForImage)), timeoutMs);
}

export function preloadImageSources(sources: readonly string[], timeoutMs = 1400) {
  const tasks = sources.map((source) => {
    const image = new Image();
    image.decoding = "async";
    image.src = source;
    return waitForImage(image);
  });

  return withTimeout(Promise.allSettled(tasks), timeoutMs);
}
