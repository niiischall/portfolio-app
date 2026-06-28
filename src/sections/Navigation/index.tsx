import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { TypedObject } from 'sanity';
import { useLocation, Link } from 'react-router-dom';

import { HeroSocialType, NavigationCollectionType } from '../../utils/helpers/types';
import Button from '../../components/Button';
import { urlForImage } from '../../lib/sanity.image';
import { normalizePath } from '../../utils/helpers/routes';
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
  hero: {
    socials: HeroSocialType[];
    greeting: {
      link: {
        text: string;
        slug: {
          current: string;
        };
      };
      text: TypedObject[];
    };
    cover: {
      asset: {
        _type: string;
        _ref: string;
      };
      _type: string;
    };
  };
}

const MOBILE_MENU_ID = 'mobile-menu';

const Navigation: React.FC<NavigationProps> = ({ data, hero }) => {
  const { collection = [] } = data ?? {};
  const { cover } = hero ?? {};
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
      const isCurrentLocation = currentPath === normalizePath(navItem.slug.current);
      const linkProps = getLinkProps(navItem.slug.current);

      return (
        <li key={navItem._key}>
          <Button
            {...linkProps}
            styles={`text-2xl font-sans font-bold px-4 text-primary hover:text-secondary duration-200 ${
              isCurrentLocation ? 'text-secondary' : 'text-primary'
            }`}
            onClick={closeMobileMenu}
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{
              surface: 'mobile_menu',
              destination: normalizePath(navItem.slug.current),
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
      const isCurrentLocation = currentPath === normalizePath(navItem.slug.current);
      const linkProps = getLinkProps(navItem.slug.current);

      return (
        <li key={navItem._key}>
          <div className="flex flex-col items-center">
            <Button
              {...linkProps}
              styles={`text-xl font-sans font-bold px-4 duration-200 text-primary hover:text-secondary ${
                isCurrentLocation ? 'text-secondary' : 'text-primary'
              }`}
              analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
              analyticsProperties={{
                surface: 'header',
                destination: normalizePath(navItem.slug.current),
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

  const profileImageUrl = cover?.asset?._ref ? urlForImage(cover)?.width(128).height(128).url() : undefined;

  return (
    <header className="relative flex justify-between items-center p-0 px-4 py-8 md:px-8 md:py-12">
      <nav className="flex items-center w-full justify-evenly" aria-label="Main navigation">
        {profileImageUrl ? (
          <div className="hidden md:flex w-20 h-20 shrink-0">
            <Link to="/">
              <img className="w-full h-full object-cover rounded-full" src={profileImageUrl} alt="Profile" />
            </Link>
          </div>
        ) : null}
        <ul className="space-x-2 hidden md:flex">{renderNavigationItems()}</ul>
        <div className="flex items-center w-full justify-between md:hidden">
          {profileImageUrl ? (
            <div className="flex w-14 h-14 shrink-0">
              <Link to="/">
                <img className="w-full h-full object-cover rounded-full" src={profileImageUrl} alt="Profile" />
              </Link>
            </div>
          ) : null}
          <Button
            ref={menuButtonRef}
            styles={`hamburger z-50 block md:hidden focus:outline-none p-3 min-w-[44px] min-h-[44px] ${menuShowcase ? 'open' : ''}`}
            onClick={toggleMobileMenuShow}
            analyticsEvent={ANALYTICS_EVENTS.MENU_TOGGLE}
            analyticsProperties={{
              surface: 'mobile_menu',
              action: menuShowcase ? 'close' : 'open',
            }}
            ariaLabel={menuShowcase ? 'Close menu' : 'Open menu'}
            ariaExpanded={menuShowcase}
            ariaControls={MOBILE_MENU_ID}
            type="button"
          >
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </Button>
        </div>
      </nav>
      {menuShowcase ? (
        <div
          id={MOBILE_MENU_ID}
          ref={menuPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="z-40 absolute top-0 left-0 space-y-4 bg-light w-full h-screen"
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
