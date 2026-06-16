// ==========================================
// FUNÇÕES DE GERENCIAMENTO DE COOKIES
// ==========================================

/**
 * Cria ou atualiza um cookie no navegador.
 *
 * Um cookie é uma pequena informação armazenada pelo navegador
 * que permanece disponível mesmo após recarregar a página.
 * Neste projeto ele é usado para salvar preferências do usuário,
 * como o mecanismo de busca ou serviço de mapas selecionado.
 *
 * @param {string} name - Nome (chave) do cookie.
 * @param {string} value - Valor que será armazenado.
 * @param {number} days - Quantidade de dias até o cookie expirar.
 */
function setCookie(name, value, days = 365) {

  // Cria uma data de expiração para o cookie.
  // Date.now() retorna o horário atual em milissegundos.
  // days * 864e5 converte dias para milissegundos.
  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  // Salva o cookie no navegador.
  //
  // Estrutura gerada:
  // nome=valor; expires=data; path=/
  //
  // encodeURIComponent() evita problemas com caracteres especiais,
  // como espaços, acentos e símbolos.
  //
  // path=/ permite que o cookie seja acessado em qualquer página
  // do mesmo site.
  document.cookie =
    `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

/**
 * Procura e retorna o valor de um cookie específico.
 *
 * Exemplo:
 * Se existirem os cookies:
 * "tema=escuro; idioma=pt-BR"
 *
 * getCookie("tema") retornará "escuro".
 *
 * @param {string} name - Nome do cookie a ser procurado.
 * @returns {string} Valor encontrado ou string vazia ('').
 */
function getCookie(name) {

  // document.cookie retorna todos os cookies em uma única string:
  // "tema=escuro; idioma=pt-BR"
  //
  // split('; ') transforma essa string em um array:
  // ["tema=escuro", "idioma=pt-BR"]
  return document.cookie.split('; ').reduce((result, cookie) => {

    // Divide cada item no sinal "="
    //
    // Exemplo:
    // "tema=escuro"
    // vira:
    // key = "tema"
    // value = "escuro"
    const [key, value] = cookie.split('=');

    // Se a chave encontrada for igual ao nome procurado,
    // retorna o valor decodificado.
    //
    // decodeURIComponent() desfaz a codificação feita
    // por encodeURIComponent() ao salvar o cookie.
    //
    // Caso não seja o cookie procurado,
    // mantém o valor acumulado em "result".
    return key === name
      ? decodeURIComponent(value)
      : result;

  }, ''); // Valor inicial: string vazia caso o cookie não exista.
} 