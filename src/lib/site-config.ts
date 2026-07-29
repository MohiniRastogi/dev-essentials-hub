export const siteConfig = {
  githubUrl: "https://github.com/MohiniRastogi",
  linkedinUrl: "https://www.linkedin.com/in/mohini-rastogi-3130b1380/",
  contactEmail: "mohinirastogi530@gmail.com",
  get contactMailto() {
    return `mailto:${this.contactEmail}`;
  },
} as const;
