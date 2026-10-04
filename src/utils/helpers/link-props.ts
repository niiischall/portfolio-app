import { isExternalUrl, resolvePath } from './routes';

export const getLinkProps = (slugOrUrl: string): { to: string } | { href: string; external?: boolean } => {
  const path = resolvePath(slugOrUrl);
  if (isExternalUrl(path)) {
    return { href: path, external: true };
  }
  return { to: path };
};
