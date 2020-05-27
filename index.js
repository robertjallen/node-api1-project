const express = require("express")
const db = require("./database.js")

// creates our server instance
const server = express()

// we'll talk about this later, just copy it for now
server.use(express.json())

server.get("/", (req, res) => {
	res.json({ message: "hello, world" })
})

//--------------------------------
//       READ
//-----------------------------------
server.get("/api/users", (req, res) => {
	// don't worry about the function implementation yet, just call it.
    // it's essentially "faking" a real database
    
    const users = db.getUsers()
    if(users){
        res.json(users)
    }else{
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
})

server.get("/api/users/:id", (req, res) => {
	// our route params come into variables with the same name as the param.
	// so :id === req.params.id
	const userId = req.params.id
	const user = db.getUserById(userId)

	if (user) {
		res.json(user)
    }else if(!user){
        res.status(404).json({
			message: "The user with the specified ID does not exist.",
		})
    }else{
        res.status(500).json({
			message: "The user information could not be retrieved.",
		})
    } 
})

//----------------------------
//     CREATE
//---------------------------
server.post("/api/users", (req, res) => {
	// we don't want to create a user with an empty name, so check for it
	if (!req.body.name) {
		return res.status(400).json({
			message: "Please provide name and bio for the user.",
		})
	}

	const newUser = db.createUser({
        name: req.body.name,
        bio: req.body.bio
	})

	// 201 status code means a resource was successfully created
	res.status(201).json(newUser)
})

//---------------------------------------
//           UPDATE
//----------------------------------------
server.put("/api/users/:id", (req, res) => {
	const user = db.getUserById(req.params.id)

	// can't update a user that doesn't exist, so make sure it exists first
	if (user) {
		const updatedUser = db.updateUser(user.id, {
			// use a fallback value if no name is specified, so it doesn't empty the field
			name: req.body.name || user.name,
		})

		res.json(updatedUser)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

//---------------------------------------
//           DELETE
//---------------------------------------
server.delete("/api/users/:id", (req, res) => {

	const found = db.getUserById(req.params.id)

	if (found) {
		db.deleteUser(req.params.id)
		// response returns id
		res.status(200).json(found.id)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);