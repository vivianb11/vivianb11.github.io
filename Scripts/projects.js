//#region Project List
// Pour AJOUTER un projet : copie un bloc { ... } et modifie-le.
// Pour CACHER un projet : mets visible: false (il reste ici, pret a revenir).
// Pour ENLEVER un projet : supprime son bloc.
// L'ordre de la liste = l'ordre d'affichage sur la page.
//
// Champs :
//   title       Titre affiche
//   visible     true = affiche, false = cache
//   tags        Utilises par le filtre ?q= (ex: index.html?q=2024,Tech)
//   image       Chemin de l'image (ou poster de la video)
//   video       (optionnel) Chemin d'une video, jouee quand elle est visible
//   alt         Description de l'image
//   description Texte (le HTML est accepte : <br />, <b>, ...)
//   page        (optionnel) Page "Learn More" du projet
//   play        (optionnel) Lien "Try It Out"
//   playIcon    (optionnel) Icone Font Awesome du bouton "Try It Out"

const PROJECTS = [
    {
        title: "Shards",
        visible: true,
        tags: ["2024"],
        image: "Assets/Img/Shards/ShardsPoster.png",
        alt: "Shards game poster",
        description: `Shards is a single-player twin-stick shooter adventure
            game where you play as a clay robot. Fight your own kind, advance
            deeper into the Citadel and uncover its secrets.`,
        page: "project.html?p=Shards",
        play: "https://store.steampowered.com/app/4660650/Shards/",
        playIcon: "fa-brands fa-steam",
    },
    {
        title: "Game Economy Simulator",
        visible: false,
        tags: ["2025", "Tech"],
        image: "Assets/Img/GameEconomySimulator/editor_overview.png",
        video: "Assets/Video/GameEconomySimulator_Trailer_Small.mp4",
        alt: "Game Economy Simulator editor",
        description: `A mobile game and its economy tools, built in Godot 4
            by a team of 3 in 4.5 months.`,
        page: "project.html?p=GameEconomySimulator",
    },
    {
        title: "Eye Piece",
        visible: true,
        tags: ["2025"],
        image: "Assets/Img/EyePiece/Tempo Office Game Title.png",
        alt: "Eye Piece game title",
        description: `An ambitious end-of-year capstone built by a team of 12
            in just 2½ months — Eye Piece is a temporal based detective game
            where you have to solve a case in multiple instances of a moment.`,
        page: "project.html?p=EyePiece",
    },
    {
        title: "Eye Tracking VR",
        visible: true,
        tags: ["2024", "Tech"],
        image: "Assets/Img/ProjetVR/keep_the_crown.png",
        alt: "Eye tracking VR game",
        description: `A VR game made to help people relax during a dental
            intervention. The game is made to be played with eye tracking
            technology.`,
        page: "project.html?p=VrEyeTracking",
    },
    {
        title: "POSSESSED",
        visible: true,
        tags: ["2023"],
        image: "Assets/Icons/Placeholder.webp",
        video: "Assets/Video/Possessed_Trailer.mp4",
        alt: "POSSESSED trailer",
        description: `An innovative game concept where you can possess every
            enemy you encounter! This game was made in a 1-week game jam`,
        play: "https://vivianb11.itch.io/possessed",
    },
    {
        title: "Amazing World",
        visible: true,
        tags: ["2023"],
        image: "Assets/Img/SmallProjects/Logo_AMW.png",
        alt: "Amazing World logo",
        description: `What if ... a Gyro Game <br />+ let's see ... A Planet?
            <br /><br /><b>Wait no more!!! Go try it out</b> 😉`,
        play: "https://vivianb11.itch.io/amazing-world",
    },
    {
        title: "Square Roots",
        visible: true,
        tags: ["2023"],
        image: "Assets/Img/SmallProjects/SquareRoots_Ill.png",
        alt: "Square Roots illustration",
        description: `A prototype made at Concordia's Global game jam 2022 with
            a fantastic group composed of Joshua, Raphael, Conor, Theo and me.`,
        play: "https://play.unity.com/mg/other/squaredroots",
    },
    {
        title: "Dream Drop Starfight",
        visible: true,
        tags: ["2023"],
        image: "Assets/Img/SmallProjects/DreamDropStarfight.png",
        alt: "Dream Drop Starfight illustration",
        description: `A 2-day game jam game with a fun versus mechanic meant to
            be played with friends and family! <br />
            Give it a try and try not to <b>fall off</b>!!!`,
        play: "https://miss-mystie.itch.io/dream-drop-starfight",
    },
    {
        title: "Sir's Castle",
        visible: true,
        tags: ["2022"],
        image: "Assets/Img/SmallProjects/Sir'sCastle_Ill.png",
        alt: "Sir's Castle illustration",
        description: `My very first video game made with the Construct 2
            engine! I went from barely knowing anything about how to make a
            video game to this very simple concept.`,
        play: "https://vivianb11.itch.io/sirs-castle",
    },
    {
        title: "Crazy Billard",
        visible: false,
        tags: ["2022"],
        image: "Assets/Img/CrazyPoolIlustration.png", // image introuvable dans Assets
        alt: "Crazy Billard illustration",
        description: `The result of a amazing experiment of testing out and
            discovering unity ! Out of this came a original pool game where
            each ball has a unique behaviour ! Hope you enjoy ^^`,
        play: "https://play.unity.com/mg/other/crazybillard_build_web",
    },
];
//#endregion

//#region Project Grid Builder
function buildProjectItem(project, index) {
    const item = document.createElement("div");
    item.className = "item";
    item.dataset.tags = project.tags.join(",");

    // Seule la premiere image se charge tout de suite, les autres en lazy
    const lazy = index === 0 ? "" : 'loading="lazy" decoding="async"';
    const media = project.video
        ? `<video data-src="${project.video}" poster="${project.image}"
                preload="none" muted loop></video>`
        : `<img src="${project.image}" alt="${project.alt}" ${lazy} />`;

    const buttons = [];
    if (project.page) {
        buttons.push(`<a href="${project.page}" class="button"><span>
                Learn More <i class="fa-regular fa-lightbulb fa_2xl"></i>
            </span></a>`);
    }
    if (project.play) {
        const icon = project.playIcon
            ? `<i class="${project.playIcon} fa_2xl"></i>`
            : "";
        buttons.push(`<a href="${project.play}" class="button" target="_blank">
                <span> Try It Out ${icon}</span></a>`);
    }

    item.innerHTML = `
        ${media}
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <div class="Button Grid">${buttons.join("")}</div>`;
    return item;
}

function renderProjects() {
    const grid = document.querySelector("#projects .grid");
    if (!grid) return;

    PROJECTS.filter((project) => project.visible).forEach((project, index) => {
        grid.appendChild(buildProjectItem(project, index));
    });
}

renderProjects();
//#endregion
