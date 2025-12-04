async function setup() {
	const rootElem = document.getElementById('root');
	const searchInput = document.getElementById('searchInput');
	const episodeCount = document.getElementById('episodeCount');

	const allEpisodes = await getAllEpisodes();
	makePageForEpisodes(allEpisodes);

	episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;

	// LIVE SEARCH FUNCTIONALITY
	searchInput.addEventListener('input', () => {
		const searchTerm = searchInput.value.trim().toLowerCase();

		// CLEAR SEARCH = SHOW ALL
		if (searchTerm === '') {
			rootElem.innerHTML = '';
			makePageForEpisodes(allEpisodes);
			episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;
			return;
		}

		// FILTER EPISODES BASED ON SEARCH TERM
		const filteredEpisodes = allEpisodes.filter((episode) => {
			const nameMatch = episode.name.toLowerCase().includes(searchTerm);

			const summaryText = episode.summary
				? getTextFromHTML(episode.summary)
				: '';
			const summaryMatch = summaryText.toLowerCase().includes(searchTerm);

			return nameMatch || summaryMatch;
		});
		rootElem.innerHTML = '';
		makePageForEpisodes(filteredEpisodes);

		episodeCount.textContent = `${filteredEpisodes.length} / ${allEpisodes.length}`;
	});

	// DROPDOWN TO SELECT EPISODE
	const episodeSelect = document.getElementById('episodeSelect');
	allEpisodes.forEach((episode, index) => {
		const option = document.createElement('option');
		option.value = index;

		// ONLY show season and episode number
		option.textContent =
			getEpisodeCode(episode.season, episode.number) +
			` - ` +
			episode.name;

		episodeSelect.appendChild(option);
	});

	episodeSelect.addEventListener('change', () => {
		const selectedIndex = episodeSelect.value;

		// SHOW ALL EPISODES IF "ALL EPISODES" IS SELECTED
		if (selectedIndex === 'all') {
			rootElem.innerHTML = '';
			makePageForEpisodes(allEpisodes);
			episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;
			return;
		}

		// SHOW SELECTED EPISODE
		const selectedEpisode = allEpisodes[selectedIndex];
		rootElem.innerHTML = '';
		makePageForEpisodes([selectedEpisode]);
		episodeCount.textContent = `1 / ${allEpisodes.length}`;
	});
}
function makePageForEpisodes(episodeList) {
	const rootElem = document.getElementById('root');
	const episodeCards = episodeList.map((episode) => makeCard(episode));
	rootElem.append(...episodeCards);
}

function makeCard(episode) {
	const template = document.getElementById('episodeTemplate');
	const episodeCard = template.content.cloneNode(true);
	const episodeName = episodeCard.querySelector('.episodeName');
	const episodeCode = episodeCard.querySelector('.episodeCode');
	const episodeImage = episodeCard.querySelector('.episodeImage');
	const episodeLink = episodeCard.querySelector('.episodeLink');
	const episodeSummary = episodeCard.querySelector('.episodeSummary');
	episodeName.textContent = episode.name;
	episodeCode.textContent = `${getEpisodeCode(
		episode.season,
		episode.number
	)}`;
	episodeImage.src = episode.image
		? episode.image.medium
		: 'https://placehold.co/250x140?text=NO+IMAGE+AVAILABLE';
	episodeImage.alt = episode.image
		? `${episode.name} thumbnail`
		: 'No image available';
	episodeLink.href = episode.url;
	episodeSummary.textContent = episode.summary
		? getTextFromHTML(episode.summary)
		: 'No summary available.';
	return episodeCard;
}

function getEpisodeCode(season, episode) {
	return `S${String(season).padStart(2, '0')}E${String(episode).padStart(
		2,
		'0'
	)}`;
}

function getTextFromHTML(html) {
	const temp = document.createElement('div');
	temp.innerHTML = html;
	return temp.textContent || temp.innerText || '';
}

// Fetches all episodes from the TVMaze API
async function getAllEpisodes() {
	const rootElem = document.getElementById('root');
	rootElem.innerHTML = '<p>Loading episodes, please wait...</p>';
	try {
		const url = 'https://api.tvmaze.com/shows/82/episodes';
		const response = await fetch(url);
		const data = await response.json();
		rootElem.innerHTML = '';
		return data;
	} catch (error) {
		rootElem.innerHTML =
			'<p>Failed to load episodes. Please try again later.</p>';
		return [];
	}
}

window.onload = setup;
