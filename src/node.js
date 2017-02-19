const {
  nodeDefinitions,
  fromGlobalId
} = require('graphql-relay');

// const { videoType } = require('../server');
const { getObjectById } = require('./data');

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectById(type.toLowerCase(), id);
  },
  object => {
    const { videoType } = require('../server');
    if (object.title) {
      return videoType;
    }
    return null;
  }
)

// const nodeInterface = new GraphQLInterfaceType({
//   name: 'Node',
//   fields: {
//     id: {
//       type: new GraphQLNonNull(GraphQLID)
//     }
//   },
//   resolveType: object => {
//     if (object.title) {
//       return videoType;
//     }
//     return null;
//   }
// });

module.exports = {
  nodeInterface,
  nodeField
};