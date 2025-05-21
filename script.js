const container = document.getElementById('pokemon-container');

async function getPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.innerHTML = `
    <h3>${pokemon.name}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p>Tipo: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
  `;
  container.appendChild(card);
}

async function loadPokemons() {
  for (let i = 1; i <= 10; i++) {
    const pokemon = await getPokemon(i);
    createPokemonCard(pokemon);
  }
}

loadPokemons();

document.getElementById('search').addEventListener('change', async (e) => {
  const name = e.target.value.toLowerCase();
  container.innerHTML = '';
  try {
    const pokemon = await getPokemon(name);
    createPokemonCard(pokemon);
  } catch {
    container.innerHTML = '<p>Pokémon não encontrado!</p>';
  }
});
