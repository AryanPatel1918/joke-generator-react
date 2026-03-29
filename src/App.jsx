import { useState } from "react"
export default function App() {
    const [jokeCategory, setJokeCategory] = useState('Any')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [joke, setJoke] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const jokeCategories = ["Programming", "Misc", "Dark", "Pun", "Spooky", "Christmas"]

    function updateSelectedCategories(selected) {
        setSelectedCategories(prev => {
            if (prev.includes(selected)) {
                return prev.filter(category => category !== selected)
            } else {
                const updated = [...prev, selected]
                return jokeCategories.filter(category => updated.includes(category))
            }
        })
    }
    
    async function fetchJoke() {
        setError(false)
        setLoading(true)
        try {
            const categories = jokeCategory === 'Custom' && selectedCategories.length > 0 ? selectedCategories.join("/") : 'Any'
            const res = await fetch(`https://v2.jokeapi.dev/joke/${categories}`)
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`)
            }
            const data = await res.json()
            setJoke(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <>
            <div style={{ border: "3px solid orange", padding: 8, display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>
                        <input type="radio" onChange={() => setJokeCategory('Any')} checked={jokeCategory === "Any"}  />
                        Any
                    </label>
                    <div style={{ display: "flex" }}>
                        <label style={{ display: "flex", alignItems: "center" }}>
                            <input type="radio" onChange={() => setJokeCategory('Custom')} checked={jokeCategory === "Custom"}  />
                            Custom:
                        </label>
                        <div style={{ pointerEvents: jokeCategory === "Any" ? "none" : "auto", opacity: jokeCategory === "Any" ? 0.6 : 1 }}>
                            {jokeCategories.map(category => (
                                <label key={category}>
                                    <input type="checkbox" onChange={() => updateSelectedCategories(category)} />
                                    {category}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={fetchJoke}>Fetch Joke</button>
            </div>
            
            {loading ? (
                <p>Loading...</p>
            ) : joke ? (
                <div>
                    {joke.type === "twopart" ? (
                        <>
                            <h3>{joke.setup}</h3>
                            <p>{joke.delivery}</p>
                        </>
                    ) : (
                        <h3>{joke.joke}</h3>
                    )}
                    {/* <pre>{JSON.stringify(joke, null, 2)}</pre> */}
                </div>
            ) : (
                <h3>{error}</h3>
            )}
        </>
    )
}
