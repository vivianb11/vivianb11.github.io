//#region Project Page Builder
// Construit une page projet a partir de Project_Pages/<nom>.md
// Exemple : project.html?p=Shards  ->  Project_Pages/Shards.md
// La syntaxe est expliquee dans Project_Pages/_Template.md

const HIGHLIGHT_ICONS = {
    team: "fa-solid fa-people-group",
    role: "fa-solid fa-user",
    year: "fa-solid fa-calendar-days",
    duration: "fa-solid fa-clock",
};

const ENGINE_ICONS = {
    unreal: '<img src="Assets/Icons/Unreal-logo.svg" alt="Unreal Engine Logo" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" />',
    unity: '<i class="fa-brands fa-unity"></i>',
    godot: '<i class="fa-solid fa-gamepad"></i>',
};

const PLATFORM_ICONS = {
    pc: "fa-solid fa-computer",
    vr: "fa-solid fa-vr-cardboard",
    mobile: "fa-solid fa-mobile-screen",
    console: "fa-solid fa-gamepad",
    web: "fa-solid fa-globe",
};

const TEAM_ICONS = {
    design: "fa-solid fa-user-tie",
    artist: "fa-solid fa-palette",
    art: "fa-solid fa-palette",
    sound: "fa-solid fa-music",
    music: "fa-solid fa-music",
    program: "fa-solid fa-code",
    produc: "fa-solid fa-clipboard-list",
};

const WIP_HTML = `<div class="wip-box">
    <p><strong>⚠️ Work in Progress</strong></p>
    <p>This section is currently being updated. Check back soon for more
    details about my contributions on this project.</p>
</div>`;

function findIcon(text, icons, fallback) {
    const key = Object.keys(icons).find((k) => text.toLowerCase().includes(k));
    return key ? icons[key] : fallback;
}

// Lit le bloc "--- cle: valeur ---" en haut du fichier
function parseFrontMatter(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!match) return { meta: {}, body: text };

    const meta = {};
    match[1].split(/\r?\n/).forEach((line) => {
        const index = line.indexOf(":");
        if (index > 0) {
            meta[line.slice(0, index).trim().toLowerCase()] = line
                .slice(index + 1)
                .trim();
        }
    });
    return { meta, body: text.slice(match[0].length) };
}

const HIGHLIGHT_LABELS = { team: "Team", role: "Role", year: "Year", duration: "Duration" };

// Pastilles "Label / valeur" sous le titre (bento : Project_Pages/project_bento.css)
function buildHighlights(meta) {
    const chips = [];
    const chip = (icon, label, value) =>
        `<div class="highlight"><small>${icon}${label}</small><span>${value}</span></div>`;
    ["role", "team", "duration", "year"].forEach((key) => {
        if (meta[key]) chips.push(chip(`<i class="${HIGHLIGHT_ICONS[key]}"></i>`, HIGHLIGHT_LABELS[key], meta[key]));
    });
    if (meta.engine) {
        chips.push(chip(findIcon(meta.engine, ENGINE_ICONS, '<i class="fa-solid fa-gear"></i>'), "Engine", meta.engine));
    }
    if (meta.platform) {
        const icon = findIcon(meta.platform, PLATFORM_ICONS, "fa-solid fa-gamepad");
        chips.push(chip(`<i class="${icon}"></i>`, "Platform", meta.platform));
    }
    if (chips.length === 0) return "";
    return `<div class="pf-chips" data-count="${chips.length}">${chips.join("")}</div>`;
}

// Remplace les raccourcis d'une ligne (youtube:, video:, [WIP]) par du HTML
function expandShortcuts(line) {
    const youtube = line.match(/^youtube:\s*(\S+)\s*(?:\|\s*(.*))?$/i);
    if (youtube) {
        const [, id, caption = "Watch on YouTube"] = youtube;
        return `<figure style="width:100%; margin:0;">
    <div style="position:relative; padding-top:56.25%; overflow:hidden; border-radius:8px;">
        <iframe src="https://www.youtube.com/embed/${id}" title="${caption}"
            style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
    </div>
    <figcaption style="text-align:center; margin-top:8px;">${caption} — <a href="https://youtu.be/${id}" target="_blank" rel="noopener">Watch on YouTube</a></figcaption>
</figure>`;
    }

    const video = line.match(/^video:\s*(\S+)\s*(?:\|\s*(\S+))?$/i);
    if (video) {
        const [, src, poster] = video;
        return `<video controls playsinline preload="metadata" src="${src}"
    ${poster ? `poster="${poster}"` : ""} style="width:100%; max-height:none; border-radius:8px;"></video>`;
    }

    if (line.trim().toUpperCase() === "[WIP]") return WIP_HTML;
    // Chemins d'image avec des espaces : Markdown ne les accepte pas tels quels
    return line.replace(/(!\[[^\]]*\]\()([^)]*)\)/g, (_, start, src) => `${start}${src.trim().replace(/ /g, "%20")})`);
}

// Transforme chaque "### Titre" + liste en carte d'equipe
function buildTeam(markdown) {
    const container = document.createElement("div");
    container.innerHTML = marked.parse(markdown);

    const cards = [];
    container.querySelectorAll("h3").forEach((heading) => {
        let title = heading.textContent.trim();
        let icon = findIcon(title, TEAM_ICONS, "fa-solid fa-star");
        const custom = title.match(/\{(.+)\}\s*$/);
        if (custom) {
            icon = custom[1].includes(" ") ? custom[1] : `fa-solid ${custom[1]}`;
            title = title.replace(custom[0], "").trim();
        }

        const list = heading.nextElementSibling;
        const names =
            list && list.tagName === "UL"
                ? [...list.children].map((li) => li.innerHTML)
                : [];

        cards.push(`<div class="pf-insight">
    <i class="${icon}" aria-hidden="true"></i>
    <h4>${title}</h4>
    <ul>${names.map((name) => `<li>${name}</li>`).join("")}</ul>
</div>`);
    });

    return `<div class="pf-team-cards">${cards.join("")}</div>`;
}

function buildColumns(lines) {
    const cells = [[]];
    let depth = 0;
    lines.forEach((line) => {
        if (/^:::\s*\w+/.test(line)) depth++;
        else if (/^:::\s*$/.test(line)) depth--;
        if (depth === 0 && /^\+\+\+\s*$/.test(line)) cells.push([]);
        else cells[cells.length - 1].push(line);
    });
    const html = cells.map(
        (cell) => `<div class="pf-tile">${buildSectionBody(cell)}</div>`,
    );
    return `<div class="pf-cols">${html.join("")}</div>`;
}

// Gere les blocs "::: columns" et "::: team" (imbricables) ; le reste est du Markdown normal
function buildSectionBody(lines) {
    let html = "";
    let buffer = [];
    let block = null;
    let depth = 0;

    const flush = () => {
        if (block === "columns") html += buildColumns(buffer);
        else if (block === "team") html += buildTeam(buffer.join("\n"));
        else html += marked.parse(buffer.join("\n"));
        buffer = [];
    };

    lines.forEach((line) => {
        const open = line.match(/^:::\s*(\w+)\s*$/);
        const close = /^:::\s*$/.test(line);

        if (!block && open) {
            flush();
            block = open[1].toLowerCase();
        } else if (block && close && depth === 0) {
            flush();
            block = null;
        } else if (block) {
            if (open) depth++;
            if (close) depth--;
            buffer.push(line);
        } else {
            buffer.push(expandShortcuts(line));
        }
    });
    flush();
    return html;
}

function buildPage(text) {
    const { meta, body } = parseFrontMatter(text);
    if (meta.title) document.title = "Vivian Boudon - " + meta.title;

    // Chaque titre "# ..." commence une nouvelle section
    const sections = [];
    body.split(/\r?\n/).forEach((line) => {
        const heading = line.match(/^#\s+(.*)$/);
        if (heading || sections.length === 0) {
            sections.push({ title: heading ? heading[1] : "", lines: [] });
            if (heading) return;
        }
        sections[sections.length - 1].lines.push(line);
    });

    // Le texte avant le premier "# ..." est souvent vide : on l'ignore
    if (sections.length > 1 && !sections[0].title && !sections[0].lines.join("").trim()) {
        sections.shift();
    }

    return sections
        .map((section, index) => {
            const body = buildSectionBody(section.lines);
            if (index > 0) {
                const title = section.title ? `<h1>${section.title}</h1>` : "";
                return `<section>${title}${body}</section>`;
            }
            // Premiere section : tuile titre + pastilles, puis le contenu
            const name = meta.title || section.title;
            const kicker = meta.kicker || [meta.platform, meta.year].filter(Boolean).join(" · ");
            return `<section class="pf-intro pf-intro-md">
    <div class="pf-title">
        ${kicker ? `<p class="pf-kicker">${kicker}</p>` : ""}
        <h1>${name}</h1>
        ${meta.tagline ? `<p class="pf-tagline">${meta.tagline}</p>` : ""}
    </div>
    ${buildHighlights(meta)}
    <div class="pf-flow">${body}</div>
</section>`;
        })
        .join("");
}

// Couleurs propres au projet (en-tete "accent:" / "accent-ink:")
function applyTheme(meta, container) {
    if (meta.accent) container.style.setProperty("--pf-accent", meta.accent);
    if (meta["accent-ink"]) container.style.setProperty("--pf-accent-ink", meta["accent-ink"]);
}

async function loadProjectPage() {
    const container = document.getElementById("project-content");
    const name = (new URLSearchParams(location.search).get("p") || "").replace(/[^\w-]/g, "");

    try {
        if (!name) throw new Error("No project given");
        const response = await fetch(`Project_Pages/${name}.md`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        applyTheme(parseFrontMatter(text).meta, container);
        container.innerHTML = buildPage(text);

        container.querySelectorAll(".pf-tile img").forEach((img) => {
            img.classList.add("hover-photo");
            img.loading = "lazy";
            img.decoding = "async";
        });
    } catch (error) {
        console.error(`Could not load project "${name}".`, error);
        container.innerHTML = `<section><h1>Project not found</h1>
            <p style="text-align:center"><a href="index.html#projects">Back to projects</a></p></section>`;
    }
}

loadProjectPage();
//#endregion
