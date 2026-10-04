import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { FooterSocialType, NavigationCollectionType } from '../../utils/helpers/types';
import Button from '../../components/Button';
import ThemeToggle from '../../components/ThemeToggle';
import SocialLinks from '../../components/SocialLinks';
import { PERSON_NAME } from '../../config/site';
import { isExternalUrl, isLiveRoute, resolvePath } from '../../utils/helpers/routes';
import { getLinkProps } from '../../utils/helpers/link-props';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

export interface NavigationProps {
  data: {
    heading: {
      title: string;
      slug: {
        current: string;
      };
    };
    collection: NavigationCollectionType[];
  };
  socials?: FooterSocialType[];
}

const MOBILE_MENU_ID = 'mobile-menu';

const Navigation: React.FC<NavigationProps> = ({ data, socials = [] }) => {
  const { collection: rawCollection = [] } = data ?? {};
  // Nav items live in Sanity. Drop any that point at a removed section, and
  // collapse items that now resolve to the same page (work -> about).
  const collection = useMemo(() => {
    const seen = new Set<string>();
    return rawCollection.filter((item: NavigationCollectionType) => {
      const path = resolvePath(item.slug?.current);
      if (!isExternalUrl(path) && !isLiveRoute(path)) return false;
      if (seen.has(path)) return false;
      seen.add(path);
      return true;
    });
  }, [rawCollection]);
  const [menuShowcase, setMenuShowcase] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMenuShowcase(false);
  }, []);

  const toggleMobileMenuShow = useCallback(() => {
    setMenuShowcase((prevMenuShowcase) => !prevMenuShowcase);
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    if (!menuShowcase) return;

    const menuPanel = menuPanelRef.current;
    if (!menuPanel) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(menuPanel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled'),
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
        return;
      }

      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuShowcase, closeMobileMenu]);

  const renderMobileNavigationItems = useCallback(() => {
    if (collection.length === 0) return null;

    return collection.map((navItem: NavigationCollectionType) => {
      const isCurrentLocation = currentPath === resolvePath(navItem.slug.current);
      const linkProps = getLinkProps(navItem.slug.current);

      return (
        <li key={navItem._key}>
          <Button
            {...linkProps}
            styles={`text-2xl font-sans font-bold px-4 hover:underline underline-offset-4 decoration-muted ${
              isCurrentLocation ? 'font-semibold text-primary' : 'text-muted hover:text-primary'
            }`}
            onClick={closeMobileMenu}
            ariaCurrent={isCurrentLocation ? 'page' : undefined}
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{
              section: 'mobile_menu',
              surface: 'nav',
              destination: resolvePath(navItem.slug.current),
              label: navItem.title,
            }}
          >
            {navItem.title}
          </Button>
        </li>
      );
    });
  }, [closeMobileMenu, collection, currentPath]);

  const renderNavigationItems = useCallback(() => {
    if (collection.length === 0) return null;

    return collection.map((navItem: NavigationCollectionType) => {
      const isCurrentLocation = currentPath === resolvePath(navItem.slug.current);
      const linkProps = getLinkProps(navItem.slug.current);

      return (
        <li key={navItem._key}>
          <div className="flex flex-col items-center">
            <Button
              {...linkProps}
              styles={`text-base font-sans px-3 hover:underline underline-offset-4 decoration-muted rounded-sm ${
                isCurrentLocation ? 'font-semibold text-primary' : 'text-muted hover:text-primary'
              }`}
              ariaCurrent={isCurrentLocation ? 'page' : undefined}
              analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
              analyticsProperties={{
                section: 'header',
                surface: 'nav',
                destination: resolvePath(navItem.slug.current),
                label: navItem.title,
              }}
            >
              {navItem.title}
            </Button>
          </div>
        </li>
      );
    });
  }, [collection, currentPath]);

  return (
    <header className="px-4 py-3 md:px-8 md:py-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto w-full">
        <nav className="relative flex w-full items-center justify-between" aria-label="Main navigation">
          <Button
            to="/"
            styles="shrink-0 font-serif text-[1.375rem] leading-none text-primary rounded-sm"
            ariaLabel={`${PERSON_NAME} — home`}
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{ section: 'header', surface: 'wordmark', destination: '/', label: PERSON_NAME }}
          >
            {PERSON_NAME}
          </Button>

          <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex space-x-2">
            {renderNavigationItems()}
          </ul>

          <div className="flex shrink-0 items-center gap-3">
            <SocialLinks socials={socials} surface="header" iconSize={22} className="hidden lg:flex" />
            <ThemeToggle />
            <Button
              ref={menuButtonRef}
              styles={`header-icon-btn hamburger z-[60] md:hidden ${
                menuShowcase ? 'open' : ''
              }`}
              onClick={toggleMobileMenuShow}
              analyticsEvent={ANALYTICS_EVENTS.MENU_TOGGLE}
              analyticsProperties={{
                section: 'header',
                surface: 'menu_button',
                action: menuShowcase ? 'close' : 'open',
              }}
              ariaLabel={menuShowcase ? 'Close menu' : 'Open menu'}
              ariaExpanded={menuShowcase}
              ariaControls={MOBILE_MENU_ID}
              type="button"
            >
              <span className="hamburger-icon" aria-hidden="true">
                <span className="hamburger-top"></span>
                <span className="hamburger-middle"></span>
                <span className="hamburger-bottom"></span>
              </span>
            </Button>
          </div>
        </nav>
      </div>
      {menuShowcase ? (
        <div
          id={MOBILE_MENU_ID}
          ref={menuPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="z-50 fixed inset-0 bg-light transition-colors duration-200"
        >
          <ul className="flex flex-col w-full h-full space-y-8 justify-center items-center">
            {renderMobileNavigationItems()}
          </ul>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;
