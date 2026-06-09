const searchForm = document.getElementById('search-form');
const mapForm = document.getElementById('map-form');
const searchQueryInput = document.getElementById('search-query');
const searchEngineSelect = document.getElementById('search-engine');
const mapQueryInput = document.getElementById('map-query');
const mapServiceSelect = document.getElementById('map-service');
const savedStatus = document.getElementById('saved-status');
const historyList = document.getElementById('history-list');

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`; 
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((result, cookie) => {
    const [key, value] = cookie.split('=');
    return key === name ? decodeURIComponent(value) : result;
  }, '');
}

function loadPreferences() {
  const lastEngine = getCookie('searchEngine');
  const lastMapService = getCookie('mapService');
  const lastSearch = getCookie('lastSearch');
  const lastMapQuery = getCookie('lastMapQuery');
  const history = getCookie('searchHistory');

  if (lastEngine) searchEngineSelect.value = lastEngine;
  if (lastMapService) mapServiceSelect.value = lastMapService;
  if (lastSearch) searchQueryInput.value = lastSearch;
  if (lastMapQuery) mapQueryInput.value = lastMapQuery;

  const historyItems = history ? JSON.parse(history) : [];
  displayHistory(historyItems);

  savedStatus.textContent = `Preferências: Busca = ${searchEngineSelect.options[searchEngineSelect.selectedIndex].text}, Mapas = ${mapServiceSelect.options[mapServiceSelect.selectedIndex].text}.`;
}

function displayHistory(historyItems) {
  historyList.innerHTML = '';
  if (!historyItems.length) {
    historyList.innerHTML = '<li>Sem histórico ainda.</li>';
    return;
  }

  historyItems.slice(0, 6).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function updateHistory(value) {
  if (!value) return;
  const historyText = getCookie('searchHistory');
  const historyItems = historyText ? JSON.parse(historyText) : [];
  const normalized = value.trim();
  if (!normalized) return;
  const newHistory = [normalized, ...historyItems.filter(item => item !== normalized)].slice(0, 10);
  setCookie('searchHistory', JSON.stringify(newHistory));
  displayHistory(newHistory);
}

function getSearchUrl(engine, query) {
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    case 'duckduckgo': return `https://duckduckgo.com/?q=${encoded}`;
    case 'ecosia': return `https://www.ecosia.org/search?q=${encoded}`;
    default: return `https://www.google.com/search?q=${encoded}`;
  }
}

function getMapUrl(service, query) {
  const encoded = encodeURIComponent(query);
  switch (service) {
    case 'openstreetmap': return `https://www.openstreetmap.org/search?query=${encoded}`;
    case 'bing': return `https://www.bing.com/maps?q=${encoded}`;
    default: return `https://www.google.com/maps/search/${encoded}`;
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const query = searchQueryInput.value.trim();
  const engine = searchEngineSelect.value;

  if (!query) return;

  setCookie('searchEngine', engine);
  setCookie('lastSearch', query);
  setCookie('lastMapQuery', mapQueryInput.value.trim());
  setCookie('lastMapService', mapServiceSelect.value);
  updateHistory(`Busca: ${query}`);
  savedStatus.textContent = `Preferências salvas: ${searchEngineSelect.options[searchEngineSelect.selectedIndex].text} e ${mapServiceSelect.options[mapServiceSelect.selectedIndex].text}.`;

  window.open(getSearchUrl(engine, query), '_blank');
});

mapForm.addEventListener('submit', event => {
  event.preventDefault();
  const query = mapQueryInput.value.trim();
  const service = mapServiceSelect.value;

  if (!query) return;

  setCookie('mapService', service);
  setCookie('lastMapQuery', query);
  setCookie('lastSearch', searchQueryInput.value.trim());
  setCookie('lastMapService', service);
  updateHistory(`Mapa: ${query}`);
  savedStatus.textContent = `Preferências salvas: ${searchEngineSelect.options[searchEngineSelect.selectedIndex].text} e ${mapServiceSelect.options[mapServiceSelect.selectedIndex].text}.`;

  window.open(getMapUrl(service, query), '_blank');
});

loadPreferences();
