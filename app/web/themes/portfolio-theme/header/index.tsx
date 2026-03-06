import React, { useEffect, useRef } from "react";
import { useModuleConfig } from '@config';
import { useRouter } from "@router";
import './style.scss';

import headerDefaults from './config.json';
import { getSafeUrl } from "app/web/thirdparty/utils/safe-url";

interface Link {
  to: string;
  label?: string;
  icon?: string;
}

interface HeaderConfig {
  siteTitle: string;
  links: Link[];
}

export const Header: React.FC = () => {
  const { path } = useRouter();
  const config = useModuleConfig<HeaderConfig>(headerDefaults.key, headerDefaults.config);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const isExternal = (to: string) => to.startsWith("http");

  // Handle Scroll Lock
  useEffect(() => {
    const handleScrollLock = () => {
      if (checkboxRef.current?.checked) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    const toggle = checkboxRef.current;
    toggle?.addEventListener('change', handleScrollLock);

    // Cleanup and Reset on route change
    return () => {
      toggle?.removeEventListener('change', handleScrollLock);
      document.body.style.overflow = 'unset';
      if (checkboxRef.current) checkboxRef.current.checked = false;
    };
  }, [path]);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-logo">
          <a href={getSafeUrl('/')}>
            <span className="accent">&lt;</span>
            {config.siteTitle}
            <span className="accent">/&gt;</span>
          </a>
        </div>

        {/* Added ref here */}
        <input 
          type="checkbox" 
          id="menu-toggle" 
          className="menu-toggle" 
          ref={checkboxRef} 
        />
        <label htmlFor="menu-toggle" className="menu-btn">
          <span></span>
        </label>

        <nav className="header-nav">
          {config?.links?.map((item: Link) => {
            const isActive = path === item.to;
            const external = isExternal(item.to);
            
            return (
              <a
                key={item.to}
                href={external ? item.to : getSafeUrl(item.to)}
                className={`nav-link ${isActive ? "active" : ""} ${item.icon && item.label ? "icon-label" : ""}`}
                target={external ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => {
                  if (checkboxRef.current) checkboxRef.current.checked = false;
                  document.body.style.overflow = 'unset';
                }}
              >
                {item.icon && <i className={item.icon} />}
                {item.label && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};