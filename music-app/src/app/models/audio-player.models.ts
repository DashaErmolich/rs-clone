export interface IAudioPlayerState {
  progress: number,
  duration: number,
  time: string,
  durationTime: string,
  volume: number,
}

export interface IPlayerControlsState {
  isRepeatAllOn: boolean,
  isRepeatOneOn: boolean,
  isFirstTrack: boolean,
  isLastTrack: boolean,
  isLiked: boolean,
  isShuffleOn: boolean,
}
