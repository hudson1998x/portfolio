import { registerComponent } from "@components/registry";
import { useModuleConfig } from "@config";
import { useApi } from "@hooks/use-api";
import { FC } from "react";
import "./style.scss";

import * as skillsApi from '@api/skills';
import * as employmentsApi from '@api/employment';
import * as educationApi from '@api/education';
import * as certificationApi from '@api/certification';
import * as projectsApi from '@api/projects';
import { Skills } from "@api/skills";
import { Employment } from "@api/employment";
import { Education } from "@api/education";
import { Certification } from "@api/certification";
import { Projects } from "@api/projects";

const CvPreviewer: FC = () => {
    const personal = useModuleConfig("personalInformation", {
        firstName: "JOHN", lastName: "HUDSON", headline: "SENIOR SOFTWARE ENGINEER",
        summary: "10+ years of commercial experience, 15 years of personal experience.",
        email: "jhudson98new@gmail.com", phone: "07572557449", website: "https://hudson1998x.github.io/portfolio",
    });

    const [skills]         = useApi(() => skillsApi.find('', 500), []);
    const [employment]     = useApi(() => employmentsApi.find('', 500), []);
    const [education]      = useApi(() => educationApi.find('', 500), []);
    const [certifications] = useApi(() => certificationApi.find('', 500), []);
    const [projects]       = useApi(() => projectsApi.find('', 500), []);

    // Build skill ID → Skill lookup
    const skillMap = new Map<number, Skills>(
        (skills ?? []).map((s: Skills) => [s.id, s])
    );

    // Resolve an array of skill IDs to full Skill objects
    const resolveSkills = (ids?: number[]): Skills[] =>
        (ids ?? []).map(id => skillMap.get(id)).filter(Boolean) as Skills[];

    // Format ISO date string to "Mon YYYY"
    const formatDate = (d?: string): string => {
        if (!d) return '';
        const date = new Date(d);
        return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    };

    // Sort employment newest first
    const sortedEmployment = [...(employment ?? [])].sort((a: Employment, b: Employment) =>
        new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime()
    );

    // Sort education newest first
    const sortedEducation = [...(education ?? [])].sort((a: Education, b: Education) =>
        new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime()
    );

    // Sort skills by yearsOfExperience descending FIRST, then group by category
    const sortedSkills = [...(skills ?? [])].sort((a: Skills, b: Skills) =>
        (b.yearsOfExperience ?? 0) - (a.yearsOfExperience ?? 0)
    );

    const skillsByCategory = sortedSkills.reduce((acc: Record<string, Skills[]>, s: Skills) => {
        const cat = s.skillCategory ?? 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
    }, {});

    // Scale bar width relative to the max years within that skill's category
    const barWidth = (s: Skills) => {
        const cat = s.skillCategory ?? 'Other';
        const catMax = Math.max(...(skillsByCategory[cat] ?? []).map((x: Skills) => x.yearsOfExperience ?? 0), 1);
        return `${Math.round(((s.yearsOfExperience ?? 0) / catMax) * 100)}%`;
    };

    return (
        <div className='cv-canvas'>
            <div className="toolbar no-print">
                <button className="download-btn" onClick={() => window.print()}>
                    Download CV as PDF
                </button>
            </div>

            <div className='cv-sheet'>

                {/* ── HEADER ── */}
                <header className="cv-header">
                    <div className="brand">
                        <h1>{personal.firstName} <span>{personal.lastName}</span></h1>
                        <p className="headline">{personal.headline}</p>
                    </div>
                    <div className="contacts">
                        <p><strong>DIRECT</strong></p>
                        <p>{personal.email}</p>
                        <p>{personal.phone}</p>
                        <p className="gold-link">{personal.website}</p>
                    </div>
                </header>

                <div className="cv-content-wrap clearfix">

                    {/* ════ LEFT COLUMN ════ */}
                    <div className="left-col">

                        <div className="summary-section">{personal.summary}</div>

                        {/* ── EMPLOYMENT ── */}
                        <h2 className="section-title">Professional Experience</h2>
                        {sortedEmployment.map((job: Employment) => {
                            const jobSkills = resolveSkills(job.skillsUsed);
                            return (
                                <div key={job.id} className="printable-card">

                                    <div className="card-top">
                                        <span className="role">{job.roleTitle}</span>
                                        <span className="dates">
                                            {formatDate(job.startDate)} — {job.endDate ? formatDate(job.endDate) : 'Present'}
                                        </span>
                                    </div>

                                    <div className="card-meta">
                                        <span className="card-sub">{job.company}</span>
                                        {job.location   && <span className="card-location"> · {job.location}</span>}
                                        {job.roleType   && <span className="card-tag">{job.roleType}</span>}
                                        {job.industry   && <span className="card-industry">{job.industry}</span>}
                                    </div>

                                    {job.summary && (
                                        <p className="card-summary">{job.summary}</p>
                                    )}

                                    {(job.responsibilities ?? []).length > 0 && (
                                        <ul className="details">
                                            {job.responsibilities!.map((res: string, i: number) => (
                                                <li key={i}>{res}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {(job.achievements ?? []).length > 0 && (
                                        <div className="impact-box">
                                            <strong>Key Impact</strong>
                                            <ul>
                                                {job.achievements!.map((a: string, i: number) => (
                                                    <li key={i}>{a}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {jobSkills.length > 0 && (
                                        <div className="skill-tags">
                                            {jobSkills.map((s: Skills) => (
                                                <span key={s.id} className="skill-tag">{s.skillName}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* ── PROJECTS ── */}
                        {(projects ?? []).length > 0 && (
                            <>
                                <h2 className="section-title">Selected Projects</h2>
                                {(projects ?? []).map((proj: Projects) => {
                                    const projSkills = resolveSkills(proj.skillIds);
                                    return (
                                        <div key={proj.id} className="printable-card project">
                                            <h3>
                                                {proj.projectTitle}
                                                {proj.category && (
                                                    <span className="badge">{proj.category}</span>
                                                )}
                                            </h3>

                                            <p>{proj.projectDescription}</p>

                                            {projSkills.length > 0 && (
                                                <div className="skill-tags">
                                                    {projSkills.map((s: Skills) => (
                                                        <span key={s.id} className="skill-tag">{s.skillName}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="project-links">
                                                {proj.repositoryUrl && (
                                                    <a className="project-link-btn" href={proj.repositoryUrl} target="_blank" rel="noreferrer">
                                                        View repository
                                                    </a>
                                                )}
                                                {proj.publishedUrl && (
                                                    <a className="project-link-btn" href={proj.publishedUrl} target="_blank" rel="noreferrer">
                                                        Live site
                                                    </a>
                                                )}
                                                {proj.documentationUrl && (
                                                    <a className="project-link-btn" href={proj.documentationUrl} target="_blank" rel="noreferrer">
                                                        Docs
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {/* ── EDUCATION ── */}
                        {sortedEducation.length > 0 && (
                            <>
                                <h2 className="section-title">Education</h2>
                                {sortedEducation.map((edu: Education) => {
                                    const eduSkills = resolveSkills(edu.skillIds);
                                    return (
                                        <div key={edu.id} className="printable-card">

                                            <div className="card-top">
                                                <span className="role">
                                                    {edu.qualificationType}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''}
                                                </span>
                                                <span className="dates">
                                                    {formatDate(edu.startDate)}
                                                    {edu.endDate ? ` — ${formatDate(edu.endDate)}` : ''}
                                                </span>
                                            </div>

                                            <div className="card-meta">
                                                <span className="card-sub">
                                                    {edu.institutionUrl
                                                        ? <a href={edu.institutionUrl} target="_blank" rel="noreferrer">{edu.institution}</a>
                                                        : edu.institution
                                                    }
                                                </span>
                                                {edu.grade && <span className="card-grade"> · Grade: {edu.grade}</span>}
                                                {edu.status && edu.status !== 'completed' && (
                                                    <span className="card-tag">{edu.status}</span>
                                                )}
                                            </div>

                                            {edu.description && (
                                                <p className="card-summary">{edu.description}</p>
                                            )}

                                            {(edu.achievements ?? []).length > 0 && (
                                                <div className="impact-box">
                                                    <strong>Achievements</strong>
                                                    <ul>
                                                        {edu.achievements!.map((a: string, i: number) => (
                                                            <li key={i}>{a}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {(edu.modules ?? []).length > 0 && (
                                                <div className="module-list">
                                                    <span className="module-label">Modules:</span>
                                                    {edu.modules!.map((m: string, i: number) => (
                                                        <span key={i} className="skill-tag">{m}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {eduSkills.length > 0 && (
                                                <div className="skill-tags">
                                                    {eduSkills.map((s: Skills) => (
                                                        <span key={s.id} className="skill-tag">{s.skillName}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* ════ RIGHT COLUMN / SIDEBAR ════ */}
                    <aside className="right-col">

                        {/* ── SKILLS GROUPED BY CATEGORY ── */}
                        {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                            <div key={category}>
                                <h2 className="section-title">{category}</h2>
                                {(catSkills as Skills[]).map((s: Skills) => (
                                    <div key={s.id} className="skill-row">
                                        <div className="skill-label">
                                            <span>{s.skillName}</span>
                                            <span>{s.yearsOfExperience}Y</span>
                                        </div>
                                        <div className="progress-bg">
                                            <div
                                                className="progress-fill"
                                                style={{ width: barWidth(s) }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* ── CERTIFICATIONS ── */}
                        {(certifications ?? []).length > 0 && (
                            <>
                                <h2 className="section-title">Certifications</h2>
                                {(certifications ?? []).map((cert: Certification) => {
                                    const certSkills = resolveSkills(cert.skillIds);
                                    return (
                                        <div key={cert.id} className="sidebar-card">
                                            <div className="sidebar-card-title">{cert.certificationName}</div>
                                            <div className="sidebar-card-sub">{cert.issuer}</div>
                                            <div className="sidebar-card-meta">
                                                {formatDate(cert.issueDate)}
                                                {cert.expiryDate
                                                    ? ` — ${formatDate(cert.expiryDate)}`
                                                    : ' · No expiry'
                                                }
                                            </div>
                                            {cert.credentialId && (
                                                <div className="sidebar-card-meta">ID: {cert.credentialId}</div>
                                            )}
                                            {cert.credentialUrl && (
                                                <a className="sidebar-link" href={cert.credentialUrl} target="_blank" rel="noreferrer">
                                                    Verify credential
                                                </a>
                                            )}
                                            {certSkills.length > 0 && (
                                                <div className="skill-tags">
                                                    {certSkills.map((s: Skills) => (
                                                        <span key={s.id} className="skill-tag">{s.skillName}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    );
};

registerComponent({ name: '@pages/cv-preview', component: CvPreviewer, defaults: {} });