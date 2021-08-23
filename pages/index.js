import connectMongoDB from '../common/ConnectMongoDB';
import Head from 'next/head';
import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
  console.log('list supplied throuhg getServerSideProps');
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </>
  );
}

export async function getStaticProps() {
  const client = await connectMongoDB();
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  // transform
  const meetupsTransformed = meetups.map((meetup) => ({
    id: meetup._id.toString(),
    title: meetup.title,
    address: meetup.address,
    image: meetup.image,
  }));

  client.close();

  return {
    props: {
      meetups: meetupsTransformed,
    },
    revalidate: 1,
  };
}

// SSR; not needed here
// export function getServerSideProps(context) {
//   const req = context.req;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
