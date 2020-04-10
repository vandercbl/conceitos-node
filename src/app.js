const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function loadRequests(request, response, next) {
	const { method, url } = request

	const logLabel = `[${method.toUpperCase()}] ${url}`

	console.time(logLabel)
	
	next()

	console.timeEnd(logLabel)
}

app.use(loadRequests)

app.get("/repositories", (request, response) => {
	return response.json(repositories)
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0
	}

	repositories.push(repository)

	return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params
	const { title, url, techs } = request.body

	if (!isUuid(id)) {
		return response.status(400).json({ error: 'Id invalid format'})
	}

	const repositoryIndex = repositories.findIndex(repository => repository.id === id)

	if (repositoryIndex < 0) {
		return response.status(401).json({ error: 'Id not found'})		
	}

	repositories[repositoryIndex].title = title
	repositories[repositoryIndex].url = url
	repositories[repositoryIndex].techs = techs

	return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", (req, res) => {
	const { id } = req.params

	const repositoryIndex = repositories.findIndex(repository => repository.id === id)

	if (repositoryIndex < 0) {
		return res.status(400).json({ error: 'Id not found'})
	}

	repositories.splice(repositoryIndex, 1)

	return res.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params

	const repositoryIndex = repositories.findIndex(repository => repository.id === id)

	if (repositoryIndex < 0) {
		return response.status(400).json({ error: 'Id not found'})
	}

	repositories[repositoryIndex].likes += 1

	return response.json(repositories[repositoryIndex])
});

module.exports = app;
