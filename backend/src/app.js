const express = require('express');
const cors = require('cors');
const config = require('./config');
const proposalRoutes = require('./routes/proposalRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.FRONTEND_URL }));

app.use('/api/proposals', proposalRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

module.exports = app;