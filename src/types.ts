export interface Specimen {
  id: string;
  indexNumber: string;
  sku?: string;
  name: string;
  vietnameseName: string;
  latinName: string;
  category: 'bridal' | 'installation' | 'seasonal' | 'rare' | 'vase';
  categoryLabelEn: string;
  categoryLabelVi: string;
  shortDescriptionEn: string;
  shortDescriptionVi: string;
  storyEn: string;
  storyVi: string;
  botanicalNotesEn?: string;
  botanicalNotesVi?: string;
  materials: string[];
  materialsVi: string[];
  scent?: {
    top: string;
    heart: string;
    base: string;
    intensity: number;
    mood: string;
  };
  dimensions?: string;
  seasonality?: string;
  priceVnd: number;
  priceUsd: number;
  image: string;
  galleryImages: {
    url: string;
    captionVi: string;
    captionEn: string;
  }[];
  audioFrequency?: number;
  pinnedToLanding?: boolean;
}

export interface Workshop {
  id: string;
  indexNumber: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  highlightsVi: string[];
  duration: string;
  groupSize: string;
  locationVi: string;
  pricePerPaxVnd: number;
  image: string;
}

export interface AtelierData {
  name: string;
  tagline: string;
  subTaglineVi: string;
  subTaglineEn: string;
  addressVi: string;
  phone: string;
  phoneFormatted: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  zaloUrl: string;
  hoursVi: string;
  heroSlides: {
    id: string;
    titleVi: string;
    subtitleVi: string;
    image: string;
  }[];
}

export type ViewMode = 'duo' | 'solo';
