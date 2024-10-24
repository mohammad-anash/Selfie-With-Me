const vidEle = document.getElementById('vid');
const btnEle = document.getElementById('take-pic');
const canvas = document.getElementById('canvas');
const storeImg = document.getElementById('images');
let getMediaStream;
const recordedChunks = [];
let getMediaRecorded;

const startCamera = () => {
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        vidEle.srcObject = stream;
        getMediaStream = stream;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const takePictureOnButtonClick = () => {
  const createImg = document.createElement('img');
  const context = canvas.getContext('2d');
  context.drawImage(vidEle, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/png');
  createImg.src = dataUrl;

  const iconDiv = document.createElement('div');
  iconDiv.innerHTML = `<i class="ri-more-2-line"></i>`;
  iconDiv.classList.add('icon');

  createImg.append(iconDiv);
  storeImg.append(createImg);
};

const startVideo = () => {
  const setControllAttri = vidEle.setAttribute('controls', '');

  const mediaRecorder = new MediaRecorder(getMediaStream);
  mediaRecorder.start();

  mediaRecorder.ondataavailable = function (event) {
    recordedChunks.push(event.data);
  };

  getMediaRecorded = mediaRecorder;
};

const stopVideoAndStore = () => {
  console.log(getMediaRecorded);
  getMediaRecorded.stop();

  getMediaRecorded.onstop = function () {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const createVideo = document.createElement('video');
    createVideo.setAttribute('controls', '');
    createVideo.src = url;

    storeImg.append(createVideo);
  };

  vidEle.removeAttribute('controls');
};

const handleApplicationFeature = (event) => {
  const conditions = event.target.id;
  switch (conditions) {
    case 'take-pic':
      takePictureOnButtonClick();
      break;
    case 'onVideo':
      startVideo();
      break;
    case 'stopVideo':
      stopVideoAndStore();
      break;
  }
};

startCamera();

window.addEventListener('keydown', function (event) {
  const altKey = event.altKey;
  const key = event.key;

  if (event.altKey && event.key === 'p') {
    takePictureOnButtonClick();
  } else if (altKey && key === 'o') {
    startVideo();
  } else if (altKey && key === 's') {
    stopVideoAndStore();
  } else {
    return;
  }
});

document.body.addEventListener('click', handleApplicationFeature);
