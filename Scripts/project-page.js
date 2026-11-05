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

function buildHighlights(meta) {
    const pills = [];
    Object.entries(HIGHLIGHT_ICONS).forEach(([key, icon]) => {
        if (meta[key]) pills.push(`<i class="${icon}"></i> ${meta[key]}`);
    });
    if (meta.engine) {
        const icon = findIcon(meta.engine, ENGINE_ICONS, '<i class="fa-solid fa-gear"></i>');
        pills.push(`${icon} ${meta.engine}`);
    }
    if (meta.platform) {
        const icon = findIcon(meta.platform, PLATFORM_ICONS, "fa-solid fa-gamepad");
        pills.push(`<i class="${icon}"></i> ${meta.platform}`);
    }
    if (pills.length === 0) return "";

    return `<div style="display: flex; flex-wrap: wrap; justify-content: center; height: auto;">
        ${pills.map((pill) => `<div class="highlight">${pill}</div>`).join("")}
    </div>`;
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
    return line;
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

        cards.push(`<div class="ep-card">
    <h3><i class="${icon}" aria-hidden="true"></i> ${title}</h3>
    <ul class="ep-list">${names
        .map((name) => `<li class="ep-item"><span class="ep-dot"></span><span>${name}</span></li>`)
        .join("")}</ul>
</div>`);
    });

    return `<div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; align-items: center;">${cards.join("")}</div>`;
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
        (cell) => `<div class="md-cell" style="align-self: center">${buildSectionBody(cell)}</div>`,
    );
    return `<div class="grid">${html.join("")}</div>`;
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

    return sections
        .map((section, index) => {
            const title = section.title ? `<h1>${section.title}</h1>` : "";
            const highlights = index === 0 ? buildHighlights(meta) : "";
            return `<section>${title}${highlights}${buildSectionBody(section.lines)}</section>`;
        })
        .join("");
}

async function loadProjectPage() {
    const container = document.getElementById("project-content");
    const name = (new URLSearchParams(location.search).get("p") || "").replace(/[^\w-]/g, "");

    try {
        if (!name) throw new Error("No project given");
        const response = await fetch(`Project_Pages/${name}.md`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        container.innerHTML = buildPage(await response.text());

        container.querySelectorAll(".md-cell img").forEach((img) => {
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
