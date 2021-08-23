import { ObjectId } from 'mongodb';
import Head from 'next/head';
import connectMongoDB from '../../common/ConnectMongoDB';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>
          {props.meetupData.title} at {props.meetupData.address}
        </title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await connectMongoDB();
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  const meetupPaths = meetups.map((meetup) => ({
    params: {
      meetupId: meetup._id.toString(),
    },
  }));

  client.close();

  return {
    fallback: 'blocking',
    paths: meetupPaths,
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  console.log('Meetup id', meetupId);

  const client = await connectMongoDB();
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        image: selectedMeetup.image,
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
