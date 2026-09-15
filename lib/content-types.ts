export type ProjectItem = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  imageUrl: string;
  url: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  number: string;
  description: string;
};

export type NavigationContent = {
  firstName: string;
  lastName: string;
};

export type ProjectsContent = {
  heading: string;
  role: string;
  subtitle: string;
  intro: string;
  tagline: string;
  items: ProjectItem[];
};

export type ServicesContent = {
  heading: string;
  intro: string;
  cta: string;
  availability: string;
  items: ServiceItem[];
};

export type ContactContent = {
  heading: string;
  role: string;
  passion: string;
  intro: string;
  description: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  instagramLabel: string;
  instagramHandle: string;
  instagramUrl: string;
  profileImage: string;
};

export type FooterContent = {
  name: string;
  title: string;
  tagline: string;
};

export type SiteContent = {
  navigation: NavigationContent;
  projects: ProjectsContent;
  services: ServicesContent;
  contact: ContactContent;
  footer: FooterContent;
};
