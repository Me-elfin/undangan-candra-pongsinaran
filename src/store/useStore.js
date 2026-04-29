import { create } from 'zustand'

const useStore = create((set) => ({
  config: null,
  user: null,
  isMusicPlaying: false,
  setConfig: (config) => set({ config }),
  setUser: (user) => set({ user }),
  setMusicPlaying: (isMusicPlaying) => set({ isMusicPlaying }),
}))

export default useStore
