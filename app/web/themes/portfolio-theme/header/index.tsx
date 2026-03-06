import React from "react";
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

  const isExternal = (to: string) => to.startsWith("http");

  return (
    <header className="premium-header-wrapper">
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo Section */}
        <div className="nav-logo mb-0 fw-bold text-uppercase">
          <span style={{ color: '#c5a059' }}>&lt;</span> 
          <a href={getSafeUrl('/')}> {config.siteTitle} </a>
          <span style={{ color: '#c5a059' }}>/&gt;</span>
        </div>

        {/* Navigation Section */}
        <nav className="premium-nav">
          {config?.links?.map((item: Link) => {
            const external = isExternal(item.to);
            const isActive = path === item.to;
            
            const linkClasses = [
                "nav-item-link",
                isActive ? "active" : "",
                item.icon && item.label ? "iconised-label" : ""
            ].join(" ");

            return (
              <a
                key={item.to}
                href={external ? item.to : getSafeUrl(item.to)}
                className={linkClasses}
                target={external ? "_blank" : undefined}
                rel="noopener noreferrer"
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