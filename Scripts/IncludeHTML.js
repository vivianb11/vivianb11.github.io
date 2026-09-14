async function includeHTML() {
    const elements = document.querySelectorAll("[w3-include-html]");

    await Promise.all(
        Array.from(elements).map(async (element) => {
            const file = element.getAttribute("w3-include-html");

            if (!file) {
                return;
            }

            try {
                const response = await fetch(file);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                element.innerHTML = await response.text();
            } catch (error) {
                console.error(`Could not load included HTML "${file}".`, error);
                element.textContent = "Page not found.";
            } finally {
                element.removeAttribute("w3-include-html");
            }
        }),
    );

    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", includeHTML);
