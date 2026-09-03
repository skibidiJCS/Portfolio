const meter = document.querySelector(".scroll-meter span");
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const resetInitialScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
if (window.location.hash) {
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}
resetInitialScroll();

const imageCards = document.querySelectorAll(".image-card");
const revealItems = document.querySelectorAll(".reveal");
const scrollStory = document.querySelector(".scroll-story");
const storyTrack = document.querySelector(".story-track");
const storySlides = document.querySelectorAll(".story-slide");
const storyWindows = document.querySelectorAll(".story-window");
const themeSections = document.querySelectorAll("main > section, .curtain-sequence > section");
let activeThemeSection = themeSections[0] || null;
const hero = document.querySelector(".hero");
const heroStage = document.querySelector(".hero-stage");
const achievementsSection = document.querySelector("#achievements");
const chessSeparatorPath = achievementsSection?.querySelector(".chess-separator path");
const projectsSection = document.querySelector("#projects");
const contactSection = document.querySelector("#contact");
const volunteerStory = document.querySelector("[data-volunteer-story]");
const volunteerStage = volunteerStory?.querySelector(".volunteer-stage");
const volunteerTrack = volunteerStory?.querySelector(".volunteer-track");
const volunteerScenes = Array.from(volunteerStory?.querySelectorAll(".volunteer-scene") || []);
const monogramLetters = {
  j: document.querySelector('[data-jcs-letter="j"]'),
  c: document.querySelector('[data-jcs-letter="c"]'),
  s: document.querySelector('[data-jcs-letter="s"]'),
};
const monogramSources = {
  j: document.querySelector('[data-jcs-source="j"]'),
  c: document.querySelector('[data-jcs-source="c"]'),
  s: document.querySelector('[data-jcs-source="s"]'),
};
let heroLetterStarts = null;
let heroLetterStartWidth = 0;
const chapters = document.querySelectorAll(".chapter");
const timelineSection = document.querySelector(".milestones");
const timelineStage = document.querySelector(".timeline-stage");
const timelineViewport = document.querySelector(".timeline-viewport");
const timelineRail = document.querySelector(".timeline-rail");
const timelineYears = Array.from(document.querySelectorAll(".timeline-year"));
let timelineHorizontalTravel = 0;
let timelineStageHeight = 0;
let timelineLastProgress = -1;
let timelineLastIndex = -1;
let timelineVisible = false;
let storyMetrics = null;
let volunteerStoryMetrics = null;
let volunteerLastProgress = -1;
let viewportWidth = 0;
let heroTransitionComplete = false;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const gsapRuntime = window.gsap;
const scrollTriggerRuntime = window.ScrollTrigger;
let smoothScroller = null;

if (gsapRuntime && scrollTriggerRuntime) {
  gsapRuntime.registerPlugin(scrollTriggerRuntime);
}

const returnToFirstSection = () => {
  resetInitialScroll();
  smoothScroller?.scrollTo(0, { immediate: true, force: true });
};

returnToFirstSection();
window.addEventListener("pageshow", () => {
  returnToFirstSection();
  requestAnimationFrame(() => {
    returnToFirstSection();
    requestAnimationFrame(returnToFirstSection);
  });
});

const heroMarqueeStates = Array.from(document.querySelectorAll(".hero-marquee")).map((row) => ({
  row,
  group: row.querySelector(".hero-marquee-group"),
  width: 0,
  duration: row.classList.contains("hero-marquee-secondary") ? 14000 : 12000,
  reverse: row.classList.contains("hero-marquee-secondary"),
}));
let heroMarqueesVisible = true;

const updateHeroMarqueeWidths = () => {
  heroMarqueeStates.forEach((state) => {
    state.width = state.group?.offsetWidth || 0;
  });
};

const animateHeroMarquees = (time) => {
  if (!reducedMotionQuery.matches && heroMarqueeStates.length && heroMarqueesVisible) {
    heroMarqueeStates.forEach((state) => {
      if (!state.width) return;
      const progress = (time % state.duration) / state.duration;
      state.row.scrollLeft = state.width * (state.reverse ? 1 - progress : progress);
    });
  }

  requestAnimationFrame(animateHeroMarquees);
};

updateHeroMarqueeWidths();
requestAnimationFrame(animateHeroMarquees);
const hasNativeChapterTimeline = Boolean(
  window.CSS?.supports?.("animation-timeline: view()") &&
  window.CSS?.supports?.("view-timeline-name: --chapter-motion")
);
const chapterTravel = new WeakMap();
const signatureSection = document.querySelector(".signature-section");
const signatureGraphic = document.querySelector(".jcs-signature");
const signaturePaper = document.querySelector(".signature-paper");
const signaturePhoto = document.querySelector(".signature-photo");
const signaturePaths = Array.from(document.querySelectorAll(".jcs-signature path"));
const signatureLengths = signaturePaths.map((path) => {
  const hiddenLength = Math.ceil(path.getTotalLength()) + 4;
  path.style.strokeDasharray = `${hiddenLength.toFixed(2)}`;
  path.style.strokeDashoffset = hiddenLength.toFixed(2);
  path.style.opacity = "1";
  path.style.visibility = "visible";
  return hiddenLength;
});
document.documentElement.classList.add("signature-ready");
const signatureStrokeWeights = [0.08, 0.025, 0.235, 0.2, 0.2, 0.025, 0.235];
let signatureLastProgress = -1;
let signatureLastBackgroundProgress = -1;
let signatureLastPhotoProgress = -1;

const penStrokeProgress = (time) => {
  const progress = Math.min(1, Math.max(0, time));
  const ramp = 0.16;
  const distance = 1 - ramp;
  if (progress < ramp) return (progress * progress) / (2 * ramp * distance);
  if (progress <= 1 - ramp) return (progress - ramp / 2) / distance;
  const remaining = 1 - progress;
  return 1 - (remaining * remaining) / (2 * ramp * distance);
};

const updateSignatureProgress = () => {
  if (!signatureSection || !signatureGraphic || !signaturePaper || !signaturePhoto || !signaturePaths.length) return;

  const viewportHeight = Math.max(1, window.innerHeight);
  const sectionRect = signatureSection.getBoundingClientRect();
  const rawBackgroundProgress = (viewportHeight * 0.72 - sectionRect.top) / (viewportHeight * 0.34);
  const backgroundProgress = Math.min(1, Math.max(0, rawBackgroundProgress));
  const easedBackgroundProgress = backgroundProgress * backgroundProgress * (3 - 2 * backgroundProgress);
  if (Math.abs(easedBackgroundProgress - signatureLastBackgroundProgress) >= 0.0005) {
    signatureLastBackgroundProgress = easedBackgroundProgress;
    const lightColor = [226, 229, 216];
    const darkColor = [36, 39, 30];
    const blendedColor = lightColor.map((channel, index) =>
      Math.round(channel + (darkColor[index] - channel) * easedBackgroundProgress)
    );
    document.documentElement.style.setProperty("--signature-bg-progress", easedBackgroundProgress.toFixed(4));
    document.documentElement.style.setProperty("--signature-bg-color", `rgb(${blendedColor.join(", ")})`);
    const blend = (from, to) => from.map((channel, index) =>
      Math.round(channel + (to[index] - channel) * easedBackgroundProgress)
    );
    const timelineInk = blend([32, 37, 29], [243, 247, 234]);
    const timelineMuted = blend([82, 96, 72], [193, 203, 183]);
    const timelinePanel = blend([255, 255, 247], [49, 54, 42]);
    const timelineBorder = blend([32, 37, 29], [243, 247, 234]);
    const timelineShadow = blend([32, 37, 29], [0, 0, 0]);
    document.documentElement.style.setProperty("--timeline-ink-color", `rgb(${timelineInk.join(", ")})`);
    document.documentElement.style.setProperty("--timeline-muted-color", `rgb(${timelineMuted.join(", ")})`);
    document.documentElement.style.setProperty("--timeline-panel-color", `rgba(${timelinePanel.join(", ")}, ${(0.54 + easedBackgroundProgress * 0.34).toFixed(3)})`);
    document.documentElement.style.setProperty("--timeline-border-color", `rgba(${timelineBorder.join(", ")}, ${(0.13 + easedBackgroundProgress * 0.09).toFixed(3)})`);
    document.documentElement.style.setProperty("--timeline-line-color", `rgba(${timelineBorder.join(", ")}, ${(0.15 + easedBackgroundProgress * 0.05).toFixed(3)})`);
    document.documentElement.style.setProperty("--timeline-shadow-color", `rgba(${timelineShadow.join(", ")}, ${(0.11 + easedBackgroundProgress * 0.17).toFixed(3)})`);
  }

  let photoProgress = 0;
  let rawSignatureProgress = 0;
  if (sectionRect.top < viewportHeight) {
    const photoTop = sectionRect.top + signaturePaper.offsetTop;
    const photoBottom = photoTop + signaturePaper.offsetHeight;
    photoProgress = Math.min(1, Math.max(0, (viewportHeight * 0.97 - photoTop) / (viewportHeight * 0.24)));
    const availableSignatureTravel = Math.max(
      1,
      viewportHeight - 24 - signaturePaper.offsetTop - signaturePaper.offsetHeight
    );
    const signatureTravel = Math.max(
      1,
      Math.min(viewportHeight * 0.22, availableSignatureTravel)
    );
    rawSignatureProgress = Math.min(1, Math.max(0, (viewportHeight - 24 - photoBottom) / signatureTravel));
  }
  const signatureProgress = reducedMotionQuery.matches
    ? (rawSignatureProgress > 0 ? 1 : 0)
    : rawSignatureProgress;

  if (Math.abs(photoProgress - signatureLastPhotoProgress) >= 0.0005) {
    signatureLastPhotoProgress = photoProgress;
    signaturePaper.style.opacity = photoProgress.toFixed(3);
    signaturePaper.style.transform = `translate3d(0, ${((1 - photoProgress) * 26).toFixed(2)}px, 0) rotate(${(-1 - photoProgress * 2.2).toFixed(2)}deg) scale(${(0.95 + photoProgress * 0.05).toFixed(4)})`;
  }

  if (Math.abs(signatureProgress - signatureLastProgress) < 0.001) return;
  signatureLastProgress = signatureProgress;

  let strokeStart = 0;
  signaturePaths.forEach((path, index) => {
    const weight = signatureStrokeWeights[index] || (1 / signaturePaths.length);
    const localProgress = Math.min(1, Math.max(0, (signatureProgress - strokeStart) / weight));
    const easedProgress = penStrokeProgress(localProgress);
    path.style.strokeDashoffset = (signatureLengths[index] * (1 - easedProgress)).toFixed(2);
    strokeStart += weight;
  });
};
const reactiveItems = document.querySelectorAll(".skill-group, .education-panel");
const projectStack = document.querySelector(".project-stack");
const layerCards = Array.from(document.querySelectorAll(".layer-card"));
const projectSnapDots = document.querySelector(".project-snap-dots");
const detailCards = document.querySelectorAll("[data-detail-image]");
const detailView = document.querySelector(".detail-view");
const detailClose = detailView?.querySelector(".detail-close");
const detailImage = detailView?.querySelector(".detail-media img");
const detailLabel = detailView?.querySelector(".detail-label");
const detailTitle = detailView?.querySelector(".detail-copy h2");
const detailCopy = detailView?.querySelector(".detail-copy p");
const detailLink = detailView?.querySelector(".detail-link");
const highlightBlocks = document.querySelectorAll(".text-highlight");
let currentStorySlide = null;
let highlightResizeTimer = null;
const jcsScrollStart = 0.018;
let chessSeparatorLastProgress = -1;
const chapterLastProgress = new WeakMap();
let lastAppliedThemeState = "";

const updateViewportWidth = () => {
  const nextWidth = document.documentElement.clientWidth;
  if (nextWidth === viewportWidth) return;
  viewportWidth = nextWidth;
  document.documentElement.style.setProperty("--viewport-width", `${nextWidth}px`);
};

const updateMobileHeroLayout = () => {
  if (!heroStage) return;
  heroStage.style.removeProperty("--hero-photo-size");
  heroStage.style.removeProperty("--hero-photo-half-height");
  heroStage.style.removeProperty("--hero-square-size");
  heroStage.style.removeProperty("--hero-square-half");
};

const updateCurtainMetrics = () => {
  if (!projectsSection) return;
  const stickyTop = Math.min(0, window.innerHeight - projectsSection.offsetHeight);
  projectsSection.style.setProperty("--curtain-sticky-top", `${stickyTop}px`);
};

const updateCurtainState = () => {
  if (!projectsSection || !contactSection) return;
  const projectsRect = projectsSection.getBoundingClientRect();
  const contactRect = contactSection.getBoundingClientRect();
  const isActive = projectsRect.bottom > 0 && contactRect.top > 0 && contactRect.top < window.innerHeight;
  document.body.classList.toggle("curtain-in-progress", isActive);
};

const updateChessSeparatorCurve = () => {
  if (!achievementsSection || !chessSeparatorPath) return;
  const rect = achievementsSection.getBoundingClientRect();
  const travel = Math.max(1, window.innerHeight * 0.68);
  const rawProgress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
  const progress = reducedMotionQuery.matches
    ? (rawProgress > 0 ? 1 : 0)
    : rawProgress * rawProgress * (3 - 2 * rawProgress);
  if (Math.abs(progress - chessSeparatorLastProgress) < 0.0005) return;
  chessSeparatorLastProgress = progress;
  const edge = 4;
  const depth = edge + progress * 32;
  const control = edge + (depth - edge) * 2;
  chessSeparatorPath.setAttribute(
    "d",
    `M0 0H100V${edge}Q50 ${control.toFixed(2)} 0 ${edge}Z`
  );
};

const updateChapterTravel = () => {
  const viewportWidth = document.documentElement.clientWidth;
  const isMobile = viewportWidth < 700;
  const baseTravel = viewportWidth * (isMobile ? 0.16 : 0.22);

  chapters.forEach((chapter) => {
    chapterLastProgress.delete(chapter);
    const word = chapter.querySelector("b");
    const wordRect = word?.getBoundingClientRect();
    const chapterRect = chapter.getBoundingClientRect();
    const wordWidth = wordRect?.width || 0;
    const revealClearance = isMobile
      ? Math.max(0, (wordWidth - viewportWidth) * 0.5 + 24)
      : 0;
    const visibilityMultiplier = chapter.classList.contains("chapter-education") ? 2.7 : 1;
    const travel = Math.max(baseTravel, revealClearance * visibilityMultiplier);
    chapterTravel.set(chapter, travel);
    chapter.style.setProperty("--chapter-travel", `${travel.toFixed(2)}px`);

    if (wordRect) {
      const batonGap = Math.max(18, Math.min(38, window.innerHeight * 0.032));
      const batonTop = wordRect.bottom - chapterRect.top + batonGap;
      chapter.style.setProperty("--chapter-baton-top", `${batonTop.toFixed(2)}px`);
    }
  });
};

const updateTimelineMetrics = () => {
  if (!timelineSection || !timelineStage || !timelineViewport || !timelineRail) return;

  const firstYear = timelineYears[0];
  const lastYear = timelineYears[timelineYears.length - 1];
  const firstCenter = firstYear ? firstYear.offsetLeft + firstYear.offsetWidth / 2 : 0;
  const lastCenter = lastYear ? lastYear.offsetLeft + lastYear.offsetWidth / 2 : firstCenter;
  timelineHorizontalTravel = Math.max(0, lastCenter - firstCenter);
  timelineStageHeight = timelineStage.clientHeight || window.innerHeight;
  timelineSection.style.height = `${Math.ceil(timelineStageHeight + timelineHorizontalTravel)}px`;
  timelineSection.style.setProperty("--timeline-horizontal-travel", `${timelineHorizontalTravel.toFixed(2)}px`);
  timelineLastProgress = -1;
  timelineLastIndex = -1;
};

const renderTimelineProgress = (progress) => {
  if (Math.abs(progress - timelineLastProgress) <= 0.0001) return;
  timelineSection.style.setProperty("--timeline-progress", progress.toFixed(4));
  timelineSection.style.setProperty("--timeline-shift", `${(-timelineHorizontalTravel * progress).toFixed(2)}px`);
  timelineLastProgress = progress;

  const timelinePosition = progress * Math.max(0, timelineYears.length - 1);
  timelineYears.forEach((year, index) => {
    const signedDistance = index - timelinePosition;
    const distance = Math.min(1.5, Math.abs(signedDistance));
    year.style.setProperty("--timeline-depth", distance.toFixed(3));
    year.style.setProperty("--timeline-direction", signedDistance < 0 ? "-1" : "1");
    year.style.setProperty("--timeline-scene-opacity", Math.max(0.18, 1 - distance * 0.56).toFixed(3));
  });

  const panelStep = timelineYears.length > 1 ? timelineHorizontalTravel / (timelineYears.length - 1) : 0;
  const currentIndex = panelStep > 0
    ? Math.min(timelineYears.length - 1, Math.max(0, Math.round((timelineHorizontalTravel * progress) / panelStep)))
    : 0;
  if (currentIndex === timelineLastIndex) return;
  timelineYears.forEach((year, index) => year.classList.toggle("is-current", index === currentIndex));
  timelineLastIndex = currentIndex;
};

const updateTimelineProgress = () => {
  if (!timelineSection || !timelineStage || !timelineViewport || !timelineRail || !timelineYears.length) return;

  const rect = timelineSection.getBoundingClientRect();
  const stageHeight = timelineStageHeight || timelineStage.clientHeight || window.innerHeight;
  const verticalTravel = Math.max(1, rect.height - stageHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / verticalTravel));
  timelineVisible = rect.bottom > 0 && rect.top < stageHeight;
  renderTimelineProgress(progress);
};

const updateStoryMetrics = () => {
  storyMetrics = null;
  storyTrack?.style.removeProperty("transform");
};

const updateVolunteerStoryMetrics = () => {
  if (!volunteerStory || !volunteerStage || !volunteerTrack || !volunteerScenes.length) return;
  const firstScene = volunteerScenes[0];
  const lastScene = volunteerScenes[volunteerScenes.length - 1];
  const viewportCenter = document.documentElement.clientWidth / 2;
  const firstCenter = firstScene.offsetLeft + firstScene.offsetWidth / 2;
  const lastCenter = lastScene.offsetLeft + lastScene.offsetWidth / 2;
  const startShift = viewportCenter - firstCenter;
  const endShift = viewportCenter - lastCenter;
  const horizontalTravel = Math.abs(endShift - startShift);
  const stageHeight = volunteerStage.clientHeight || window.innerHeight;

  volunteerStoryMetrics = { startShift, endShift, horizontalTravel, stageHeight };
  volunteerStory.style.height = `${Math.ceil(stageHeight + horizontalTravel)}px`;
  volunteerLastProgress = -1;
};

const updateVolunteerStory = () => {
  if (!volunteerStory || !volunteerTrack || !volunteerStoryMetrics) return;
  const rect = volunteerStory.getBoundingClientRect();
  const travel = Math.max(1, volunteerStoryMetrics.horizontalTravel);
  const rawProgress = -rect.top / travel;
  const progress = Math.min(1, Math.max(0, rawProgress));
  if (Math.abs(progress - volunteerLastProgress) <= 0.0001) return;
  volunteerLastProgress = progress;
  const shift = volunteerStoryMetrics.startShift
    + (volunteerStoryMetrics.endShift - volunteerStoryMetrics.startShift) * progress;
  volunteerTrack.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;

  const viewportCenter = window.innerWidth / 2;
  volunteerScenes.forEach((scene) => {
    const sceneRect = scene.getBoundingClientRect();
    const distance = Math.min(1, Math.abs(sceneRect.left + sceneRect.width / 2 - viewportCenter) / window.innerWidth);
    scene.style.setProperty("--scene-distance", distance.toFixed(3));
  });
};

window.setTimeout(() => {
  document.body.classList.remove("intro-lock");
  updateScroll();
  /* Freeze intro-animation end-state so the forwards fill is no longer
     needed.  When .scrolling is later toggled, the base styles will be
     the final resting values and no transform jump can occur. */
  hero?.querySelectorAll(".hero-name-first, .hero-name-last, .eyebrow, .hero-copy")
    .forEach((el) => {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
}, 3100);

const updateScroll = () => {
  updateViewportWidth();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max <= 0 ? 0 : (window.scrollY / max) * 100;
  meter.style.transform = `scaleX(${Math.min(1, Math.max(0, progress / 100))})`;

  document.documentElement.style.setProperty("--scroll", progress.toFixed(2));
  if (timelineSection) {
    const timelineRect = timelineSection.getBoundingClientRect();
    const exitY = Math.min(0, timelineRect.bottom - window.innerHeight);
    document.documentElement.style.setProperty("--jcs-exit-y", `${exitY.toFixed(2)}px`);
  }
  updateHeroTransition();
  updateChessSeparatorCurve();
  updateCurtainState();
  updateChapterProgress();
  updateTimelineProgress();
  updateSignatureProgress();
  updateStoryTrack();
  updateVolunteerStory();
  updateTheme();
  updateHighlights();
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const chapterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("chapter-visible");
      chapterObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

chapters.forEach((chapter) => chapterObserver.observe(chapter));

const getHighlightSource = (block) => {
  if (!block.dataset.highlightText) {
    block.dataset.highlightText = block.dataset.lines || block.textContent.replace(/\s+/g, " ").trim();
  }

  return block.dataset.highlightText;
};

const splitHighlightLines = (block) => {
  const preferredLines = getHighlightSource(block)
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!preferredLines.length) return;

  const measure = document.createElement("span");
  measure.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0;display:inline-block;";
  block.appendChild(measure);

  const maxWidth = Math.max(1, block.getBoundingClientRect().width);
  const lines = [];
  const measureWidth = (text) => {
    measure.textContent = text;
    return measure.getBoundingClientRect().width;
  };
  const splitLongWord = (word) => {
    if (measureWidth(word) <= maxWidth) return [word];

    const hyphenChunks = word.includes("-")
      ? word
          .split("-")
          .map((chunk, index, chunks) => (index < chunks.length - 1 ? `${chunk}-` : chunk))
          .filter(Boolean)
      : [word];

    if (hyphenChunks.length > 1) return hyphenChunks;

    const chunks = [];
    let chunk = "";
    Array.from(word).forEach((letter) => {
      const next = `${chunk}${letter}`;
      if (chunk && measureWidth(next) > maxWidth) {
        chunks.push(chunk);
        chunk = letter;
      } else {
        chunk = next;
      }
    });
    if (chunk) chunks.push(chunk);
    return chunks;
  };

  preferredLines.forEach((preferredLine) => {
    if (measureWidth(preferredLine) <= maxWidth) {
      lines.push(preferredLine);
      return;
    }

    const words = preferredLine.split(/\s+/).filter(Boolean);
    let line = "";
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (line && measureWidth(next) > maxWidth) {
        lines.push(line);
        const wordLines = splitLongWord(word);
        if (wordLines.length > 1) {
          lines.push(...wordLines.slice(0, -1));
          line = wordLines.at(-1) || "";
        } else {
          line = word;
        }
      } else if (!line && measureWidth(next) > maxWidth) {
        const wordLines = splitLongWord(word);
        lines.push(...wordLines.slice(0, -1));
        line = wordLines.at(-1) || "";
      } else {
        line = next;
      }
    });
    if (line) lines.push(line);
  });
  measure.remove();

  const current = Array.from(block.children).map((child) => child.textContent).join("|");
  const baseDelay = Number.parseInt(block.dataset.highlightBase || "180", 10);
  const delayStep = Number.parseInt(block.dataset.highlightStep || "95", 10);
  if (current === lines.join("|")) {
    Array.from(block.children).forEach((child, index) => {
      child.classList.add("highlight-line");
      child.dataset.text = child.textContent.trim();
      child.style.setProperty("--highlight-delay", `${baseDelay + index * delayStep}ms`);
    });
    return;
  }

  const wasVisible = block.classList.contains("is-highlighted");
  block.replaceChildren();
  lines.forEach((lineText, index) => {
    const line = document.createElement("span");
    line.className = "highlight-line";
    line.dataset.text = lineText;
    line.textContent = lineText;
    line.style.setProperty("--highlight-delay", `${baseDelay + index * delayStep}ms`);
    block.appendChild(line);
  });
  if (wasVisible) block.classList.add("is-highlighted");
};

const activateHighlightBlock = (block) => {
  if (block.classList.contains("is-highlighted")) return;

  const profile = block.closest(".profile");
  const projects = block.closest(".projects");
  const closing = block.closest(".closing-inner");
  const education = block.closest(".education");

  if (education) {
    const stageDelay = 360;
    education.style.setProperty("--education-stage-delay", `${stageDelay}ms`);
    education.style.setProperty("--education-mark-delay", `${stageDelay + 340}ms`);
    education.style.setProperty("--education-date-delay", `${stageDelay + 430}ms`);
    education.style.setProperty("--education-title-delay", `${stageDelay + 530}ms`);
    education.style.setProperty("--education-copy-delay", `${stageDelay + 630}ms`);
    block.classList.add("is-highlighted");
    education.classList.add("is-education-active");
    return;
  }

  if (profile) {
    profile.classList.add("highlight-sequence");
    profile.querySelectorAll(".text-highlight").forEach((item) => item.classList.add("is-highlighted"));
    return;
  }

  if (projects) {
    projects.classList.add("highlight-sequence");
    projects.querySelectorAll(".text-highlight").forEach((item) => item.classList.add("is-highlighted"));
    return;
  }

  if (closing) {
    closing.classList.add("highlight-visible");
  }

  block.classList.add("is-highlighted");
};

const updateHighlights = () => {
  highlightBlocks.forEach((block) => {
    if (block.classList.contains("is-highlighted")) return;
    const rect = block.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.18) {
      activateHighlightBlock(block);
    }
  });
};

if (highlightBlocks.length) {
  highlightBlocks.forEach(splitHighlightLines);
  const highlightObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activateHighlightBlock(entry.target);
      });
    },
    {
      threshold: 0.42,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  highlightBlocks.forEach((block) => highlightObserver.observe(block));
}

const activateStorySlide = (slide) => {
  if (!slide || slide === currentStorySlide) return;
  currentStorySlide = slide;
  storySlides.forEach((item) => {
    item.classList.toggle("active", item === slide);
  });
};

const updateStoryTrack = () => {
  if (storyTrack?.style.transform) storyTrack.style.removeProperty("transform");
};

const sectionTheme = (section) => {
  if (!section) return "light";
  if (section.classList.contains("chapter-education")) return "final";
  if (section.classList.contains("chapter-focus")) return "final";
  if (section.classList.contains("chapter-build")) return "light";
  if (section.classList.contains("chapter")) return "dark";
  if (section.classList.contains("education")) return "final";
  if (section.classList.contains("milestones")) return "final";
  if (section.classList.contains("closing")) return "final";
  if (section.classList.contains("signature-section")) return "dark";
  if (section.classList.contains("profile")) return "light";
  if (section.classList.contains("achievements")) return "light";
  if (section.classList.contains("projects")) return "dark";
  return "light";
};

const captureHeroLetterStarts = () => {
  const entries = [
    ["j", monogramSources.j],
    ["c", monogramSources.c],
    ["s", monogramSources.s],
  ];
  if (entries.some(([, source]) => !source)) return;

  heroLetterStarts = entries.map(([, source]) => {
    const rect = source.getBoundingClientRect();
    const lineRect = source.closest(".hero-name-first, .hero-name-last")?.getBoundingClientRect();
    return {
      x: rect.left,
      y: lineRect?.top ?? rect.top,
      fontSize: Number.parseFloat(getComputedStyle(source).fontSize) || 48,
    };
  });
  heroLetterStartWidth = window.innerWidth;
};

const ensureHeroLetterStarts = (progress) => {
  if (!heroLetterStarts || Math.abs(heroLetterStartWidth - window.innerWidth) > 1 || progress < 0.002) {
    captureHeroLetterStarts();
  }
};

const getMonogramTargets = (letters, fontSize) => {
  const isMobile = window.innerWidth < 700;
  const startX = isMobile ? 17 : 24;
  const gap = isMobile ? 6 : 8;
  const canvas = getMonogramTargets.canvas || (getMonogramTargets.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  const family = getComputedStyle(document.body).fontFamily;
  context.font = `900 ${fontSize}px ${family}`;

  let cursor = startX;
  return letters.map((letter) => {
    const target = cursor;
    cursor += context.measureText(letter.textContent.trim()).width + gap;
    return target;
  });
};

const updateHeroTransition = () => {
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  heroMarqueesVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  if (heroTransitionComplete && rect.bottom <= 0) return;
  if (rect.bottom > 0) heroTransitionComplete = false;
  const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
  const raw = -rect.top / travel;
  const progress = Math.min(1, Math.max(0, raw));
  const jcsActive = progress > jcsScrollStart;
  Object.values(monogramSources).forEach((source) => {
    if (!source) return;
    source.style.opacity = jcsActive ? "0" : "";
    source.style.color = jcsActive ? "transparent" : "";
    source.style.webkitTextStroke = jcsActive ? "0 transparent" : "";
  });
  document.documentElement.style.setProperty("--hero-progress", progress.toFixed(3));
  const wasJcsActive = hero.classList.contains("scrolling");
  hero.classList.toggle("scrolling", jcsActive);

  // The entry animation can still be moving the title on the first scroll.
  // Capture again after the scrolling state settles it into its final layout.
  if (jcsActive && !wasJcsActive) {
    heroLetterStarts = null;
    captureHeroLetterStarts();
  }

  if (!heroStage) return;
  ensureHeroLetterStarts(progress);
  const letterProgress = smoothstep(jcsScrollStart, 0.6, progress);
  const opacity = jcsActive ? 1 : 0;
  const sFillProgress = jcsActive ? smoothstep(0.08, 0.72, letterProgress) : 0;
  const sStrokeWidth = 2 * (1 - sFillProgress);
  const zoomProgress = smoothstep(0.08, 0.78, progress);
  const isMobile = window.innerWidth < 700;
  const isShortLandscape = window.innerWidth < 860 && window.innerHeight < 560;
  const finalScale = isMobile ? 0.4 : isShortLandscape ? 0.44 : 0.36;
  const cardScale = 1 + (finalScale - 1) * zoomProgress;
  const marqueeOpacity = progress > 0.08 ? 1 : 0;
  heroStage.style.setProperty("--hero-side-opacity", "1");
  heroStage.style.setProperty("--hero-title-opacity", "1");
  heroStage.style.setProperty("--hero-photo-opacity", "1");
  heroStage.style.setProperty("--hero-depth", "0");
  document.documentElement.style.setProperty("--hero-card-scale", cardScale.toFixed(4));
  document.documentElement.style.setProperty("--hero-marquee-opacity", marqueeOpacity.toFixed(3));
  document.documentElement.style.setProperty("--jcs-opacity", opacity.toString());
  document.body.classList.toggle("hero-zoomed", progress > 0.43 && rect.bottom > 0);

  const letterEntries = [
    ["j", monogramLetters.j, monogramSources.j],
    ["c", monogramLetters.c, monogramSources.c],
    ["s", monogramLetters.s, monogramSources.s],
  ];
  const validEntries = letterEntries.filter(([, letter, source]) => letter && source);
  if (validEntries.length !== 3) return;

  const finalSize = window.innerWidth < 700 ? 34 : 48;
  const finalTargets = getMonogramTargets(
    validEntries.map(([, letter]) => letter),
    finalSize
  );
  const logoY = window.innerWidth < 700 ? 18 : 23;
  const targetY = logoY;

  validEntries.forEach(([, letter, source], index) => {
    const sourceRect = source.getBoundingClientRect();
    const start = heroLetterStarts?.[index];
    const startSize = start?.fontSize || Number.parseFloat(getComputedStyle(source).fontSize) || finalSize;
    const currentSize = startSize + (finalSize - startSize) * letterProgress;
    const startX = start?.x ?? sourceRect.left;
    const startY = start?.y ?? sourceRect.top;
    const endX = finalTargets[index];
    const endY = targetY;
    const currentX = startX + (endX - startX) * letterProgress;
    const currentY = startY + (endY - startY) * letterProgress;
    letter.style.setProperty("--jcs-size", `${currentSize.toFixed(2)}px`);
    letter.style.setProperty("--jcs-x", `${currentX.toFixed(2)}px`);
    letter.style.setProperty("--jcs-y", `${currentY.toFixed(2)}px`);
    if (index === 2) {
      letter.style.setProperty("--jcs-s-fill", sFillProgress.toFixed(3));
      letter.style.setProperty("--jcs-s-stroke", `${sStrokeWidth.toFixed(2)}px`);
    }
  });

  if (progress >= 0.999 && rect.bottom <= 0) heroTransitionComplete = true;
};

const updateChapterProgress = () => {
  if (hasNativeChapterTimeline) return;

  chapters.forEach((chapter) => {
    const maxShift = chapterTravel.get(chapter) || window.innerWidth * 0.22;
    const rect = chapter.getBoundingClientRect();
    const progress = smoothstep(window.innerHeight, -rect.height, rect.top);
    if (Math.abs(progress - (chapterLastProgress.get(chapter) ?? -1)) <= 0.0001) return;
    chapterLastProgress.set(chapter, progress);

    const shift = -maxShift + progress * maxShift * 2;
    const mobileBaton = window.innerWidth < 700;
    const batonWidth = mobileBaton
      ? Math.min(72, Math.max(40, window.innerWidth * 0.16))
      : Math.min(116, Math.max(44, window.innerWidth * 0.07));
    const batonShift = -batonWidth * 1.4 + progress * (window.innerWidth + batonWidth * 2.8);
    const batonScale = 0.55 + Math.sin(progress * Math.PI) * 0.9;
    const batonOpacity = Math.min(1, progress / 0.16, (1 - progress) / 0.16);
    chapter.style.setProperty("--chapter-shift", `${shift.toFixed(2)}px`);
    chapter.style.setProperty("--baton-shift", `${batonShift.toFixed(2)}px`);
    chapter.style.setProperty("--baton-scale", batonScale.toFixed(3));
    chapter.style.setProperty("--baton-opacity", Math.max(0, batonOpacity).toFixed(3));
  });
};

const updateTheme = () => {
  if (!themeSections.length) return;

  const centeredElement = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  const centeredSection = centeredElement?.closest("main > section, .curtain-sequence > section");
  if (centeredSection) activeThemeSection = centeredSection;
  const activeSection = activeThemeSection || themeSections[0];

  const theme = sectionTheme(activeSection);
  const isDark = theme === "dark";
  const isFinal = theme === "final";
  let darkness = isDark ? 1 : 0;
  let finalness = isFinal ? 1 : 0;
  if (window.scrollY < window.innerHeight * 0.9) darkness = 0;
  if (window.scrollY < window.innerHeight * 0.9) finalness = 0;

  const themeState = `${darkness}:${finalness}`;
  if (themeState === lastAppliedThemeState) return;
  lastAppliedThemeState = themeState;

  document.documentElement.style.setProperty("--darkness", darkness.toFixed(3));
  document.documentElement.style.setProperty("--finalness", finalness.toFixed(3));
  document.body.classList.toggle("theme-dark", darkness === 1);
  document.body.classList.toggle("theme-final", finalness === 1);
  document.body.classList.toggle("theme-light", darkness === 0 && finalness === 0);
};

const smoothstep = (edge0, edge1, value) => {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};

if (storySlides.length) {
  activateStorySlide(document.querySelector(".story-slide.active") || storySlides[0]);

  if (window.matchMedia("(max-width: 860px)").matches) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) activateStorySlide(visible.target);
      },
      {
        rootMargin: "-28% 0px -32% 0px",
        threshold: [0.22, 0.38, 0.56, 0.72],
      }
    );

    storySlides.forEach((slide) => storyObserver.observe(slide));
  }
}

imageCards.forEach((card) => {
  const img = card.querySelector("img");
  if (!img) return;

  const label = img.dataset.src ? `Add ${img.dataset.src.split("/").pop()}` : "Add photo";
  card.dataset.photoLabel = label;
  img.addEventListener("load", () => card.classList.add("loaded"));
  img.addEventListener("error", () => {
    img.removeAttribute("src");
    img.removeAttribute("srcset");
    card.classList.remove("loaded");
  });
  if (img.complete && img.naturalWidth) card.classList.add("loaded");
});

let activeLayerIndex = 2;
let layerIsLifted = false;
let layerMotionFrame = 0;
let layerMotionTime = 0;
let layerHoverFrame = 0;
let pendingLayerPointer = null;
const usesCoarseLayerPointer = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;
const mobileProjectMedia = window.matchMedia("(max-width: 860px)");
const isMobileProjectMode = () => mobileProjectMedia.matches;
const layerMotion = layerCards.map(() => ({
  x: 0,
  velocityX: 0,
  y: 0,
  velocityY: 0,
  scale: 0,
  velocityScale: 0,
  rotation: 0,
  velocityRotation: 0,
  targetX: 0,
  targetY: 0,
  targetScale: 0,
  targetRotation: 0,
  layoutX: 0,
  layoutY: 0,
  layoutScale: 0,
  layoutRotation: 0,
  response: 1,
}));

const getLayerFanScales = () => (
  window.innerWidth <= 860
    ? [0.94, 0.97, 1, 0.97, 0.94]
    : [0.92, 0.96, 1, 0.96, 0.92]
);

const getLayerFanRotations = () => [-8, -4, 0, 4, 8];

const applyLayerMotion = () => {
  layerCards.forEach((card, index) => {
    const state = layerMotion[index];
    card.style.setProperty("--motion-x", `${state.x.toFixed(2)}px`);
    card.style.setProperty("--motion-y", `${state.y.toFixed(2)}px`);
    card.style.setProperty("--motion-rotate", `${state.rotation.toFixed(3)}deg`);
    card.style.setProperty("--scale-boost", state.scale.toFixed(4));
  });
};

const springLayerValue = (
  state,
  valueKey,
  velocityKey,
  targetKey,
  stiffness,
  damping,
  maxVelocity,
  delta
) => {
  const value = state[valueKey];
  const velocity = state[velocityKey];
  const acceleration = (state[targetKey] - value) * stiffness - velocity * damping;
  state[velocityKey] = Math.max(
    -maxVelocity,
    Math.min(maxVelocity, velocity + acceleration * delta)
  );
  state[valueKey] = value + state[velocityKey] * delta;

  if (Math.abs(state[targetKey] - state[valueKey]) < 0.01 && Math.abs(state[velocityKey]) < 0.01) {
    state[valueKey] = state[targetKey];
    state[velocityKey] = 0;
    return false;
  }

  return true;
};

const animateLayerMotion = (time) => {
  layerMotionFrame = 0;
  const delta = Math.min(0.032, Math.max(0.008, layerMotionTime ? (time - layerMotionTime) / 1000 : 0.016));
  let moving = false;

  layerMotion.forEach((state) => {
    const response = state.response;
    const responseRoot = Math.sqrt(response);
    moving = springLayerValue(state, "x", "velocityX", "targetX", 190 * response, 20.5 * responseRoot, 920, delta) || moving;
    moving = springLayerValue(state, "y", "velocityY", "targetY", 210 * response, 22 * responseRoot, 320, delta) || moving;
    moving = springLayerValue(state, "scale", "velocityScale", "targetScale", 240 * response, 23 * responseRoot, 1.8, delta) || moving;
    moving = springLayerValue(state, "rotation", "velocityRotation", "targetRotation", 180 * response, 19 * responseRoot, 24, delta) || moving;
  });

  applyLayerMotion();
  layerMotionTime = time;

  if (moving) {
    layerMotionFrame = requestAnimationFrame(animateLayerMotion);
  } else {
    layerMotionTime = 0;
  }
};

const requestLayerMotion = () => {
  if (layerMotionFrame || !projectStack?.classList.contains("layers-physics")) return;
  layerMotionFrame = requestAnimationFrame(animateLayerMotion);
};

const enableLayerPhysics = () => {
  if (!projectStack || projectStack.classList.contains("layers-physics")) return;
  projectStack.classList.add("layers-physics");
  layerMotion.forEach((state) => {
    state.x = state.targetX;
    state.y = state.targetY;
    state.scale = state.targetScale;
    state.rotation = state.targetRotation;
    state.velocityX = 0;
    state.velocityY = 0;
    state.velocityScale = 0;
    state.velocityRotation = 0;
  });
  applyLayerMotion();
};

const setActiveLayer = (index, { lift = true } = {}) => {
  if (!projectStack || !layerCards.length) return;
  const previousActiveIndex = activeLayerIndex;
  activeLayerIndex = Math.min(layerCards.length - 1, Math.max(0, index));
  const activeChanged = activeLayerIndex !== previousActiveIndex;
  layerIsLifted = lift;
  projectStack.classList.add("has-layer-focus");
  const coarsePointer = usesCoarseLayerPointer();
  const desktopInteraction = !coarsePointer && !isMobileProjectMode();
  const fanScales = getLayerFanScales();
  const fanRotations = getLayerFanRotations();
  const activeScale = desktopInteraction ? (lift ? 1.075 : 1) : 1.01;
  const desktopPush = Math.min(78, Math.max(56, window.innerWidth * 0.055));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  layerCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === activeLayerIndex;
    const distance = Math.abs(cardIndex - activeLayerIndex);
    const direction = cardIndex < activeLayerIndex ? -1 : 1;
    const push = desktopInteraction
      ? desktopPush * Math.pow(0.62, Math.max(0, distance - 1))
      : (10 + distance * 6);
    const nudge = isActive ? 0 : direction * push;
    card.classList.toggle("is-layer-active", isActive);
    card.setAttribute("aria-pressed", isActive ? "true" : "false");
    card.style.zIndex = String(isActive ? 50 : 40 - distance * 5);
    card.style.setProperty("--layer-nudge", `${nudge}px`);

    const state = layerMotion[cardIndex];
    const baseRotation = fanRotations[cardIndex] || 0;
    const outwardRotation = desktopInteraction
      ? (isActive ? -baseRotation * 0.1 : direction * (1.15 / Math.max(1, distance)))
      : (isActive ? 0 : direction * Math.min(0.8, 0.32 + distance * 0.12));
    state.layoutX = nudge;
    state.layoutY = lift
      ? (isActive ? (desktopInteraction ? -18 : -4) : (desktopInteraction && distance === 1 ? 3 : 0))
      : 0;
    state.layoutScale = lift
      ? (isActive
        ? activeScale - fanScales[cardIndex]
        : (desktopInteraction ? -Math.max(0, 0.01 - distance * 0.002) : 0))
      : 0;
    state.layoutRotation = lift ? outwardRotation : 0;
    state.response = isActive ? 1.05 : Math.max(0.68, 0.92 - distance * 0.07);
    state.targetX = state.layoutX;
    state.targetY = state.layoutY;
    state.targetScale = state.layoutScale;
    state.targetRotation = state.layoutRotation;

    if (activeChanged && projectStack.classList.contains("layers-physics")) {
      state.velocityX *= 0.92;
      state.velocityY *= 0.92;
      state.velocityScale *= 0.92;
      state.velocityRotation *= 0.92;
    }

    if (reducedMotion && projectStack.classList.contains("layers-physics")) {
      state.x = state.targetX;
      state.y = state.targetY;
      state.scale = state.targetScale;
      state.rotation = state.targetRotation;
      state.velocityX = 0;
      state.velocityY = 0;
      state.velocityScale = 0;
      state.velocityRotation = 0;
    }
  });

  if (reducedMotion) applyLayerMotion();
  else requestLayerMotion();
};

if (projectStack && layerCards.length) {
  setActiveLayer(2, { lift: false });

  const unfoldLayers = () => {
    if (projectStack.classList.contains("layers-staged")) return;
    projectStack.classList.add("layers-staged");

    if (isMobileProjectMode()) {
      projectStack.classList.add("layers-unfolded", "layers-ready");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      projectStack.classList.add("layers-unfolded", "layers-ready");
      enableLayerPhysics();
      return;
    }

    window.setTimeout(() => projectStack.classList.add("layers-unfolded"), 520);
    window.setTimeout(() => {
      projectStack.classList.add("layers-ready");
      enableLayerPhysics();
    }, 1650);
  };

  const layerIntroObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      unfoldLayers();
      observer.disconnect();
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -8% 0px",
    }
  );
  layerIntroObserver.observe(projectStack);

  layerCards.forEach((card, index) => {
    card.addEventListener("pointerdown", () => {
      if (!usesCoarseLayerPointer() || isMobileProjectMode()) return;
      card.dataset.tapStartedActive = String(activeLayerIndex === index);
      if (activeLayerIndex !== index) setActiveLayer(index);
    }, { capture: true });
    card.addEventListener("click", (event) => {
      if (!usesCoarseLayerPointer() || isMobileProjectMode()) return;
      if (event.detail === 0) return;
      const startedActive = card.dataset.tapStartedActive === "true";
      delete card.dataset.tapStartedActive;
      if (startedActive) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, { capture: true });
    card.addEventListener("focus", () => {
      if (!isMobileProjectMode()) setActiveLayer(index);
    });
  });

  const settleLayerPointerInfluence = () => {
    layerMotion.forEach((state) => {
      state.targetX = state.layoutX;
      state.targetY = state.layoutY;
      state.targetScale = state.layoutScale;
      state.targetRotation = state.layoutRotation;
    });
    requestLayerMotion();
  };

  const applyLayerPointerInfluence = (pointerRatio, pointerY, centerY, cardHeight, positions) => {
    const activePosition = positions[activeLayerIndex];
    const horizontalRange = window.innerWidth <= 860 ? 0.11 : 0.13;
    const pointerX = Math.max(-1, Math.min(1, (pointerRatio - activePosition) / horizontalRange));
    const pointerVertical = Math.max(-1, Math.min(1, (pointerY - centerY) / Math.max(1, cardHeight * 0.5)));

    layerMotion.forEach((state, index) => {
      const distance = Math.abs(index - activeLayerIndex);
      const isActive = index === activeLayerIndex;
      const connection = isActive ? 1 : 0.24 / Math.max(1, distance);
      state.targetX = state.layoutX + pointerX * 7 * connection;
      state.targetY = state.layoutY + pointerVertical * 5 * connection;
      state.targetScale = state.layoutScale + (isActive ? 0.006 : 0);
      state.targetRotation = state.layoutRotation + pointerX * (isActive ? 1.15 : 0.32 * connection);
    });
    requestLayerMotion();
  };

  const selectLayerFromPointer = () => {
    layerHoverFrame = 0;
    if (!pendingLayerPointer || usesCoarseLayerPointer() || !projectStack.classList.contains("layers-ready")) return;

    const rect = projectStack.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const cardHeight = layerCards[2]?.offsetHeight || rect.height * 0.7;
    if (Math.abs(pendingLayerPointer.y - centerY) > cardHeight * 0.6) {
      settleLayerPointerInfluence();
      return;
    }

    const positions = window.innerWidth <= 860
      ? [-0.22, -0.11, 0, 0.11, 0.22]
      : [-0.27, -0.14, 0, 0.14, 0.27];
    const pointerRatio = (pendingLayerPointer.x - rect.left) / Math.max(1, rect.width) - 0.5;
    let candidate = activeLayerIndex;
    let candidateDistance = Number.POSITIVE_INFINITY;

    positions.forEach((position, index) => {
      const distance = Math.abs(pointerRatio - position);
      if (distance < candidateDistance) {
        candidate = index;
        candidateDistance = distance;
      }
    });

    const activeDistance = Math.abs(pointerRatio - positions[activeLayerIndex]);
    const hasMovedBeyondActiveZone = candidateDistance + 0.012 < activeDistance;
    if (candidate !== activeLayerIndex && hasMovedBeyondActiveZone) setActiveLayer(candidate);

    if (candidate === activeLayerIndex && !layerIsLifted) {
      setActiveLayer(activeLayerIndex);
    }

    applyLayerPointerInfluence(
      pointerRatio,
      pendingLayerPointer.y,
      centerY,
      cardHeight,
      positions
    );
  };

  projectStack.addEventListener("pointermove", (event) => {
    if (usesCoarseLayerPointer() || isMobileProjectMode()) return;
    pendingLayerPointer = {
      x: event.clientX,
      y: event.clientY,
    };
    if (!layerHoverFrame) layerHoverFrame = requestAnimationFrame(selectLayerFromPointer);
  }, { passive: true });

  projectStack.addEventListener("pointerleave", () => {
    if (usesCoarseLayerPointer() || isMobileProjectMode()) return;
    pendingLayerPointer = null;
    if (layerHoverFrame) cancelAnimationFrame(layerHoverFrame);
    layerHoverFrame = 0;
    setActiveLayer(2, { lift: false });
  });

}

let mobileProjectActiveIndex = 2;
let mobileProjectVisualFrame = 0;
let mobileProjectSettleTimer = 0;

const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

const mobileProjectMaxScroll = () => Math.max(0, projectStack.scrollWidth - projectStack.clientWidth);

const mobileProjectTarget = (card) => clampValue(
  card.offsetLeft - (projectStack.clientWidth - card.offsetWidth) / 2,
  0,
  mobileProjectMaxScroll()
);

const updateMobileProjectDots = (index) => {
  mobileProjectActiveIndex = index;
  if (!projectSnapDots) return;

  Array.from(projectSnapDots.children).forEach((dot, dotIndex) => {
    const active = dotIndex === index;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });
};

const updateMobileProjectVisuals = () => {
  mobileProjectVisualFrame = 0;
  if (!projectStack || !isMobileProjectMode()) return;

  const viewportCenter = projectStack.scrollLeft + projectStack.clientWidth / 2;
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  layerCards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = clampValue((cardCenter - viewportCenter) / projectStack.clientWidth, -1, 1);
    const absoluteDistance = Math.abs(cardCenter - viewportCenter);
    card.style.setProperty("--mobile-distance", distance.toFixed(4));
    card.style.setProperty("--mobile-abs-distance", Math.abs(distance).toFixed(4));
    card.style.setProperty("--mobile-lean", "0deg");

    if (absoluteDistance < nearestDistance) {
      nearest = index;
      nearestDistance = absoluteDistance;
    }
  });

  layerCards.forEach((card, index) => {
    const active = index === nearest;
    card.classList.toggle("is-layer-active", active);
    card.setAttribute("aria-pressed", active ? "true" : "false");
  });
  updateMobileProjectDots(nearest);
};

const requestMobileProjectVisuals = () => {
  if (mobileProjectVisualFrame) return;
  mobileProjectVisualFrame = requestAnimationFrame(updateMobileProjectVisuals);
};

const scrollMobileProjectTo = (index, behavior = "smooth") => {
  if (!projectStack || !isMobileProjectMode()) return;
  const target = mobileProjectTarget(layerCards[index]);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const resolvedBehavior = reducedMotion ? "auto" : behavior;
  window.clearTimeout(mobileProjectSettleTimer);
  projectStack.classList.add("mobile-project-scrolling");
  updateMobileProjectDots(index);

  if (resolvedBehavior === "auto") {
    projectStack.scrollLeft = target;
    requestAnimationFrame(() => {
      projectStack.classList.remove("mobile-project-scrolling");
      updateMobileProjectVisuals();
    });
    return;
  }

  projectStack.scrollTo({ left: target, behavior: "smooth" });
  mobileProjectSettleTimer = window.setTimeout(() => {
    projectStack.scrollLeft = target;
    projectStack.classList.remove("mobile-project-scrolling");
    updateMobileProjectVisuals();
  }, 520);
};

if (projectStack && layerCards.length && projectSnapDots) {
  layerCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => scrollMobileProjectTo(index));
    projectSnapDots.appendChild(dot);
  });
  projectStack.addEventListener("scroll", () => {
    if (!projectStack.classList.contains("mobile-project-scrolling")) {
      requestMobileProjectVisuals();
    }
  }, { passive: true });

  const configureMobileProjects = () => {
    if (isMobileProjectMode()) {
      projectStack.classList.add("mobile-project-carousel", "layers-staged", "layers-unfolded", "layers-ready");
      requestAnimationFrame(() => scrollMobileProjectTo(mobileProjectActiveIndex, "auto"));
      return;
    }

    projectStack.classList.remove("mobile-project-carousel");
    projectStack.scrollLeft = 0;
    layerCards.forEach((card) => {
      card.style.removeProperty("--mobile-distance");
      card.style.removeProperty("--mobile-abs-distance");
      card.style.removeProperty("--mobile-lean");
    });
    setActiveLayer(2, { lift: false });
  };

  mobileProjectMedia.addEventListener?.("change", configureMobileProjects);
  configureMobileProjects();
}

const resetProjectInteractionState = () => {
  if (!projectStack || !layerCards.length) return;

  pendingLayerPointer = null;
  if (layerHoverFrame) cancelAnimationFrame(layerHoverFrame);
  layerHoverFrame = 0;
  layerCards.forEach((card) => delete card.dataset.tapStartedActive);

  if (isMobileProjectMode()) {
    window.clearTimeout(mobileProjectSettleTimer);
    mobileProjectSettleTimer = 0;
    projectStack.classList.remove("mobile-project-scrolling");
    if (mobileProjectVisualFrame) cancelAnimationFrame(mobileProjectVisualFrame);
    mobileProjectVisualFrame = 0;
    updateMobileProjectVisuals();
    return;
  }

  if (layerMotionFrame) cancelAnimationFrame(layerMotionFrame);
  layerMotionFrame = 0;
  layerMotionTime = 0;
  setActiveLayer(2, { lift: false });
};

window.addEventListener("blur", resetProjectInteractionState);
document.addEventListener("visibilitychange", resetProjectInteractionState);

let lastDetailTrigger = null;

const openDetail = (card) => {
  if (!detailView || !detailImage || !detailLabel || !detailTitle || !detailCopy) return;

  lastDetailTrigger = card;
  detailView.classList.remove("marihacks-detail", "optimath-detail", "speedcube-detail");
  if (card.dataset.detailClass) detailView.classList.add(card.dataset.detailClass);
  detailImage.src = card.dataset.detailImage || "";
  detailImage.alt = card.querySelector("img")?.alt || card.dataset.detailTitle || "";
  detailLabel.textContent = card.dataset.detailLabel || "";
  if (card.dataset.detailTitle === "Montreal competitions") {
    detailTitle.innerHTML = '<span>Montreal</span><span class="detail-title-competition">competitions</span>';
  } else {
    detailTitle.textContent = card.dataset.detailTitle || "";
  }
  detailCopy.textContent = card.dataset.detailCopy || "";
  if (detailLink) {
    const link = card.dataset.detailLink || "";
    detailLink.hidden = !link;
    if (link) {
      detailLink.href = link;
      detailLink.textContent = card.dataset.detailLinkLabel || "View project";
    } else {
      detailLink.removeAttribute("href");
      detailLink.textContent = "";
    }
  }
  detailView.classList.add("open");
  detailView.setAttribute("aria-hidden", "false");
  document.body.classList.add("detail-open");
  smoothScroller?.stop();
  requestAnimationFrame(() => detailClose?.focus());
};

const closeDetail = () => {
  if (!detailView) return;

  detailView.classList.remove("open");
  detailView.classList.remove("marihacks-detail", "optimath-detail", "speedcube-detail");
  detailView.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
  smoothScroller?.start();
  lastDetailTrigger?.focus();
};

detailCards.forEach((card) => {
  card.addEventListener("click", () => {
    openDetail(card);
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail(card);
    }
  });
});

detailView?.addEventListener("click", (event) => {
  if (event.target === detailView) closeDetail();
});

detailClose?.addEventListener("click", closeDetail);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && detailView?.classList.contains("open")) closeDetail();
});

let scrollFrame = 0;
const requestScrollUpdate = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updateScroll();
  });
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", () => {
  heroTransitionComplete = false;
  const viewportWidthChanged = document.documentElement.clientWidth !== viewportWidth;
  updateViewportWidth();
  updateMobileHeroLayout();
  updateHeroMarqueeWidths();
  updateChapterTravel();
  updateTimelineMetrics();
  updateStoryMetrics();
  if (viewportWidthChanged || !isMobileProjectMode()) {
    updateCurtainMetrics();
    updateVolunteerStoryMetrics();
  }
  requestScrollUpdate();
  if (projectStack && isMobileProjectMode()) {
    if (viewportWidthChanged) {
      requestAnimationFrame(() => scrollMobileProjectTo(mobileProjectActiveIndex, "auto"));
    }
  } else if (projectStack) {
    setActiveLayer(activeLayerIndex, { lift: layerIsLifted });
  }
  if (!highlightBlocks.length || (!viewportWidthChanged && isMobileProjectMode())) return;
  window.clearTimeout(highlightResizeTimer);
  highlightResizeTimer = window.setTimeout(() => {
    highlightBlocks.forEach(splitHighlightLines);
    updateHighlights();
  }, 120);
});
highlightBlocks.forEach(splitHighlightLines);
updateViewportWidth();
updateMobileHeroLayout();
updateChapterTravel();
updateTimelineMetrics();
updateCurtainMetrics();
updateStoryMetrics();
updateVolunteerStoryMetrics();
document.fonts?.ready.then(() => {
  updateMobileHeroLayout();
  updateHeroMarqueeWidths();
  updateChapterTravel();
  updateTimelineMetrics();
  updateCurtainMetrics();
  updateStoryMetrics();
  updateVolunteerStoryMetrics();
  updateVolunteerStory();
  scrollTriggerRuntime?.refresh();
});
updateScroll();
requestAnimationFrame(() => document.documentElement.classList.remove("is-booting"));

const initializeScrollEntrances = () => {
  if (!gsapRuntime || !scrollTriggerRuntime) return;

  const slides = Array.from(storySlides);
  const resultItems = Array.from(document.querySelectorAll(".result-item"));
  const socialLinks = Array.from(document.querySelectorAll(".footer-socials a"));
  const footerEmail = document.querySelector(".footer-email");
  const footer = document.querySelector(".site-footer");

  slides.forEach((slide) => slide.classList.add("visible"));
  resultItems.forEach((item) => item.classList.add("visible"));

  if (reducedMotionQuery.matches) {
    gsapRuntime.set([
      ...slides.map((slide) => slide.querySelector(".story-window")),
      ...slides.map((slide) => slide.querySelector(".story-text")),
      ...resultItems,
      ...socialLinks,
      footerEmail,
    ].filter(Boolean), { clearProps: "all" });
    return;
  }

  const addFadingRow = (timeline, targets, position) => {
    timeline.to(targets, {
      autoAlpha: 1,
      duration: 0.58,
      ease: "power2.out",
    }, position);
  };

  const motionMedia = gsapRuntime.matchMedia();

  motionMedia.add("(min-width: 861px)", () => {
    const firstRow = slides.slice(0, 3).map((slide) => slide.querySelector(".story-window"));
    const secondRow = slides.slice(3).map((slide) => slide.querySelector(".story-window"));
    const descriptions = slides.map((slide) => slide.querySelector(".story-text"));
    const allWindows = [...firstRow, ...secondRow];

    gsapRuntime.set(allWindows, {
      autoAlpha: 0,
      force3D: true,
      willChange: "opacity",
    });
    gsapRuntime.set(descriptions, { autoAlpha: 0, force3D: true, willChange: "opacity" });

    const timeline = gsapRuntime.timeline({
      defaults: { overwrite: "auto" },
      scrollTrigger: {
        trigger: storyTrack,
        start: "top 78%",
        once: true,
      },
    });

    addFadingRow(timeline, firstRow, 0);
    addFadingRow(timeline, secondRow, ">");
    timeline
      .to(descriptions, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
      }, ">")
      .set([...allWindows, ...descriptions], { clearProps: "transform,opacity,visibility,willChange" });

    return () => timeline.kill();
  });

  motionMedia.add("(max-width: 860px)", () => {
    const animations = slides.map((slide) => {
      const windowElement = slide.querySelector(".story-window");
      const description = slide.querySelector(".story-text");
      const timeline = gsapRuntime.timeline({
        scrollTrigger: {
          trigger: slide,
          start: "top 84%",
          once: true,
        },
      });

      timeline
        .fromTo(windowElement, {
          autoAlpha: 0,
          willChange: "opacity",
        }, {
          autoAlpha: 1,
          duration: 0.58,
          ease: "power2.out",
        })
        .fromTo(description, {
          autoAlpha: 0,
          willChange: "opacity",
        }, {
          autoAlpha: 1,
          duration: 0.46,
          ease: "power2.out",
        }, ">")
        .set([windowElement, description], { clearProps: "transform,opacity,visibility,willChange" });

      return timeline;
    });

    return () => animations.forEach((animation) => animation.kill());
  });

  resultItems.forEach((item) => {
    gsapRuntime.fromTo(item, {
      autoAlpha: 0,
      y: 30,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        once: true,
      },
    });
  });

  if (footer && socialLinks.length >= 2 && footerEmail) {
    const [githubLink, linkedInLink] = socialLinks;
    const travel = () => Math.min(window.innerWidth * 0.42, 560);
    const collisionGithub = () => (22 + linkedInLink.offsetWidth) / 2;
    const collisionLinkedIn = () => -(22 + githubLink.offsetWidth) / 2;
    gsapRuntime.set(footerEmail, { autoAlpha: 0, y: 28 });
    const footerTimeline = gsapRuntime.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 96%",
        once: true,
        invalidateOnRefresh: true,
      },
    });

    footerTimeline
      .fromTo(githubLink, {
        autoAlpha: 0,
        x: () => -travel(),
        rotation: -6,
      }, {
        autoAlpha: 1,
        x: collisionGithub,
        rotation: 2,
        duration: 0.72,
        ease: "power3.in",
      }, 0)
      .fromTo(linkedInLink, {
        autoAlpha: 0,
        x: travel,
        rotation: 6,
      }, {
        autoAlpha: 1,
        x: collisionLinkedIn,
        rotation: -2,
        duration: 0.72,
        ease: "power3.in",
      }, 0)
      .to([githubLink, linkedInLink], {
        scaleX: 1.18,
        scaleY: 0.8,
        duration: 0.09,
        ease: "power2.out",
      }, ">")
      .to([githubLink, linkedInLink], {
        scaleX: 0.94,
        scaleY: 1.12,
        duration: 0.11,
        ease: "power2.out",
      }, ">")
      .to(githubLink, {
        x: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.68,
        ease: "elastic.out(1, 0.55)",
      }, ">")
      .to(linkedInLink, {
        x: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.68,
        ease: "elastic.out(1, 0.55)",
      }, "<")
      .to(footerEmail, {
        autoAlpha: 1,
        y: 0,
        duration: 0.48,
        ease: "power3.out",
      }, "<0.08")
      .set([githubLink, linkedInLink, footerEmail], { clearProps: "transform,opacity,visibility" });
  }

  scrollTriggerRuntime.refresh();
};

let scrollEntrancesInitialized = false;
const initializeScrollEntrancesAfterReset = () => {
  if (scrollEntrancesInitialized) return;
  returnToFirstSection();

  const finishInitialization = () => {
    if (scrollEntrancesInitialized) return;
    returnToFirstSection();
    scrollTriggerRuntime?.clearScrollMemory?.("manual");
    scrollEntrancesInitialized = true;
    initializeScrollEntrances();
    document.documentElement.classList.add("scroll-entrances-ready");
  };

  requestAnimationFrame(() => {
    returnToFirstSection();
    requestAnimationFrame(finishInitialization);
  });

  window.setTimeout(finishInitialization, 160);
};

initializeScrollEntrancesAfterReset();

let activeStoryWindow = null;
const lensRadius = 112;
const trailState = new WeakMap();

const setStoryLens = (windowEl, x, y) => {
  windowEl.style.setProperty("--mx", `${x.toFixed(2)}px`);
  windowEl.style.setProperty("--my", `${y.toFixed(2)}px`);
};

const getTrailState = (windowEl) => {
  let state = trailState.get(windowEl);
  if (state) return state;

  const canvas = document.createElement("canvas");
  canvas.className = "reveal-canvas";
  canvas.setAttribute("aria-hidden", "true");
  windowEl.appendChild(canvas);

  const mask = document.createElement("canvas");

  state = {
    canvas,
    context: canvas.getContext("2d"),
    mask,
    maskContext: mask.getContext("2d"),
    sourceImage: windowEl.querySelector(":scope > img"),
    lastX: Number.NaN,
    lastY: Number.NaN,
    lastBrush: 82,
    lastTime: 0,
    strokes: [],
    animating: false,
    width: 0,
    height: 0,
  };
  trailState.set(windowEl, state);
  return state;
};

const resizeTrailCanvas = (windowEl, state) => {
  const rect = windowEl.getBoundingClientRect();
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(rect.width * scale));
  const height = Math.max(1, Math.round(rect.height * scale));

  if (state.width === width && state.height === height) return { rect, scale };

  state.width = width;
  state.height = height;
  state.canvas.width = width;
  state.canvas.height = height;
  state.mask.width = width;
  state.mask.height = height;
  state.canvas.style.width = `${rect.width}px`;
  state.canvas.style.height = `${rect.height}px`;
  return { rect, scale };
};

const getObjectPosition = (image) => {
  const [rawX = "50%", rawY = "50%"] = getComputedStyle(image).objectPosition.split(" ");
  const parse = (value) => {
    if (value.endsWith("%")) return Number.parseFloat(value) / 100;
    return 0.5;
  };
  return { x: parse(rawX), y: parse(rawY) };
};

const drawImageCover = (context, image, width, height) => {
  if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return;

  const position = getObjectPosition(image);
  const zoom = 1.02;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const x = (width - drawWidth) * position.x;
  const y = (height - drawHeight) * position.y;
  context.drawImage(image, x, y, drawWidth, drawHeight);
};

const drawTrailMask = (state, now = performance.now()) => {
  const { maskContext, width, height, strokes } = state;
  if (!maskContext || !width || !height) return;

  maskContext.clearRect(0, 0, width, height);
  maskContext.save();
  maskContext.globalCompositeOperation = "source-over";
  maskContext.strokeStyle = "rgba(255, 255, 255, 1)";
  maskContext.fillStyle = "rgba(255, 255, 255, 1)";
  maskContext.lineCap = "round";
  maskContext.lineJoin = "round";

  state.strokes = strokes.filter((stroke) => now - stroke.created < stroke.life);

  state.strokes.forEach((stroke) => {
    const age = Math.min(1, Math.max(0, (now - stroke.created) / stroke.life));
    const ease = 1 - age * age * (3 - 2 * age);
    const widthNow = Math.max(0, stroke.width * ease);
    if (widthNow < 1) return;

    maskContext.lineWidth = widthNow;
    maskContext.beginPath();
    maskContext.moveTo(stroke.x1, stroke.y1);
    maskContext.quadraticCurveTo(stroke.cx, stroke.cy, stroke.x2, stroke.y2);
    maskContext.stroke();
  });

  maskContext.restore();
};

const renderTrail = (state, now = performance.now()) => {
  const { context, maskContext, sourceImage, width, height } = state;
  if (!context || !maskContext || !sourceImage || !width || !height) return;

  drawTrailMask(state, now);
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "source-over";
  drawImageCover(context, sourceImage, width, height);
  context.globalCompositeOperation = "destination-in";
  context.drawImage(state.mask, 0, 0);
  context.globalCompositeOperation = "source-over";
};

const animateTrail = (state) => {
  if (state.animating) return;
  state.animating = true;
  const step = () => {
    renderTrail(state);
    if (!state.strokes.length && Number.isNaN(state.lastX)) {
      renderTrail(state);
      state.animating = false;
      return;
    }

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const addTrailStroke = (windowEl, x, y, force = false) => {
  const state = getTrailState(windowEl);
  const now = performance.now();
  const { scale } = resizeTrailCanvas(windowEl, state);
  const sx = x * scale;
  const sy = y * scale;
  const distance = Number.isNaN(state.lastX) ? Number.POSITIVE_INFINITY : Math.hypot(sx - state.lastX, sy - state.lastY);

  if (!force && distance < 9 * scale && now - state.lastTime < 14) return;

  const isDesktop = window.matchMedia("(pointer: fine)").matches;
  const speed = Number.isFinite(distance) ? Math.min(1, distance / (165 * scale)) : 0.18;
  const baseBrush = isDesktop ? 122 : 102;
  const speedBoost = isDesktop ? 70 : 54;
  const targetBrush = (baseBrush + speed * speedBoost) * scale;
  const brush = force ? targetBrush : state.lastBrush + (targetBrush - state.lastBrush) * 0.42;

  if (Number.isNaN(state.lastX)) {
    state.strokes.push({
      x1: sx - 0.01,
      y1: sy,
      cx: sx,
      cy: sy,
      x2: sx + 0.01,
      y2: sy,
      width: brush * 0.78,
      created: now,
      life: 960,
    });
  } else {
    const dx = sx - state.lastX;
    const dy = sy - state.lastY;
    const curvePull = Math.min(28 * scale, distance * 0.18);
    const normal = Math.hypot(dx, dy) || 1;
    const curve = Math.sin(now * 0.018) * curvePull;
    const cx = (state.lastX + sx) / 2 - (dy / normal) * curve;
    const cy = (state.lastY + sy) / 2 + (dx / normal) * curve;

    state.strokes.push({
      x1: state.lastX,
      y1: state.lastY,
      cx,
      cy,
      x2: sx,
      y2: sy,
      width: brush,
      created: now,
      life: 1280 + speed * 420,
    });
  }
  while (state.strokes.length > 42) state.strokes.shift();
  renderTrail(state);

  state.lastX = sx;
  state.lastY = sy;
  state.lastBrush = brush;
  state.lastTime = now;
  animateTrail(state);
};

const revealStoryWindow = (windowEl, clientX, clientY, forceSpot = false) => {
  if (activeStoryWindow && activeStoryWindow !== windowEl) {
    activeStoryWindow.classList.remove("revealing");
  }

  activeStoryWindow = windowEl;
  activeStoryWindow.classList.add("revealing");
  const rect = windowEl.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  setStoryLens(windowEl, x, y);
  addTrailStroke(windowEl, x, y, forceSpot);
};

const clearStoryReveal = () => {
  if (!activeStoryWindow) return;
  activeStoryWindow.classList.remove("revealing");
  const state = trailState.get(activeStoryWindow);
  if (state) {
    state.lastX = Number.NaN;
    state.lastY = Number.NaN;
    state.lastBrush = 82;
    state.lastTime = 0;
    animateTrail(state);
  }
  activeStoryWindow = null;
};

const getStoryWindowInLens = (clientX, clientY) => {
  let closestWindow = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  storyWindows.forEach((windowEl) => {
    const rect = windowEl.getBoundingClientRect();
    const nearestX = Math.max(rect.left, Math.min(clientX, rect.right));
    const nearestY = Math.max(rect.top, Math.min(clientY, rect.bottom));
    const distance = Math.hypot(clientX - nearestX, clientY - nearestY);

    if (distance <= lensRadius && distance < closestDistance) {
      closestWindow = windowEl;
      closestDistance = distance;
    }
  });

  return closestWindow;
};

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--bgx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--bgy", `${event.clientY}px`);
}, { passive: true });

const applyReactiveMotion = (target, event) => {
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / Math.max(1, rect.width);
  const y = (event.clientY - rect.top) / Math.max(1, rect.height);
  const dx = x - 0.5;
  const dy = y - 0.5;
  const strength = target.classList.contains("skill-group") ? 2.2 : target.classList.contains("education-panel") ? 4 : 2.6;

  target.style.setProperty("--tilt-x", `${(dx * strength).toFixed(2)}deg`);
  target.style.setProperty("--tilt-y", `${(-dy * strength).toFixed(2)}deg`);
  target.style.setProperty("--repel-x", `${(dx * 2).toFixed(2)}px`);
  target.style.setProperty("--repel-y", `${(dy * 2).toFixed(2)}px`);
  target.style.setProperty("--card-x", `${(x * 100).toFixed(1)}%`);
  target.style.setProperty("--card-y", `${(y * 100).toFixed(1)}%`);
};

if (window.matchMedia("(pointer: fine)").matches) {
  reactiveItems.forEach((target) => {
    target.addEventListener("pointermove", (event) => applyReactiveMotion(target, event), { passive: true });
    target.addEventListener("pointerleave", () => {
      target.style.setProperty("--tilt-x", "0deg");
      target.style.setProperty("--tilt-y", "0deg");
      target.style.setProperty("--repel-x", "0px");
      target.style.setProperty("--repel-y", "0px");
    });
  });
}

const storyTapMode = window.matchMedia("(max-width: 860px), (hover: none), (pointer: coarse)");
const storyHoverMode = window.matchMedia("(min-width: 861px) and (hover: hover) and (pointer: fine)");
const storyHoverTimers = new WeakMap();

const setStoryWindowHovered = (windowEl, hovered) => {
  const activeTimer = storyHoverTimers.get(windowEl);
  if (activeTimer) window.clearTimeout(activeTimer);

  if (hovered) {
    storyHoverTimers.delete(windowEl);
    windowEl.classList.add("is-hovered");
    return;
  }

  const timer = window.setTimeout(() => {
    windowEl.classList.remove("is-hovered");
    storyHoverTimers.delete(windowEl);
  }, 120);
  storyHoverTimers.set(windowEl, timer);
};

const clearStoryHoverStates = () => {
  storyWindows.forEach((windowEl) => {
    const activeTimer = storyHoverTimers.get(windowEl);
    if (activeTimer) window.clearTimeout(activeTimer);
    storyHoverTimers.delete(windowEl);
    windowEl.classList.remove("is-hovered");
  });
};

const setStoryWindowRevealed = (windowEl, revealed) => {
  windowEl.classList.toggle("revealing", revealed);
  windowEl.setAttribute("aria-pressed", revealed ? "true" : "false");
};

storyWindows.forEach((windowEl) => {
  windowEl.setAttribute("role", "button");
  windowEl.setAttribute("tabindex", "0");
  windowEl.setAttribute("aria-pressed", "false");

  windowEl.addEventListener("pointerenter", () => {
    if (storyHoverMode.matches) setStoryWindowHovered(windowEl, true);
  });

  windowEl.addEventListener("pointerleave", () => {
    if (storyHoverMode.matches) setStoryWindowHovered(windowEl, false);
  });

  const toggleWindow = () => {
    const nextState = !windowEl.classList.contains("revealing");
    setStoryWindowRevealed(windowEl, nextState);
  };

  windowEl.addEventListener("click", (event) => {
    if (storyTapMode.matches && event.detail !== 0) toggleWindow();
  });

  windowEl.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleWindow();
  });
});

storyTapMode.addEventListener?.("change", () => {
  storyWindows.forEach((windowEl) => setStoryWindowRevealed(windowEl, false));
});

storyHoverMode.addEventListener?.("change", clearStoryHoverStates);
window.addEventListener("blur", clearStoryHoverStates);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearStoryHoverStates();
});
