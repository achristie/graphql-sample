const express = require('express');
const graphqlHTTP = require('express-graphql');
const { 
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType
 } = require('graphql');
const { globalIdField, connectionDefinitions, connectionFromPromisedArray, connectionArgs } = require('graphql-relay');

const { getVideoById, getVideos, createVideo } = require('./src/data/index');
const { nodeInterface, nodeField } = require('./src/node');

const PORT = process.env.port || 3000;
const app = express();

// const instructorType = new GraphQLObjectType({
//   fields: {
//     id: {
//       type: GraphQLID,
//       description: 'The id of the video.'
//     }
//   },
//   interfaces: [nodeInterface]
// });

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'Just a test video',
  fields: {
    id: globalIdField(),
    title: {
      type: GraphQLString,
      description: 'The title of the video'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video in seconds'
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video'
    }
  },
  interfaces: [nodeInterface]
});

exports.videoType = videoType;

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'A count of the total number of objects in this connection.',
      resolve: conn => {
        return conn.edges.length;
      }
    }
  })
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    // videos: {
    //   type: new GraphQLList(videoType),
    //   resolve: getVideos
    // },
    node: nodeField,
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args
      )
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      }
    }
  }
});

const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video'
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video in seconds'
    },
    watched: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the video has been released.'
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType)
        }
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
  // subscription
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});



// deal
/*
id,
name,
order: []


// order
id,
name,
deal: {}

*/