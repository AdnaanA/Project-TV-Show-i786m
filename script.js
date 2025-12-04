async function setup() {
	const rootElem = document.getElementById('root');
	const episodeTemplate = document.getElementById('episodeTemplate');
	const searchInput = document.getElementById('searchInput');
	const episodeCount = document.getElementById('episodeCount');

	const allEpisodes = await getAllEpisodes(rootElem);

	makePageForEpisodes(allEpisodes, rootElem, episodeTemplate);

	episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;

	// LIVE SEARCH FUNCTIONALITY
	searchInput.addEventListener('input', () => {
		const searchTerm = searchInput.value.trim().toLowerCase();

		// CLEAR SEARCH = SHOW ALL
		if (searchTerm === '') {
			rootElem.innerHTML = '';
			makePageForEpisodes(allEpisodes, rootElem, episodeTemplate);
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
		makePageForEpisodes(filteredEpisodes, rootElem, episodeTemplate);

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
			makePageForEpisodes(allEpisodes, rootElem, episodeTemplate);
			episodeCount.textContent = `${allEpisodes.length} / ${allEpisodes.length}`;
			// Enable search
			searchInput.disabled = false;
			searchInput.classList.remove('search-disabled');
			searchInput.classList.add('search-enabled');
			searchInput.placeholder = 'Type to search...';
			return;
		}

		// SHOW SELECTED EPISODE
		const selectedEpisode = allEpisodes[selectedIndex];
		rootElem.innerHTML = '';
		makePageForEpisodes([selectedEpisode], rootElem, episodeTemplate);
		episodeCount.textContent = `1 / ${allEpisodes.length}`;
		// Disable search
		searchInput.disabled = true;
		searchInput.classList.remove('search-enabled');
		searchInput.classList.add('search-disabled');
		searchInput.placeholder = 'Select "All Episodes" to search';
		searchInput.value = ''; // Clear search
	});
}
function makePageForEpisodes(episodeList, rootElem, episodeTemplate) {
	const episodeCards = episodeList.map((episode) =>
		makeCard(episode, episodeTemplate)
	);
	rootElem.append(...episodeCards);
}

function makeCard(episode, episodeTemplate) {
	const episodeCard = episodeTemplate.content.cloneNode(true);
	const episodeName = episodeCard.querySelector('.episodeName');
	const episodeCode = episodeCard.querySelector('.episodeCode');
	const episodeImage = episodeCard.querySelector('.episodeImage');
	const episodeLink = episodeCard.querySelector('.episodeLink');
	const episodeSummary = episodeCard.querySelector('.episodeSummary');

	// Validate required fields
	episodeName.textContent = episode.name || 'Unknown Episode';
	episodeCode.textContent =
		episode.season && episode.number
			? getEpisodeCode(episode.season, episode.number)
			: 'N/A';

	episodeImage.src = episode.image?.medium
		? episode.image.medium
		: 'https://placehold.co/250x140?text=NO+IMAGE+AVAILABLE';
	episodeImage.alt = episode.image?.medium
		? `${episode.name} thumbnail`
		: 'No image available';

	episodeLink.href = episode.url || '#';

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
async function getAllEpisodes(rootElem) {
	rootElem.innerHTML = '<p>Loading episodes, please wait...</p>';
	try {
		const url = 'https://api.tvmaze.com/shows/82/episodes';
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`HTTP Error: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		rootElem.innerHTML = '';
		return data;
	} catch (error) {
		console.error('Failed to fetch episodes:', error);

		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		const retryButton = document.createElement('button');
		retryButton.textContent = 'Retry';
		retryButton.style.marginLeft = '10px';
		retryButton.style.padding = '5px 10px';
		retryButton.style.cursor = 'pointer';
		retryButton.onclick = () => window.location.reload();

		const errorContainer = document.createElement('div');
		errorContainer.innerHTML = `<p>Failed to load episodes. Please try again later.</p><p style="font-size: 0.9em; color: #666;">Error details: ${errorMessage}</p>`;
		errorContainer.appendChild(retryButton);

		rootElem.innerHTML = '';
		rootElem.appendChild(errorContainer);

		return [];
	}
}

window.onload = setup;
