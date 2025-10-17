import { useState } from "react"
export default function App() {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [joke, setJoke] = useState(null)

    async function getJoke() {
        try {
            setLoading(true)
            const res = await fetch('https://v2.jokeapi.dev/joke/Any')
            if (!res.ok) {
                throw new Error("Error: HTTP request failed")
            }
            const data = await res.json()
            if (data.type === "single") {
                setJoke({ setup: data.joke, delivery: "" })
            } else {
                setJoke({ setup: data.setup, delivery: data.delivery })
            }
        } catch (err) {
            setError(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }
    
  return (
      <>
          <button onClick={getJoke}>Get {joke ? "Another" : ""} Joke</button>
          {loading ? (
              <p>Loading joke...</p>
          ) : error ? (
              <h3>{error}</h3>
          ) : joke ? (
              <div>
                  <h3>{joke.setup}</h3>
                  <p>{joke.delivery}</p>
              </div>
          ) : null}
      </>
  )
}
