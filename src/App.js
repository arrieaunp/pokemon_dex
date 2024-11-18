import { useState } from "react";
import axios from "axios";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPokemonList = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?offset=0&limit=151"
      );
      const pokemonData = response.data.results;

      const detailedData = await Promise.all(
        pokemonData.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return {
            name: details.data.name.toUpperCase(),
            types: details.data.types.map((type) => type.type.name),
            stats: details.data.stats.reduce((acc, stat) => {
              acc[stat.stat.name] = stat.base_stat;
              return acc;
            }, {}),
            image: details.data.sprites.front_default,
          };
        })
      );
      setPokemonList(detailedData);
    } catch (error) {
      console.error("Error fetching Pokemon data: ", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>API Pokemon</h1>
      <button
        onClick={fetchPokemonList}
        style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "blue", color: "white" }}
      >
        Get pokemon dex
      </button>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {pokemonList.map((pokemon, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              margin: "10px",
              backgroundColor: "#e8f5e9",
              width: "200px",
            }}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              style={{ width: "100px", height: "100px" }}
            />
            <h3>Name: {pokemon.name}</h3>
            <p>Type 1: {pokemon.types[0]}</p>
            {pokemon.types[1] && <p>Type 2: {pokemon.types[1]}</p>}
            <h4>Base Stats:</h4>
            <p>HP: {pokemon.stats.hp}</p>
            <p>Attack: {pokemon.stats.attack}</p>
            <p>Defense: {pokemon.stats.defense}</p>
            <p>Special Attack: {pokemon.stats["special-attack"]}</p>
            <p>Special Defense: {pokemon.stats["special-defense"]}</p>
            <p>Speed: {pokemon.stats.speed}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
