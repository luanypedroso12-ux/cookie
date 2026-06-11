// ==========================================
// SELEÇÃO DE ELEMENTOS DO DOM (HTML)
// ==========================================
// Captura os formulários e elementos da página para que o JavaScript possa interagir com eles.
const searchForm = document.getElementById('search-form'); // Formulário de busca comum
const mapForm = document.getElementById('map-form');       // Formulário de busca de mapas

// Campos de entrada de texto (inputs)
const searchQueryInput = document.getElementById('search-query'); // Texto da busca
const mapQueryInput = document.getElementById('map-query');       // Texto do mapa

// Menus de seleção (selects)
const searchEngineSelect = document.getElementById('search-engine'); // Motor de busca (Google, Bing...)
const mapServiceSelect = document.getElementById('map-service');     // Serviço de mapa (Google Maps, OSM...)

// Elementos de exibição de dados na tela
const savedStatus = document.getElementById('saved-status'); // Texto que mostra as preferências salvas
const historyList = document.getElementById('history-list'); // Lista (<ul> ou <ol>) onde o histórico será exibido


// ==========================================
// FUNÇÕES DE GERENCIAMENTO DE COOKIES
// ==========================================

/**
 * Salva uma informação (Cookie) no navegador do usuário.
 * @param {string} name - O nome da chave do cookie.
 * @param {string} value - O valor a ser guardado.
 * @param {number} days - Quantidade de dias até o cookie expirar (padrão: 1 ano).
 */
function setCookie(name, value, days = 365) {
  // Calcula a data de expiração. 864e5 é a notação científica para 86.400.000 milissegundos (1 dia).
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  
  // Define o cookie. encodeURIComponent protege caracteres especiais (como espaços e acentos).
  // 'path=/' faz com que o cookie fique acessível em todo o site.
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`; 
}

/**
 * Recupera o valor de um cookie salvo pelo nome.
 * @param {string} name - O nome do cookie que queremos buscar.
 * @returns {string} O valor do cookie ou uma string vazia se não existir.
 */
function getCookie(name) {
  // document.cookie retorna uma string única com todos os cookies (ex: "user=John; theme=dark")
  // .split('; ') transforma essa string em um Array de cookies individuais.
  return document.cookie.split('; ').reduce((result, cookie) => {
    // Divide cada cookie no sinal de '=' para separar a chave do valor
    const [key, value] = cookie.split('=');
    
    // Se a chave for igual ao nome procurado, decodifica e retorna o valor, senão mantém o acumulador (result)
    return key === name ? decodeURIComponent(value) : result;
  },