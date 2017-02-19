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

const createVideo = ({ title, duration, watched }) => {
  const video = {
    id: (new Buffer(title, 'utf8')).toString('base64'),
    title,
    duration,
    watched
  };

  videos.push(video);
  return video;
};

const getVideoById = id => new Promise(resolve => {
  const [video] = videos.filter(v => {
    return v.id === id;
  });

  resolve(video);
});

const getVideos = () => new Promise(resolve => resolve(videos));

const getObjectById = (type, id) => {
  const types = {
    video: getVideoById,
  };

  return types[type](id);
};

module.exports ={
  getVideoById,
  getVideos,
  createVideo,
  getObjectById
}
