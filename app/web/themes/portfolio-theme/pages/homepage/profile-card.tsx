import React from 'react';
import { useModuleConfig } from "@config";
import { getSafeUrl } from "app/web/thirdparty/utils/safe-url";
import './style.scss';

// ── Types ────────────────────────────────────────────────

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface NavItem {
  label: string;
  href: string;
}

interface ProfileCardProps {
  name?:        string;
  title?:       string;
  avatarSrc?:   string | null;
  navItems?:    NavItem[];
  socialLinks?: SocialLink[];
}

// ── Defaults ─────────────────────────────────────────────

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'About',    href: '/page/2'      },
  { label: 'Contact',  href: '/page/3'      },
  { label: 'Projects', href: '/documents/1' },
  { label: 'My CV',       href: '/cv'          },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { icon: 'fab fa-linkedin', href: 'https://www.linkedin.com/in/john-hudson-4b85a8381/', label: 'LinkedIn' },
  { icon: 'fab fa-github',   href: 'https://github.com/hudson1998x',                     label: 'GitHub'   },
  { icon: 'fas fa-rss',      href: '/blog',                                               label: 'Blog'     },
];

// ── Component ─────────────────────────────────────────────

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name        = 'John Hudson',
  title       = 'Senior Software Engineer',
  avatarSrc   = null,
  navItems    = DEFAULT_NAV_ITEMS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}) => {
  const social = useModuleConfig('social-links', {});

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('');

  return (
    <div className="profile-card">

      {/* ── Avatar ── */}
      {avatarSrc ? (
        <img
          className="profile-card__avatar"
          src={avatarSrc}
          alt={name}
        />
      ) : (
        <div className="profile-card__avatar-placeholder">
          {initials}
        </div>
      )}

      {/* top stem + rule */}
      <div className="profile-card__connector profile-card__connector--sm" />
      <div className="profile-card__h-line" />

      {/* ── Identity ── */}
      <div className="profile-card__identity">
        <h1 className="profile-card__name">{name}</h1>
        <p className="profile-card__title">{title}</p>
      </div>

      {/* rule + stem */}
      <div className="profile-card__h-line" />
      <div className="profile-card__connector profile-card__connector--md" />

      {/* ── Nav ── */}
      <nav className="profile-card__nav">
        {navItems.map(({ label, href }) => (
          <a
            key={label}
            className="profile-card__nav-btn"
            href={getSafeUrl(href)}
            rel="noopener noreferrer"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* stem to socials */}
      <div className="profile-card__connector profile-card__connector--md" />

      {/* ── Socials ── */}
      <div className="profile-card__socials">
        {socialLinks.map(({ icon, href, label }) => (
          <a
            key={label}
            className="profile-card__social-link"
            href={getSafeUrl(href)}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={icon} />
          </a>
        ))}
      </div>
    </div>
  );
};