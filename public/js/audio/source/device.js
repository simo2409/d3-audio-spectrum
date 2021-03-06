/*
  Audio input device used to collect data for analysis
*/
SA.Audio.Source.Device = function(context) {
  this.context = context;
}

/*
  Initialize the available audio inputs and fire the given callback when finished
*/
SA.Audio.Source.Device.prototype.load = function(callback) {
  SA.Audio.Source.Device._ensureUserMediaIsInitialized();
  var input = this;
  var sourceCallback = function(sourceInfos) {
    input._sourceLoadedCallback(sourceInfos, callback);
  }
  MediaStreamTrack.getSources(sourceCallback);
}

SA.Audio.Source.Device.prototype.stop = function() {
  this.disconnect();
}

SA.Audio.Source.Device.prototype.connect = function(connector) {
  this.source.connect(connector);
}

SA.Audio.Source.Device.prototype.disconnect = function() {
  this.source.disconnect();
}

/*
  Initialize the given audio input and fire the callback when finished
*/
SA.Audio.Source.Device.prototype._initializeSource = function(sourceInfo, callback) {
  var args = SA.Audio.Source.Device._getSystemArgs(sourceInfo);
  var errorCallback = function(error) {
    console.log(error);
  }
  navigator.getUserMedia(args, this._getStreamLoadedCallback(callback), errorCallback);
}

SA.Audio.Source.Device.prototype._getStreamLoadedCallback = function(callback) {
  var input = this;
  return function(stream) {
    input._streamLoadedCallback(stream, callback);
  }
}

SA.Audio.Source.Device.prototype._streamLoadedCallback = function(stream, callback) {
  this.source = this.context.createMediaStreamSource(stream, callback);
  callback();
}

SA.Audio.Source.Device.prototype._sourceLoadedCallback = function(sourceInfos, callback) {
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === "audio") {
      return this._initializeSource(sourceInfo, callback);
    }
  }
}

SA.Audio.Source.Device._getUserMedia = function() {
  return navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

SA.Audio.Source.Device._ensureUserMediaIsInitialized = function() {
  if (navigator.getUserMedia == null) {
    navigator.getUserMedia = AudioInput._getUserMedia();
  }
}

SA.Audio.Source.Device._getSystemArgs = function(sourceInfo) {
  return {
    audio: {
      optional: [
        { sourceId: sourceInfo.id }
      ]
    }
  };
}
