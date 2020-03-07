import express from 'express';

import bodyParser = require('body-parser');
import { tempData } from './temp-data';

const app = express();

const PORT = 3232;

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/api/tickets', (req, res) => {

	const search = req.query.search || '';
	const labels = req.query.labels || [];

	let filteredData = tempData
		.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(search.toLowerCase()));
	
	if(labels.length > 0) {
		filteredData = filteredData.filter(t => t.labels?.flat(1).some(l=> labels.includes(l)));
	}

	const page = req.query.page || 1;
	const hasNextPage = filteredData.length > page * PAGE_SIZE;
	const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	
	res.send({paginatedData, hasNextPage});
});

app.get('/api/labels', (req, res) => {

	const labels = Array.from(new Set(tempData.map((ticket: any) => ticket.labels).flat(1))).filter(l => l != null);
	res.send(labels);
});

app.listen(PORT);
console.log('server running', PORT)

