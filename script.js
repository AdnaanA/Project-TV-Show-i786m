//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes);
  
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodeCards = episodeList.map(episode => makeCard(episode));
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

