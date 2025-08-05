const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))