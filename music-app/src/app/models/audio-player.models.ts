export interface IAudioPlayerState {
  progress: number,
  duration: number,
  time: string,
  durationTime: string,
}

export interface IPlayerControlsState {
  isPlay: boolean,
  isMute: boolean,
  isRepeatAllOn: boolean,
  isRepeatOneOn: boolean,
  isFirstTrack: boolean,
  isLastTrack: boolean,
  isLiked: boolean,
  isShuffleOn: boolean,
  isTrackReady: boolean,
}
