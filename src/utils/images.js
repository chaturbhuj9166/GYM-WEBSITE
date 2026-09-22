// All photography is served from the Unsplash CDN with on-the-fly resizing,
// so every <img> gets a responsive srcset and a modern format (auto=format).
const BASE = 'https://images.unsplash.com/photo-'

export const IMAGES = {
  hero: '1605296867304-46d5465a13f1',
  philosophy: '1526506118085-60ce8714f8c5',
  grind: '1507398941214-572c25f4b1dc',
  strength: '1517963879433-6ad2b056d712',
  hypertrophy: '1581009146145-b5ef050c2e1e',
  conditioning: '1599058917212-d750089bc07e',
  mobility: '1518611012118-696072aa579a',
  lifting: '1541534741688-6078c6bfb5c5',
  equipment: '1544033527-b192daee1f5b',
  training: '1579758629938-03607ccdbaba',
  running: '1476480862126-209bfaa8edc8',
  boxing: '1591117207239-788bf8de6c3b',
  squat: '1574680096145-d05b474e2155',
  dumbbells: '1576678927484-cc907957088c',
}

const WIDTHS = [480, 800, 1200, 1600, 2200]

export const imgUrl = (id, width = 1200, quality = 72) =>
  `${BASE}${id}?auto=format&fit=crop&w=${width}&q=${quality}`

export const imgSrcSet = (id, widths = WIDTHS, quality = 72) =>
  widths.map((w) => `${imgUrl(id, w, quality)} ${w}w`).join(', ')
