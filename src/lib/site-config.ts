export const siteConfig = {
  githubUrl: "https://github.com/MohiniRastogi",
  contactEmail: "mohinirastogi530@gmail.com",
  get contactMailto() {
    return `mailto:${this.contactEmail}`;
  },
} as const;
