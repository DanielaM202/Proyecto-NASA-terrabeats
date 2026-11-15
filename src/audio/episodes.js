// One voice at a time. The playlist episodes register the audio element that is
// playing here, so every other narrator (welcome, help, live story, speech) can
// silence it, and the other way round.

let active = null;

export const setActiveEpisode = (audio) => {
  active = audio;
};
export const getActiveEpisode = () => active;
export const episodePlaying = () => !!active && !active.paused && !active.ended;
export const pauseActiveEpisode = () => {
  if (episodePlaying()) active.pause();
};
