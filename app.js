const toast = document.createElement("div");
toast.id = "app-toast";
toast.className = "toast toast--info";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
toast.setAttribute("aria-atomic", "true");
toast.hidden = true;
document.body.appendChild(toast);

let toastTimeout;

function showToast(message, type = "info") {
  const toastType = ["success", "error", "info"].includes(type) ? type : "info";
  toast.textContent = message;
  toast.className = `toast toast--${toastType}`;
  toast.hidden = false;

  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

function scrollToTarget(target) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (
    !link ||
    link.target === "_blank" ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const linkUrl = new URL(link.href, window.location.href);
  if (
    linkUrl.origin !== window.location.origin ||
    linkUrl.pathname !== window.location.pathname ||
    linkUrl.search !== window.location.search ||
    !linkUrl.hash
  ) {
    return;
  }

  const target = document.getElementById(
    decodeURIComponent(linkUrl.hash.slice(1)),
  );
  if (!target) {
    return;
  }

  event.preventDefault();
  window.history.pushState(null, "", linkUrl.hash);
  scrollToTarget(target);
});

window.addEventListener("load", () => {
  if (!window.location.hash) {
    return;
  }

  const target = document.getElementById(
    decodeURIComponent(window.location.hash.slice(1)),
  );
  if (target) {
    scrollToTarget(target);
  }
});

const bookingForm = document.getElementById("ticket-booking-form");
if (bookingForm) {
  const matchField = document.getElementById("match");
  const requestedMatch = new URLSearchParams(window.location.search).get(
    "match",
  );

  if (
    requestedMatch &&
    Array.from(matchField.options).some(
      (option) => option.value === requestedMatch,
    )
  ) {
    matchField.value = requestedMatch;
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast(
      "Your details are valid. This demo does not submit a real booking.",
      "success",
    );
  });

  bookingForm.addEventListener("reset", () => {
    window.clearTimeout(toastTimeout);
    toast.hidden = true;
  });
}
