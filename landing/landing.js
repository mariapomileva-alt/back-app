const releases = window.BACK_RELEASES || {
  version: "1.0.0",
  ios: "",
  android: "",
  androidStore: "",
};

function isStoreUrl(url) {
  return /^https?:\/\//i.test(url) && !/\.(apk|ipa|aab)(\?|$)/i.test(url);
}

function isIosStoreUrl(url) {
  return isStoreUrl(url) && /apps\.apple\.com|testflight\.apple\.com/i.test(url);
}

function isPlayStoreUrl(url) {
  return isStoreUrl(url) && /play\.google\.com/i.test(url);
}

async function fileExists(url) {
  if (!url || isStoreUrl(url)) {
    return Boolean(url && isStoreUrl(url));
  }
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return null;
  }
}

function renderComingSoon(slot, label) {
  slot.replaceChildren();
  const panel = document.createElement("div");
  panel.className = "avail-soon";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", `${label}, coming soon`);

  const name = document.createElement("span");
  name.className = "avail-label";
  name.textContent = label;

  const state = document.createElement("span");
  state.className = "avail-state";
  state.textContent = "Coming soon";

  panel.append(name, state);
  slot.append(panel);
}

function renderStoreLink(slot, label, href, caption, variant) {
  slot.replaceChildren();
  const link = document.createElement("a");
  link.className = `btn ${variant} avail-link`;
  link.href = href;
  link.rel = "noopener noreferrer";

  const name = document.createElement("span");
  name.textContent = label;

  const small = document.createElement("small");
  small.textContent = caption;

  link.append(name, small);
  slot.append(link);
}

function renderApkLink(slot, href) {
  slot.replaceChildren();
  const link = document.createElement("a");
  link.className = "btn clay avail-link";
  link.href = href;
  link.setAttribute("download", "Back.apk");

  const name = document.createElement("span");
  name.textContent = "Android";

  const small = document.createElement("small");
  small.textContent = "Download .apk";

  link.append(name, small);
  slot.append(link);
}

async function wireAvailability() {
  const iosSlot = document.getElementById("avail-ios");
  const androidSlot = document.getElementById("avail-android");

  const iosUrl = (releases.ios || "").trim();
  if (iosSlot) {
    if (iosUrl && isIosStoreUrl(iosUrl)) {
      renderStoreLink(
        iosSlot,
        "iPhone",
        iosUrl,
        "Download on the App Store",
        "forest"
      );
    } else if (iosUrl && isStoreUrl(iosUrl)) {
      renderStoreLink(iosSlot, "iPhone", iosUrl, "Open store", "forest");
    } else {
      renderComingSoon(iosSlot, "iPhone");
    }
  }

  const androidStore = (releases.androidStore || "").trim();
  const androidFile = (releases.android || "").trim();
  const androidUrl = androidStore || androidFile;

  if (androidSlot) {
    if (androidStore && isPlayStoreUrl(androidStore)) {
      renderStoreLink(
        androidSlot,
        "Android",
        androidStore,
        "Get it on Google Play",
        "clay"
      );
    } else if (androidUrl && isStoreUrl(androidUrl)) {
      renderStoreLink(androidSlot, "Android", androidUrl, "Open store", "clay");
    } else if (androidFile) {
      const ready = await fileExists(androidFile);
      if (ready) {
        renderApkLink(androidSlot, androidFile);
      } else if (ready === null) {
        renderApkLink(androidSlot, androidFile);
      } else {
        renderComingSoon(androidSlot, "Android");
      }
    } else {
      renderComingSoon(androidSlot, "Android");
    }
  }
}

const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

wireAvailability();

(function initHeroMotionPause() {
  const root = document.documentElement;

  function syncMotionPause() {
    root.classList.toggle("motion-paused", document.hidden);
  }

  document.addEventListener("visibilitychange", syncMotionPause);
  syncMotionPause();
})();
