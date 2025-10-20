export type ServiceBlock = {
  label: string;
  items: string[];
};

export type Service = {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  blocks: ServiceBlock[];
  images: string[];
  videoUrl: string;
};
