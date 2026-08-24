// Silent Audio Controller (Sound Effects Disabled)

class SoundSynthesizer {
  public setEnabled(_enabled: boolean): void {}
  public toggleMute(): boolean { return true; }
  public getMutedState(): boolean { return true; }
  public playHover(): void {}
  public playClick(): void {}
  public playModalOpen(): void {}
  public playModalClose(): void {}
  public playLaunchWarp(): void {}
  public playSuccessFanfare(): void {}
}

export const sound = new SoundSynthesizer();
