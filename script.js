//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes);

  makePageForEpisodes(allEpisodes);

  const searchInput = document.getElementById("searchInput");
  const episodeCount = document.getElementById("episodeCount");
  // This line is the real troublemaker:
  const rootElem = document.getElementById("root");

  episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;

  // LIVE SEARCH FUNCTIONALITY
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();

    // CLEAR SEARCH = SHOW ALL
    if (searchTerm === "") {
      rootElem.innerHTML = "";
      makePageForEpisodes(allEpisodes);
      episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;
      return;
    }

    // FILTER EPISODES BASED ON SEARCH TERM
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.includes(searchTerm);

      // Remove HTML tags from summary for accurate searching
      const summaryText = episode.summary
        ? episode.summary.replace(/<[^>]*>/g, "")
        : "";

        // Check if summary includes the search term
      const summaryMatch = summaryText.includes(searchTerm);

      // Return true if either name or summary matches
      return nameMatch || summaryMatch;
    });
    rootElem.innerHTML = "";
    makePageForEpisodes(filteredEpisodes);

    episodeCount.textContent = `${filteredEpisodes.length} / ${allEpisodes.length}`;
  });

  // DROPDOWN TO SELECT EPISODE
  const episodeSelect = document.getElementById("episodeSelect");
  allEpisodes.forEach((episode, index) => {
    const option = document.createElement("option");
    option.value = index;

    // ONLY show season and episode number
    option.textContent = getEpisodeCode(episode.season, episode.number);

    episodeSelect.appendChild(option);
  });

  episodeSelect.addEventListener("change", () => {
    const selectedIndex = episodeSelect.value;

    // SHOW ALL EPISODES IF "ALL EPISODES" IS SELECTED
    if (selectedIndex === "all") {
      rootElem.innerHTML = "";
      makePageForEpisodes(allEpisodes);
      episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;
      return;
    }

    // SHOW SELECTED EPISODE
    const selectedEpisode = allEpisodes[selectedIndex];
    rootElem.innerHTML = "";
    makePageForEpisodes([selectedEpisode]);
    episodeCount.textContent = `1 / ${allEpisodes.length}`;
  });
}
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodeCards = episodeList.map((episode) => makeCard(episode));
  // You’re appending episodes inside the same container that holds the template — which causes weird behavior and DOM confusion.
  rootElem.append(...episodeCards);
}

function makeCard(episode) {
  const template = document.getElementById("episodeTemplate");
  const episodeCard = template.content.cloneNode(true);
  const episodeName = episodeCard.querySelector(".episodeName");
  const episodeCode = episodeCard.querySelector(".episodeCode");
  const episodeImage = episodeCard.querySelector(".episodeImage");
  const episodeLink = episodeCard.querySelector(".episodeLink");
  const episodeSummary = episodeCard.querySelector(".episodeSummary");
  episodeName.textContent = episode.name;
  episodeCode.textContent = `${getEpisodeCode(episode.season, episode.number)}`;
  episodeImage.src = episode.image ? episode.image.medium : 'https://placehold.co/250x140?text=NO+IMAGE+AVAILABLE';
  episodeImage.alt = episode.image ? `${episode.name} thumbnail` : 'No image available';
  episodeLink.href = episode.url;
  episodeSummary.textContent = episode.summary ? episode.summary.slice(3,-4) : "No summary available.";
  return episodeCard;
}

function getEpisodeCode(season, episode){
  return `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
}



window.onload = setup;

