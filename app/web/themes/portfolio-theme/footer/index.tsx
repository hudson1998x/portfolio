import React from "react";
import { useModuleConfig } from '@config';
import './style.scss';

import footerDefaults from './config.json';

interface FooterSocialLink {
  label: string;
  href: string;
}

interface FooterConfig {
  copyrightName: string;
  socials: FooterSocialLink[];
}

export const Footer: React.FC = () => {
  const config = useModuleConfig<FooterConfig>(footerDefaults.key, footerDefaults.config);

  const visibleSocials = config.socials?.filter(
    (s: FooterSocialLink) => s.href && s.href.trim() !== ""
  ) || [];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Copyright Section */}
          <div className="copyright-text">
            &copy; {new Date().getFullYear()} —{" "}
            <span className="name">{config.copyrightName}</span>
          </div>

          {/* Social Links Section */}
          {visibleSocials.length > 0 && (
            <div className="footer-socials">
              {visibleSocials.map((social: FooterSocialLink) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </footer>
  );
};