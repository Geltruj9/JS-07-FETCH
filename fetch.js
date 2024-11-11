let currentPokemonId = 1; // ID inicial del Pokémon

// Función para obtener los datos de un Pokémon por su ID o nombre
const fetchPokemon = async (query) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (response.ok) {
            const pokemonData = await response.json();
            return pokemonData;
        } else {
            console.error("Error al obtener los datos del Pokémon.");
            return null;
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        return null;
    }
};

// Función para guardar el Pokémon en localStorage
const savePokemonToLocalStorage = (pokemon) => {
    localStorage.setItem("pokemon", JSON.stringify(pokemon));
};

// Función para cargar el Pokémon desde localStorage
const loadPokemonFromLocalStorage = () => {
    const storedPokemon = localStorage.getItem("pokemon");
    return storedPokemon ? JSON.parse(storedPokemon) : null;
};

// Función para mostrar la tarjeta del Pokémon en el DOM
const displayPokemonCard = (pokemon) => {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = ""; // Limpiar el contenido previo

    if (pokemon) {
        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
            <h3>${pokemon.name.toUpperCase()}</h3>
            <p>ID: ${pokemon.id}</p>
            <p>Peso: ${pokemon.weight}</p>
            <div class="pokemon-image">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
        `;
        container.appendChild(card);
        currentPokemonId = pokemon.id; // Actualizar el ID actual
    }
};

// Función principal para cargar o actualizar la tarjeta de Pokémon
const initPokemonCard = async (query) => {
    let pokemon = loadPokemonFromLocalStorage();

    // Si no hay Pokémon en localStorage o si el ID es diferente, hacer fetch
    if (!pokemon || pokemon.id !== query) {
        pokemon = await fetchPokemon(query);
        if (pokemon) {
            savePokemonToLocalStorage(pokemon);
        }
    }

    // Mostrar la tarjeta en el DOM
    displayPokemonCard(pokemon);
};

// Funciones para manejar los botones de navegación
const loadNextPokemon = () => {
    currentPokemonId += 1;
    initPokemonCard(currentPokemonId);
};

const loadPreviousPokemon = () => {
    if (currentPokemonId > 1) {
        currentPokemonId -= 1;
        initPokemonCard(currentPokemonId);
    }
};

// Función para manejar la búsqueda por nombre o ID
const searchPokemon = () => {
    const query = document.getElementById("search-input").value.toLowerCase();
    if (query) {
        initPokemonCard(query);
    }
};

// Inicializar con un Pokémon específico
document.addEventListener("DOMContentLoaded", () => {
    initPokemonCard(currentPokemonId); // Cargar Pokémon inicial

    // Asignar eventos a los botones
    document.getElementById("next-btn").addEventListener("click", loadNextPokemon);
    document.getElementById("prev-btn").addEventListener("click", loadPreviousPokemon);
    document.getElementById("search-btn").addEventListener("click", searchPokemon);

    // Permitir búsqueda al presionar "Enter" en el input de búsqueda
    document.getElementById("search-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchPokemon();
        }
    });
});
