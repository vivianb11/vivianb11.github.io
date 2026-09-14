//#region MailCopy Handler

function SetTextToClipboard(text) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            console.log("Text copied successfully!");
        })
        .catch((err) => {
            console.error("Could not copy text: ", err);
        });
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

                video.play().catch(() => {
                    // Playback can be blocked when the browser's autoplay policy changes.
                });
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

//#region Avoid Opera img problem

// Check if the current browser is Opera
// Fonction pour supprimer le style OperaUserStyle
function removeOperaUserStyle() {
    var operaUserStyle = document.getElementById("operaUserStyle");
    if (operaUserStyle) {
        operaUserStyle.parentNode.removeChild(operaUserStyle);
    }
}

// Supprimer le style lors du chargement initial de la page
addEventListener("DOMContentLoaded", removeOperaUserStyle);

// Surveiller les changements dans le DOM
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // Vérifier si un nouvel élément <style> avec l'ID operaUserStyle est ajouté
        if (mutation.addedNodes) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addedNode = mutation.addedNodes[i];
                if (addedNode.id === "operaUserStyle") {
                    removeOperaUserStyle(); // Supprimer le style
                    break;
                }
            }
        }
    });
});

// Configurer l'observation pour les ajouts d'éléments au nœud body
observer.observe(document.body, { childList: true });

//#endregion

//#region Project Page Manager
window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("q");

    if (searchTerm) {
        // Split the search term into an array of tags
        const searchTags = searchTerm.split(",").map((tag) => tag.trim());

        // Hide all projects that don't match any of the tags
        animateProjects(searchTags);

        console.log("Filtered projects by tags: " + searchTags.join(", "));
    }
});

function animateProjects(searchTags) {
    const projects = document.querySelectorAll(".item");

    projects.forEach((project) => {
        const projectTags = project
            .getAttribute("ProjectTag")
            .split(",")
            .map((tag) => tag.trim());
        // Check if any of the project's tags match any of the search tags
        const isVisible = projectTags.some((tag) => searchTags.includes(tag));

        if (!isVisible) {
            project.style.transition = "opacity 0.5s ease-in-out";
            project.style.opacity = "0";
            setTimeout(() => {
                project.style.display = "none";
            }, 500);
        } else {
            project.style.transition = "opacity 0.5s ease-in-out";
            project.style.opacity = "1";
        }
    });
}
//#endregion
