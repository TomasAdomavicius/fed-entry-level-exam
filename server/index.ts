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

function dateFromString(dateString: string) {
	const dateParts = dateString.split("/");
	return +new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
  };

app.get('/api/tickets', (req, res) => {

	let search = req.query.search || '';
	const labels = req.query.labels || [];

	const re = /(((after:)|(before:))(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00)))))|(from:\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)/g;
	let filteredData = tempData;
	const match = search.match(re);

	if(match !== null) {
		match.forEach((f: string) => {
			let parts = f.split(':');
			switch(parts[0]) {
				case 'after':
					filteredData = filteredData.filter(t => +new Date(t.creationTime) > dateFromString(parts[1]))
					search=search.split(" ").filter((word: string)=> word!==f).join(' ');
					
					break;
				case 'before':
					filteredData = filteredData.filter(t => +new Date(t.creationTime) < dateFromString(parts[1]));
					search=search.split(" ").filter((word: string)=> word!==f).join(' ');
					break;
				case 'from':
					filteredData = filteredData.filter(t => t.userEmail === parts[1]);
					search=search.split(" ").filter((word: string)=> word!==f).join(' ');
			  }
		});
	}

	filteredData = filteredData
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

