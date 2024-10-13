let currentPokemonId = null;
document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMON = 650;
  const pokemonId = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonId, 10);

  if (id < 1 || id > MAX_POKEMON) {
    return (window.location.href = "./index.html");
  }

  currentPokemonId = id;
  loadPokemon(id);
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
        response.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(
        (response) => response.json()
      ),
    ]);

    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail .move"
    );
    abilitiesWrapper.innerHTML = "";

    if (currentPokemonId === id) {
      displayPokemonDetail(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts .pokemon-description").textContent =
        flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((set) =>
        document.querySelector(set)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 650) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }
      window.history.pushState({},"",`./detail.html?id=${id}`)
    }
    return true;
  } catch (error) {
    console.error("An error occured fetching pokemon data", error);
    return false;
  }
}
