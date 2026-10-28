import { siFacebook, siGithub, siRss, siX } from 'simple-icons';

export interface SocialLink {
  label: string;
  href: string;
  icon: { path: string };
  external: boolean;
}

export const socialLinks: SocialLink[] = [
  { label: 'X', href: 'https://twitter.com/root_codeholics', icon: siX, external: true },
  { label: 'Facebook', href: 'https://www.facebook.com/RootCodeholics', icon: siFacebook, external: true },
  { label: 'Github', href: 'https://www.github.com/Codeholics', icon: siGithub, external: true },
  { label: 'RSS', href: '/rss.xml', icon: siRss, external: false },
];
