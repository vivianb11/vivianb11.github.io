//#region MailCopy Handler

function copyEmail(event, email) {
    if (!navigator.clipboard) return; // laisse le mailto: s'ouvrir normalement
    event.preventDefault();
    navigator.clipboard
        .writeText(email)
        .then(TimedPopup)
        .catch(() => (window.location.href = "mailto:" + email));
}

function TimedPopup() {
    // Crée un popup
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
    <div class="popup-content">
    <h4>Email Copied!</h4>
    </div>
    `;

    document.body.appendChild(popup);

    // Fait apparaitre le popup de la top de la page
    popup.style.top = "-100%";
    popup.style.opacity = "0";
    popup.style.transition = "all 0.3s ease-in-out";
    setTimeout(() => {
        popup.style.top = "0";
        popup.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        // Fait disparaitre le popup apres 1.5 secondes
        popup.style.top = "-100%";
        popup.style.opacity = "0";
    }, 1500);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 1700);
}
//#endregion

//#region Deck Handler
document.addEventListener("DOMContentLoaded", function () {
    const decks = document.querySelectorAll(".card-deck");

    decks.forEach(function (deck) {
        const cards = deck.querySelectorAll(".card");
        const triangles = deck.querySelectorAll(".triangle");

        let currentIndex = 0;
        cards[currentIndex].classList.add("active");

        triangles.forEach(function (triangle, index) {
            triangle.addEventListener("click", function () {
                cards[currentIndex].classList.remove("active");
                if (triangle.classList.contains("prev")) {
                    currentIndex =
                        (currentIndex - 1 + cards.length) % cards.length;
                } else if (triangle.classList.contains("next")) {
                    currentIndex = (currentIndex + 1) % cards.length;
                }
                cards[currentIndex].classList.add("active");
            });
        });
    });
});
//#endregion

//#region Video Manager
const videos = document.querySelectorAll("video[data-src], video[src]");
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
).matches;

if (videos.length > 0) {
    const options = {
        root: null,
        rootMargin: "200px",
        threshold: 0.5, // Play video when 50% of it is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                if (video.dataset.src && !video.src) {
                    video.src = video.dataset.src;
                    video.load();
                    video.removeAttribute("data-src");
                }

                if (!reduceMotion) video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, options);

    videos.forEach((video) => {
        observer.observe(video);
    });
}
//#endregion

//#region Project Page Manager
window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("q");

    if (searchTerm) {
        // Split the search term into an array of tags
        const searchTags = searchTerm
            .split(",")
            .map((tag) => tag.trim().toLowerCase());

        // Hide all projects that don't match any of the tags
        animateProjects(searchTags);

        console.log("Filtered projects by tags: " + searchTags.join(", "));
    }
});

function animateProjects(searchTags) {
    const projects = document.querySelectorAll(".item");

    projects.forEach((project) => {
        const projectTags = project.dataset.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase());
        // Check if any of the project's tags match any of the search tags
        const isVisible = projectTags.some((tag) => searchTags.includes(tag));

        if (!isVisible) {
            project.style.transition = "opacity 0.5s ease-in-out";
            project.style.opacity = "0";
            setTimeout(() => {
                project.style.display = "none";
            }, 500);
        } else {
            project.style.opacity = "1";
        }
    });
}
//#endregion

//#region Header Hide On Scroll
// Hides the header when scrolling down, shows it again when scrolling up.
(function () {
    const root = document.documentElement;
    const SHOW_NEAR_TOP = 80; // always visible near the top of the page
    const MIN_DELTA = 8; // ignore tiny scroll jitter
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        const delta = y - lastY;
        const header = document.querySelector("header.site-header");
        const keepVisible =
            y < SHOW_NEAR_TOP || (header && header.contains(document.activeElement));

        if (keepVisible || delta < -MIN_DELTA) {
            root.classList.remove("header-hidden");
            lastY = y;
        } else if (delta > MIN_DELTA) {
            root.classList.add("header-hidden");
            lastY = y;
        }
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        },
        { passive: true },
    );

    // Keyboard users tabbing into the header should see it
    document.addEventListener("focusin", (e) => {
        if (e.target.closest && e.target.closest("header.site-header")) {
            root.classList.remove("header-hidden");
        }
    });
})();
//#endregion

//#region Header Active Section
// Highlights the header link of the section currently on screen (index only).
(function () {
    const sections = ["projects", "aboutme"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    if (!sections.length) return;

    const visible = new Set();
    const update = () => {
        // Last section (in page order) that is on screen wins
        const current = sections.filter((s) => visible.has(s)).pop();
        document
            .querySelectorAll("header.site-header .navbar-menu a")
            .forEach((a) => {
                const id = a.getAttribute("href").split("#")[1];
                a.classList.toggle("is-active", !!current && id === current.id);
            });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) =>
                e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
            );
            update();
        },
        { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    // The header is injected asynchronously; refresh once it exists
    new MutationObserver((_, mo) => {
        if (document.querySelector("header.site-header")) {
            update();
            mo.disconnect();
        }
    }).observe(document.body, { childList: true, subtree: true });
})();
//#endregion
