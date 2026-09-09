const labels = {
  soon: "soon",
  getFile: "download .apk",
  store: "open store",
  missing: "the file will appear here",
};

const releases = window.BACK_RELEASES || {
  version: "1.0.0",
  ios: "",
  android: "downloads/back.apk",
  androidStore: "",
};

function isStoreUrl(url) {
  return /^https?:\/\//i.test(url) && !/\.(apk|ipa|aab)(\?|$)/i.test(url);
}

async function fileExists(url) {
  if (!url) {
    return false;
  }
  if (isStoreUrl(url)) {
    return true;
  }
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok ? true : false;
  } catch {
    return null;
  }
}

async function wireDownloads() {
  const ios = document.getElementById("dl-ios");
  const android = document.getElementById("dl-android");
  const iosState = document.getElementById("ios-state");
  const androidState = document.getElementById("android-state");
  const version = document.getElementById("file-version");
  if (version) {
    version.textContent = releases.version;
  }

  const iosUrl = releases.ios;
  if (ios && iosState) {
    if (iosUrl) {
      ios.href = iosUrl;
      ios.classList.remove("is-disabled");
      ios.removeAttribute("aria-disabled");
      iosState.textContent = isStoreUrl(iosUrl) ? labels.store : labels.getFile;
    } else {
      ios.href = "#download";
      ios.classList.add("is-disabled");
      ios.setAttribute("aria-disabled", "true");
      iosState.textContent = labels.soon;
    }
  }

  const androidUrl = releases.androidStore || releases.android;
  if (android && androidState) {
    const ready = androidUrl ? await fileExists(androidUrl) : false;
    if (ready) {
      android.href = androidUrl;
      android.classList.remove("is-disabled");
      android.removeAttribute("aria-disabled");
      androidState.textContent = isStoreUrl(androidUrl) ? labels.store : labels.getFile;
      if (!isStoreUrl(androidUrl)) {
        android.setAttribute("download", "Back.apk");
      } else {
        android.removeAttribute("download");
      }
    } else if (ready === null && androidUrl && !isStoreUrl(androidUrl)) {
      android.href = androidUrl;
      android.classList.remove("is-disabled");
      android.setAttribute("download", "Back.apk");
      androidState.textContent = labels.getFile;
    } else {
      android.href = "#download";
      android.classList.add("is-disabled");
      android.setAttribute("aria-disabled", "true");
      androidState.textContent = labels.missing;
    }
  }
}

const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

wireDownloads();
