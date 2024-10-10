const MAX_POKEMON = 1000;
const listWrapper = document.querySelector(".list-warpper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

//!--------------fetch all the pokemons-----------------
let allPokemon = [];
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemon = data.results;
    displayPokemons(allPokemon);
});
//!------------fetch data before redirect--------------
async function fetchDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => response.json()),
        ]);
        return true;
    } catch (error) {
        console.error("failed to fetch pokemon before redirect");
    }
}

//!------------display pokemon--------------------------
function displayPokemons (pokemon) {
    listWrapper.innerHTML = ""; //empty the div

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        // listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="border border-black flex flex-col items-center justify-center rounded-xl">
                <div class="number-wrap ">
                <p class="text-lg font-bold ">#${pokemonID}</p>
            </div>
            <div class="image-wrap">
                <img class="w-40 h-40" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"/>
            </div>
            <div>
                <p class = "text-2xl font-bold text-[#47617a]">${pokemon.name}</p>
            </div>
            </div>
        `; 

        //click event for switching the details html file
        listItem.addEventListener('click',async () => {
            const success = await fetchDataBeforeRedirect(pokemonID);
            if(success){
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });
        listWrapper.appendChild(listItem);
    });
}

//!----------------search feature---------------------
searchInput.addEventListener("keyup",handleSearch);
function handleSearch(){
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemon;

    if(numberFilter.checked){
        filteredPokemon = allPokemon.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    }
    else if(nameFilter.checked){
        filteredPokemon = allPokemon.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    }
    else{
        filteredPokemon = allPokemon;
    }
    displayPokemons(filteredPokemon);

    if(filteredPokemon.length === 0){
        notFoundMessage.style.display = "block";
    }
    else{
        notFoundMessage.style.display = "none";
    }
}

//!-------------------close button icon---------------------
const closeBtn = document.querySelector(".search-close-icon");
closeBtn.addEventListener("click",clearSearch);

function clearSearch (){
    searchInput.value = "";
    displayPokemons(allPokemon);
    notFoundMessage.style.display = "none";
}
