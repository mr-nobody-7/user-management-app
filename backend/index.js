const express = require("express");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
const app = express();

//json
app.use(express.json())

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


//test api
app.get('/test', async (req, res) => {
    try {
        res.status(200).json({message: 'api is working'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message});
    }
});

// get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

// get user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

// create user
app.post('/users', async (req, res) => {
    try {
        const existingUser = await prisma.user.findUnique({ 
            where: { email: req.body.email }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = await prisma.user.create({ 
            data: {
                name: req.body.name,
                email: req.body.email,
            } 
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// update user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name: req.body.name || user.name,
                email: req.body.email || user.email,
            },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
})

// delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});