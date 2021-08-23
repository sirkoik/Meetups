// /api/new-meetup
import connectMongoDB from '../../common/ConnectMongoDB';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await connectMongoDB();
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;
