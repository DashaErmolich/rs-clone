export interface IEqualizerPresetsData {
  type: string,
  presets: IEqualizerPreset[],
  preampZeroValue: number,
  maxValueOfPlus12dB: number,
  minValueOfPlus12dB: number
}

export interface IEqualizerPresetsInfo {
  preampZeroValue: IEqualizerPresetsData['preampZeroValue'],
  maxValueOfPlus12dB: IEqualizerPresetsData['maxValueOfPlus12dB'],
  minValueOfPlus12dB: IEqualizerPresetsData['minValueOfPlus12dB']
}

export interface IEqualizerPreset {
  name: string,
  hz70: number,
  hz180: number,
  hz320: number,
  hz600: number,
  hz1000: number,
  hz3000: number,
  hz6000: number,
  hz12000: number,
  hz14000: number,
  hz16000: number
}

export interface IEqualizerFrequencies {
  frequency: number,
  minVal: number,
  maxVal: number,
  initialVal: number,
}
