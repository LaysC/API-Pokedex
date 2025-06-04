// Pegando elementos que vou usar no código
const pokemonDescricao = document.getElementById('pokemon-descricao');
const mensagemErro = document.getElementById('mensagem-erro');
const mensagemLoading = document.getElementById('mensagem-loading');

let idAtualPokemon = 1; // Guarda o ID do Pokémon que está aparecendo

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do HTML que vou mexer
  const inputPesquisar = document.getElementById('input-pesquisar');
  const btnPesquisar = document.getElementById('btn-pesquisar');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnProximo = document.getElementById('btn-proximo');
  const pokemonInfo = document.getElementById('pokemon-info');
  const btnsNavegacao = document.querySelector('.btms-navegacao');
  const pokemonImagem = document.getElementById('pokemon-imagem');
  const pokemonNome = document.getElementById('pokemon-nome');

  // Função que busca o Pokémon pela API usando nome ou ID
  const fetchPokemon = async (identificadorPokemon) => {
    mostrarLoading();

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificadorPokemon.toString().toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon não encontrado');

      const pokemon = await response.json();

      idAtualPokemon = pokemon.id; // Atualiza o ID antes de tudo
      mostrarPokemonNaTela(pokemon); // Só depois mostra os dados

      mensagemErro.classList.add('hidden');
      pokemonInfo.classList.remove('hidden');
    } catch (error) {
      mostrarErro();
    } finally {
      mensagemLoading.classList.add('hidden');
    }
  };

  // Função pra buscar Pokémon por nome parcial (pra facilitar a busca)
  const buscarPorNomeParcial = async (query) => {
    mostrarLoading();

    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      if (!response.ok) throw new Error('Erro ao carregar lista');

      const data = await response.json();

      // Procura o primeiro que contenha o texto digitado
      const resultado = data.results.find(p => p.name.includes(query.toLowerCase()));

      if (resultado) {
        await fetchPokemon(resultado.name);
      } else {
        mostrarErro();
      }
    } catch (error) {
      mostrarErro();
    } finally {
      mensagemLoading.classList.add('hidden');
    }
  };

  // Coloca os dados do Pokémon na tela, incluindo altura e peso
  const mostrarPokemonNaTela = (pokemon) => {
    pokemonImagem.src = pokemon.sprites.front_default || '';
    pokemonImagem.alt = `Imagem do ${pokemon.name}`;
    pokemonNome.textContent = `#${pokemon.id} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;

    const alturaMetros = pokemon.height / 10;
    const pesoKg = pokemon.weight / 10;

    pokemonDescricao.innerHTML = `
      Tipo(s): ${pokemon.types.map(t => t.type.name).join(', ')} ||
      Altura: ${alturaMetros.toFixed(2)} m ||
      Peso: ${pesoKg.toFixed(2)} kg
    `;

    pokemonInfo.classList.remove('hidden');
    btnsNavegacao.classList.remove('hidden');

    atualizarBotoes();
  };

  // Mostra o loading e esconde as outras coisas
  const mostrarLoading = () => {
    mensagemLoading.classList.remove('hidden');
    pokemonInfo.classList.add('hidden');
    mensagemErro.classList.add('hidden');
    btnsNavegacao.classList.add('hidden');
  };

  // Mostra a mensagem de erro e esconde o resto
  const mostrarErro = () => {
    pokemonNome.textContent = "";
    pokemonDescricao.textContent = "";
    mensagemErro.classList.remove("hidden");
    pokemonInfo.classList.add("hidden");
    btnsNavegacao.classList.add("hidden");
  };

  // Habilita ou desabilita o botão anterior conforme o ID do Pokémon
  const atualizarBotoes = () => {
    btnAnterior.disabled = idAtualPokemon <= 1;
  };

  // Ativa ou desativa o botão buscar dependendo se o campo está vazio
  const atualizarBotaoPesquisar = () => {
    btnPesquisar.disabled = inputPesquisar.value.trim() === "";
  };

  // Quando clicar no botão buscar, decide se busca por ID ou nome parcial
  btnPesquisar.addEventListener("click", () => {
    const query = inputPesquisar.value.trim();
    if (!query) return;

    if (/^\d+$/.test(query)) {
      fetchPokemon(query); // Busca por ID
    } else {
      buscarPorNomeParcial(query); // Busca por nome parcial
    }
  });

  // Atualiza o botão buscar enquanto digita
  inputPesquisar.addEventListener("input", atualizarBotaoPesquisar);

  // Permite apertar Enter pra buscar
  inputPesquisar.addEventListener("keypress", (event) => {
    if (event.key === "Enter") btnPesquisar.click();
  });

  // Botão anterior diminui o ID atual
  btnAnterior.addEventListener("click", () => {
    if (idAtualPokemon > 1) fetchPokemon(idAtualPokemon - 1);
  });

  // Botão próximo aumenta o ID atual
  btnProximo.addEventListener("click", () => {
    fetchPokemon(idAtualPokemon + 1);
  });

  atualizarBotaoPesquisar(); // Desabilita o botão buscar no início
  fetchPokemon(idAtualPokemon); // Carrega o primeiro Pokémon (ID 1)
});
