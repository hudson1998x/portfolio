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

  // Filter out empty links
  const visibleSocials = config.socials?.filter(
    (s: FooterSocialLink) => s.href && s.href.trim() !== ""
  ) || [];

  return (
    <footer className="premium-footer-wrapper">
      <div className="container">
        <div className="footer-content d-flex flex-column flex-md-row justify-content-between align-items-center">
          
          {/* Copyright Section */}
          <div className="copyright-text mb-0">
            &copy; {new Date().getFullYear()} —{" "}
            <span>{config.copyrightName}</span>
          </div>

          {/* Social Links Section */}
          {visibleSocials.length > 0 && (
            <div className="footer-socials d-flex gap-4">
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
