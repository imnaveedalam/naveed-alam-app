export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  place: string;
  caption: string;
};

/** Placeholder frames. Replace `src` with real trip photos later. */
export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "makran",
    src: "/gallery/makran.svg",
    alt: "Placeholder of the Makran coast at sunset",
    place: "Balochistan",
    caption: "Makran coast, on the road toward Gwadar",
  },
  {
    id: "karakoram",
    src: "/gallery/karakoram.svg",
    alt: "Placeholder of high peaks along the Karakoram Highway",
    place: "Gilgit Baltistan",
    caption: "Peaks above the Karakoram Highway",
  },
  {
    id: "neelum",
    src: "/gallery/neelum.svg",
    alt: "Placeholder of a river running through Neelum Valley",
    place: "Azad Kashmir",
    caption: "The river through Neelum Valley",
  },
  {
    id: "lowari",
    src: "/gallery/lowari.svg",
    alt: "Placeholder of the road over Lowari Pass",
    place: "KPK",
    caption: "The climb over Lowari Pass",
  },
  {
    id: "punjab",
    src: "/gallery/punjab.svg",
    alt: "Placeholder of open farmland in Punjab",
    place: "Punjab",
    caption: "Long straight roads across Punjab",
  },
  {
    id: "sindh",
    src: "/gallery/sindh.svg",
    alt: "Placeholder of the Indus running through Sindh",
    place: "Sindh",
    caption: "The Indus on the way through Sindh",
  },
];
