;(() => {
  'use strict'

  const get = (element) => document.querySelector(element)
  const allowUser = {
    audio: true,
    video: true,
  }

  class WebRtc {
    constructor() {
      this.media = new MediaSource()
      this.recorder
      this.blobs
      this.playedVideo = get('video.played')
      this.recordVideo = get('video.record')
      this.btnDownload = get('.btn_download')
      this.btnRecord = get('.btn_record')
      this.btnPlay = get('.btn_play')
      this.container = get('.webrtc')
      this.events()
      navigator.mediaDevices.getUserMedia(allowUser).then((videoAudio) => {
        this.success(videoAudio)
      })
    }

    events() {
      this.btnRecord.addEventListener('click', this.toggleRecord.bind(this))
      this.btnPlay.addEventListener('click', this.play.bind(this))
      this.btnDownload.addEventListener('click', this.download.bind(this))
    }

    success(audioVideo) {
      this.btnRecord.removeAttribute('disabled')
      window.stream = audioVideo
      if (window.URL) {
        this.playedVideo.setAttribute('src', window.URL.createObjectURL(audioVideo))
      } else {
        this.playedVideo.setAttribute('src', audioVideo)
      }
    }

    toggleRecord() {
      if ('녹화' === this.btnRecord.textContent) {
        this.startRecord()
      } else {
        this.btnPlay.removeAttribute('disabled')
        this.btnDownload.removeAttribute('disabled')
        this.btnRecord.textContent = '녹화'
        this.stopRecord()
      }
    }

    startRecord() {
      let type = { mimeType: 'video/webm;codecs=vp9' }
      this.blobs = []
      if (!MediaRecorder.isTypeSupported(type.mimeType)) {
        type = { mimeType: 'video/webm' }
      }
      this.recorder = new MediaRecorder(window.stream, type)
      this.btnRecord.textContent = '중지'
      this.btnPlay.setAttribute('disabled', true)
      this.btnDownload.setAttribute('disabled', true)
      this.recorder.ondataavailable = this.pushBlobData.bind(this)
      this.recorder.start(20)
    }

    stopRecord() {
      this.recorder.stop()
      this.recordVideo.setAttribute('controls', true)
    }


  }

  new WebRtc() 
})()
