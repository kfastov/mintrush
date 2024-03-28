import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {delegateAccess} from './w3storage.js';


const app = express();

const corsOptions = {
	origin: '*',
	allowedHeaders: 'Content-Type, Authorization',
	allowedMethods: 'GET, POST, PUT, DELETE',
	maxAge: 3600, // 1 hour
};

const corsMiddleware = cors(corsOptions);

app.use(corsMiddleware);
app.use(bodyParser.json());

app.post('/test', async (req, res) => {

	const {did} = req.body;

    // return res.status(500).send({ error: error.message });

    const delegation = await delegateAccess(did)

	const base64 = Buffer.from(delegation).toString('base64')
	res.send({delegation: base64});
});

app.listen(3000, () => {
	console.log('Service listening on port 3000');
});
