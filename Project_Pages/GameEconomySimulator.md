---
title: Game Economy Simulator
kicker: Web, PC & Mobile · Hero-collection RPG
tagline: Collect heroes, level them up, build the perfect team and fight through campaigns that mix auto-battles and story chapters.
role: Gameplay, UI & Tools
team: 3 people
duration: 4.5 months · 2025
engine: Godot 4 (GDScript)
platform: Web / PC / Mobile
accent: #ffc400
accent-ink: #1d1500
css: GameEconomySimulator.css
---

<!--
  Page riche : les blocs HTML ci-dessous utilisent les classes de project_bento.css.
  Regle Markdown : PAS de ligne vide a l'interieur d'un bloc HTML.
  Diaporama (.pf-carousel) et visionneuse (<figure data-zoom>) : Scripts/project-page.js
  Grille "Under the Hood" et couleurs : GameEconomySimulator.css
-->

# Overview

<div class="pf-showcase">
    <div class="pf-video">
        <video controls playsinline preload="metadata" poster="Assets/Img/GameEconomySimulator/gameplay/combat.png">
            <source src="Assets/Video/GameEconomySimulator_Trailer_Small.mp4" type="video/mp4" />
        </video>
    </div>
    <div class="pf-stats">
        <div class="pf-stat"><strong>207</strong><span>commits</span></div>
        <div class="pf-stat"><strong>43%</strong><span>of the project</span></div>
        <div class="pf-stat"><strong>3k</strong><span>lines of GDScript</span></div>
        <div class="pf-stat"><strong>6</strong><span>core systems</span></div>
    </div>
</div>

::: columns
The game is fully **data-driven**: heroes, upgrades, levels and shop offers are designed in spreadsheets and imported into custom Godot resources, so the designers can balance the economy without touching code.

I built the systems that turn that data into a game: inventory, hero progression, team building, shop, lore levels and most of the UI around them.
:::

# What I Built

<div class="pf-features">
    <article class="pf-feature">
        <img class="hover-photo" src="Assets/Img/GameEconomySimulator/gameplay/team_builder.png" alt="Team Builder" loading="lazy" />
        <div>
            <h3><i class="fa-solid fa-gears"></i> Gameplay systems</h3>
            <ul>
                <li><strong>Lore levels</strong> and campaign unlocking</li>
                <li><strong>Player inventory</strong>: currencies, heroes, unlock events</li>
                <li><strong>Hero progression</strong>: rarities, level-up costs, max level</li>
                <li><strong>Team Builder</strong>: drag &amp; drop, saved between sessions</li>
                <li><strong>Shop</strong>: offers, loot boxes, reward popups</li>
            </ul>
        </div>
    </article>
    <article class="pf-feature">
        <img class="hover-photo" src="Assets/Img/GameEconomySimulator/gameplay/hero_detail_level_up.png" alt="Hero detail" loading="lazy" />
        <div>
            <h3><i class="fa-solid fa-palette"></i> UI / UX</h3>
            <ul>
                <li>Hero inventory with rarity borders and a <strong>grayscale shader</strong></li>
                <li>Hero detail screen with a <strong>stat preview</strong> before level-up</li>
                <li>Reusable progress bars, cost and tag displays, popup tabs</li>
                <li><strong>Gaussian blur shader</strong> behind every popup</li>
            </ul>
        </div>
    </article>
    <article class="pf-feature">
        <img class="hover-photo" src="Assets/Img/GameEconomySimulator/project_settings_overview.png" alt="Custom project settings" loading="lazy" />
        <div>
            <h3><i class="fa-solid fa-screwdriver-wrench"></i> Tools &amp; pipeline</h3>
            <ul>
                <li>Custom game settings in <strong>Project Settings</strong></li>
                <li>Custom resource types with <strong>editor icons</strong></li>
                <li>Polish on the debug save tool</li>
                <li>Regular clean-up passes on warnings, naming and paths</li>
            </ul>
        </div>
    </article>
</div>

# Gameplay

<div class="pf-shots">
    <figure class="pf-shot-main">
        <video class="hover-photo" src="Assets/Video/GameEconomySimulator_Combat.mp4" poster="Assets/Img/GameEconomySimulator/gameplay/combat.png" autoplay muted loop playsinline preload="metadata" aria-label="Auto-battler combat, real gameplay at 1.5x speed"></video>
        <figcaption>Auto-battler combat</figcaption>
    </figure>
    <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/gameplay/victory.png" alt="Victory" loading="lazy" /><figcaption>Victory: gold and a new hero</figcaption></figure>
    <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/gameplay/lore.png" alt="Lore" loading="lazy" /><figcaption>Lore chapters</figcaption></figure>
    <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/gameplay/hero_inventory.png" alt="Hero inventory" loading="lazy" /><figcaption>Hero collection</figcaption></figure>
    <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/gameplay/campaigns.png" alt="Campaigns" loading="lazy" /><figcaption>Unlockable campaigns</figcaption></figure>
</div>

# Under the Hood

<p class="pf-lead">Everything is a custom Godot resource, editable straight from the Inspector.</p>

<div class="pf-insights">
    <div class="pf-insight">
        <i class="fa-solid fa-cubes"></i>
        <h4>Custom resources</h4>
        <p>Heroes, levels, campaigns and shop offers are typed resources with their own editor icons.</p>
    </div>
    <div class="pf-insight">
        <i class="fa-solid fa-sliders"></i>
        <h4>Designer-friendly settings</h4>
        <p>Rarities, data folders, default visuals and audio live in Project Settings, not in code.</p>
    </div>
    <div class="pf-insight">
        <i class="fa-solid fa-code"></i>
        <h4>Reusable UI</h4>
        <p>Every screen is built from shared Control scenes and GDScript components.</p>
    </div>
</div>

<div class="pf-editor-grid">
    <figure class="ed-settings" data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/project_settings_overview.png" alt="Custom project settings" loading="lazy" /><figcaption>Custom Project Settings</figcaption></figure>
    <figure class="ed-hero pf-tall" data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/editor/editor_inspector_hero_card.png" alt="HeroCard inspector" loading="lazy" /><figcaption>A hero: stats, tags, rarity, upgrades</figcaption></figure>
    <figure class="ed-offer pf-tall" data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/editor/editor_inspector_shop_offer.png" alt="Shop offer inspector" loading="lazy" /><figcaption>A shop offer: costs and rewards</figcaption></figure>
    <figure class="ed-script" data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/editor/editor_detail_screen_script_focus.png" alt="GDScript" loading="lazy" /><figcaption>GDScript: hero detail screen</figcaption></figure>
    <figure class="ed-scene" data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/editor/editor_team_builder_scene_focus.png" alt="Team Builder scene" loading="lazy" /><figcaption>Team Builder scene</figcaption></figure>
    <figure class="ed-icons" data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/editor/editor_filesystem_icons.png" alt="Custom resource icons" loading="lazy" /><figcaption>Custom resource icons</figcaption></figure>
</div>

# Evolution of the Work

<div class="pf-carousel">
    <div class="pf-carousel-viewport">
        <div class="pf-evo">
            <figure><img class="hover-photo" src="Assets/Img/GameEconomySimulator/evolution_hero_detail.png" alt="Hero detail evolution" loading="lazy" /><figcaption>Hero detail screen, Aug → Nov 2025</figcaption></figure>
            <figure><img class="hover-photo" src="Assets/Img/GameEconomySimulator/evolution_campaign.png" alt="Campaign evolution" loading="lazy" /><figcaption>Campaign selection, Jul → Nov 2025</figcaption></figure>
            <figure><img class="hover-photo" src="Assets/Img/GameEconomySimulator/evolution_hero_inventory.png" alt="Inventory evolution" loading="lazy" /><figcaption>Hero inventory → Team Builder</figcaption></figure>
        </div>
    </div>
    <div class="pf-carousel-bar">
        <button class="pf-arrow pf-prev" type="button" aria-label="Previous slide"><i class="fa-solid fa-chevron-left"></i></button>
        <span class="pf-count"><strong>01</strong> / 03</span>
        <div class="pf-dots"></div>
        <button class="pf-arrow pf-next" type="button" aria-label="Next slide"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
</div>

# Built On by Students

<p class="pf-lead">After release, the project became the starting codebase for student teams. Each team designed its own game on top of it: their own heroes, art, campaigns, story and balancing, all through the same data pipeline.</p>

<div class="pf-students">
    <article class="pf-feature">
        <div class="pf-pair">
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/fantasy_lore.jpg" alt="Illustrated story chapter" loading="lazy" /><figcaption>Story chapter</figcaption></figure>
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/fantasy_fight.jpg" alt="Dragon knights in combat" loading="lazy" /><figcaption>Combat</figcaption></figure>
        </div>
        <div>
            <h3><i class="fa-solid fa-dragon"></i> Dragon riders</h3>
            <p>A dark-fantasy war story told across illustrated chapters, with knights, dragons and side-memories of the characters.</p>
            <p class="pf-credits">By Etienne, Ilan &amp; Edouard</p>
        </div>
    </article>
    <article class="pf-feature">
        <div class="pf-pair">
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/food_campaigns.jpg" alt="Campaign selection" loading="lazy" /><figcaption>Campaigns</figcaption></figure>
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/food_fight.jpg" alt="Food heroes in combat" loading="lazy" /><figcaption>Combat</figcaption></figure>
        </div>
        <div>
            <h3><i class="fa-solid fa-pepper-hot"></i> Food fight</h3>
            <p>Fruit and vegetable heroes against junk food, with a tutorial and tips campaign, boss levels and an original soundtrack.</p>
            <p class="pf-credits">By Adel, Joshua &amp; Xavier</p>
        </div>
    </article>
    <article class="pf-feature">
        <div class="pf-pair">
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/robots_home.jpg" alt="Fuel economy buildings" loading="lazy" /><figcaption>Fuel economy</figcaption></figure>
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/robots_fight.jpg" alt="Robots in combat" loading="lazy" /><figcaption>Combat</figcaption></figure>
        </div>
        <div>
            <h3><i class="fa-solid fa-robot"></i> Scrap robots</h3>
            <p>A post-apocalyptic world where the last robots fight over fuel, with its own buildings, currencies and loot boxes.</p>
            <p class="pf-credits">By ThePrometheanKing, MapleStaple &amp; Ophiuchuscheh</p>
        </div>
    </article>
    <article class="pf-feature">
        <div class="pf-pair">
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/comics_home.jpg" alt="Comic-book home screen" loading="lazy" /><figcaption>Home screen</figcaption></figure>
            <figure data-zoom><img class="hover-photo" src="Assets/Img/GameEconomySimulator/students/comics_fight.jpg" alt="Comic-book heroes in combat" loading="lazy" /><figcaption>Combat</figcaption></figure>
        </div>
        <div>
            <h3><i class="fa-solid fa-mask"></i> Comic-book heroes</h3>
            <p>Pulp superheroes and villains, with a comic-panel look and a different colour scheme for each chapter.</p>
            <p class="pf-credits">By Ryan, Issam &amp; Robin</p>
        </div>
    </article>
</div>

# The Team ✨

<p class="pf-team-line">Made with <strong>Raphaël Daubelcour</strong> (combat, buildings, data parser) and <strong>Vincent</strong> (game data &amp; balancing).</p>
