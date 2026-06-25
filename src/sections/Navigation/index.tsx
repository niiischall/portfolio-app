import React, { useCallback, useState } from 'react';
import type { TypedObject } from 'sanity';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { HeroSocialType, NavigationCollectionType } from '../../utils/helpers/types';
import Button from '../../components/Button';
import { urlForImage } from '../../lib/sanity.image';
import { isExternalUrl, normalizePath } from '../../utils/helpers/routes';

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

const Navigation: React.FC<NavigationProps> = ({ data, hero }) => {
  const { collection = [] } = data ?? {};
  const { cover = {} } = hero ?? {};
  const [menuShowcase, setMenuShowcase] = useState<boolean>(false);

  const toggleMobileMenuShow = useCallback(() => {
    setMenuShowcase((prevMenuShowcase) => !prevMenuShowcase);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navigateToPath = useCallback(
    (slug: string) => {
      const path = normalizePath(slug);
      if (isExternalUrl(path)) {
        window.location.href = path;
      } else {
        navigate(path);
      }
    },
    [navigate],
  );

  const navigateFromMobileMenu = useCallback(
    (slug: string) => {
      navigateToPath(slug);
      setMenuShowcase(false);
    },
    [navigateToPath],
  );

  const renderMobileNavigationItems = useCallback(() => {
    let renderedList = null;
    if (collection.length > 0) {
      renderedList = collection.map((navItem: NavigationCollectionType) => {
        const isCurrentLocation = currentPath === normalizePath(navItem.slug.current);
        return (
          <li key={navItem._key}>
            <Button
              styles={`text-2xl font-sans font-bold px-4 text-primary hover:text-secondary duration-200 ${
                isCurrentLocation ? 'text-secondary' : 'text-primary'
              }`}
              onClick={() => navigateFromMobileMenu(navItem?.slug.current)}
              analyticsLabel={`navigation-${navItem?.slug.current}`}
            >
              {navItem.title}
            </Button>
          </li>
        );
      });
    }
    return renderedList;
  }, [currentPath, collection, navigateFromMobileMenu]);

  const renderNavigationItems = useCallback(() => {
    let renderedList = null;
    if (collection.length > 0) {
      renderedList = collection.map((navItem: NavigationCollectionType) => {
        const isCurrentLocation = currentPath === normalizePath(navItem.slug.current);
        return (
          <li key={navItem._key}>
            <div className="flex flex-col items-center">
              <Button
                styles={`text-xl font-sans font-bold px-4 duration-200 text-primary hover:text-secondary ${
                  isCurrentLocation ? 'text-secondary' : 'text-primary'
                }`}
                onClick={() => navigateToPath(navItem?.slug.current)}
                analyticsLabel={`navigation-${navItem?.slug.current}`}
              >
                {navItem.title}
              </Button>
            </div>
          </li>
        );
      });
    }
    return renderedList;
  }, [currentPath, collection, navigateToPath]);

  const profileImageUrl = cover?.asset?._ref
    ? urlForImage(cover)?.width(128).height(128).url()
    : undefined;

  return (
    <header className="relative flex justify-between items-center p-0 px-4 py-8 md:px-8 md:py-12">
      <nav className="flex items-center w-full justify-evenly">
        {profileImageUrl ? (
          <div className="hidden md:flex w-20 h-20 shrink-0">
            <Link to="/">
              <img
                className="w-full h-full object-cover rounded-full"
                src={profileImageUrl}
                alt="Profile"
              />
            </Link>
          </div>
        ) : null}
        <ul className="space-x-2 hidden md:flex">{renderNavigationItems()}</ul>
        <div className="flex items-center w-full justify-between md:hidden">
          {profileImageUrl ? (
            <div className="flex w-14 h-14 shrink-0">
              <Link to="/">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={profileImageUrl}
                  alt="Profile"
                />
              </Link>
            </div>
          ) : null}
          <Button
            styles={`hamburger z-50 block md:hidden focus:outline-none ${menuShowcase ? 'open' : ''}`}
            onClick={toggleMobileMenuShow}
            analyticsLabel="navigation-mobile"
          >
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </Button>
        </div>
      </nav>
      {menuShowcase ? (
        <div id="menu-banner" className="z-40 absolute top-0 left-0 space-y-4 bg-light w-full h-screen">
          <ul className="flex flex-col w-full h-full space-y-8 justify-center items-center">
            {renderMobileNavigationItems()}
          </ul>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;
