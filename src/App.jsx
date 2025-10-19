import { useState } from "react"
export default function App() {
    const [selectedCategories, setSelectedCategories] = useState([])
    const [joke, setJoke] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const allCategories = ["Programming", "Misc", "Dark", "Pun", "Spooky", "Christmas"]
    function toggleCategory(category) {
        setSelectedCategories(prev => 
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        )
    }
    
    async function getJoke() {
        try {
            setJoke(null)
            setError(null)
            setLoading(true)
            const urlPath = selectedCategories.length > 0 ? selectedCategories.join(",") : "Any"
            const res = await fetch(`https://v2.jokeapi.dev/joke/${urlPath}`)
            if (!res.ok) {
                throw new Error("HTTP request failed")
            }
            const data = await res.json()
            setJoke(data.type === "twopart"
                ? { setup: data.setup, delivery: data.delivery }
                : { setup: data.joke, delivery: "" }
                ) 
        } catch (err) {
            setError(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }
    
  return (
      <div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "10px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"}}>
              <h3>By default, a joke from any category will be shown. Select specific categories below to filter:</h3>
              <div style={{display: "flex", flexDirection: "column", gap: "3px"}}>
                  {allCategories.map(category => (
                      <label key={category}>
                          <input
                              type="checkbox"
                              onChange={() => toggleCategory(category)}
                              checked={selectedCategories.includes(category)}
                          />
                          &nbsp;
                          {category}
                      </label>
                  ))}
              </div>
              <button style={{backgroundColor: "#008cff", color: "white", padding: "5px 10px", fontSize: "16px", fontWeight: "bold"}} onClick={getJoke}>Get Joke</button>
          </div>
          {loading ? (
              <h2>Loading...</h2>
          ) : error ? (
              <h2 style={{color: "red"}}>{error}</h2>
          ) : joke ? (
              <div style={{border: "2px solid orange", display: "flex", flexDirection: "column", padding: "10px", gap: "10px"}}>
                  <h3>{joke.setup}</h3>
                  {joke.delivery && <p>{joke.delivery}</p>}
              </div>
          ) : null}
      </div>
  )
}
