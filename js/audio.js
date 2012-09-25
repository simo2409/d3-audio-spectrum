function Audio(source, sampleRate) {
  this.context = source.context;
  this.source = source;
  this.sampleRate = sampleRate || 44100;
  this.playing = false;
  this.bufferSize = 2048;
}

Audio.prototype.connect = function() {
  this.gain = this.context.createGainNode();
  this.source.connect(this.gain);
  this.mono = new Float32Array(this.bufferSize/8);
}

Audio.prototype.connectProcessor = function(processor) {
  this.gain.connect(processor);
  processor.connect(this.context.destination);
}

Audio.prototype.setVolume = function(element) {
  var fraction=parseInt(element.value)/parseInt(element.max);
  this.gain.gain.value=fraction*fraction;
}

Audio.prototype.stop = function() { 
  this.source.source.noteOff(0);
  this.playing = false;
};

Audio.prototype.play = function(callback) {
  var source = this.source;
  var audio = this;
  document.getElementById("loader").style.display = 'block';
  this.source.load(function() {
    audio.connect();
    source.source.loop = true;
    source.source.noteOn(0);
    audio.playing = true;
    document.getElementById("loader").style.display = 'none';
    callback();
  });
}

Audio.prototype.routeAudio = function(event) {
  var input = {
    l: event.inputBuffer.getChannelData(0),
    r: event.inputBuffer.getChannelData(1)
  }
  var output = { 
    l: event.outputBuffer.getChannelData(0),
    r: event.outputBuffer.getChannelData(1)
  };
			
  for (var i = 0; i < this.bufferSize; ++i) {
    output.l[i] = input.l[i];
    output.r[i] = input.r[i];
    this.mono[i] = (input.l[i] + input.r[i]) / 2;
  }
}