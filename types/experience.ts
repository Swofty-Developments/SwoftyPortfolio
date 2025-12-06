export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  type: 'experience';
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  type: 'award';
}

export type ExperienceOrAward = Experience | Award;
