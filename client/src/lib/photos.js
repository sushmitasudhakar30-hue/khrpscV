// Drop real photography into src/assets/photos. Recognised names (any of jpg/png/webp, or mp4/webm):
//   hero, hero-video, mission, story-1, story-2 ...  Missing files fall back to art-directed graphics.
const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,mp4,webm}', { eager: true, query: '?url', import: 'default' });
export const photo = (name) => {
  const k = Object.keys(files).find((f) => f.split('/').pop().replace(/\.[^.]+$/, '') === name);
  return k ? files[k] : null;
};
