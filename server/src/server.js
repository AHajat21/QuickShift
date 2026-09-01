import app from "./app.js"

const PORT = process.env.PORT || 4000

app.listen(PORT, (error) => {
	if (error) throw error
	console.log(`Express app working on port: ${PORT}`)
})

// Connect database function call here