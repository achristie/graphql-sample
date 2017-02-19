const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
  type Video {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Query {
    video: Video,
    videos: [Video]
  }

  type Schema {
    query: Query
  }
`);

const videoA = {
  id: 'a',
  title: 'Startrek',
  duration: 200,
  watched: false
};

const videoB = {
  id: 'b',
  title: 'Forest Gump',
  duration: 300,
  watched: true
};

const videos = [videoA, videoB];

const resolvers = {
  video: () => ({
    id: () => '1',
    title: () => 'bar',
    duration: () => 100,
    watched: () => true
  }),
  videos: () => videos
};

const query = `
  query myFirstQuery {
    videos {
      id,
      title,
      duration,
      watched
    }
  }
`;

graphql(schema, query, resolvers)
  .then(res => console.log(res))
  .catch(err => console.log(err));