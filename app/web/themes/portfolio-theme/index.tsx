import "./theme.scss";
import { Header } from './header'
import { Footer } from './footer'
import { registerTheme } from "app/web/thirdparty/theme";
import { getSafeUrl } from "app/web/thirdparty/utils/safe-url";
import { Homepage } from "./pages/homepage";
import './cv.scss'
import './pages/cv-preview'

export const PortfolioTheme = ({ children }: { children?: React.ReactNode }) => {

    const isHomepage = getSafeUrl('/') == location.pathname;

    return (
        <div className="theme-portfolio">
            <Header />
            <main className="theme-content">
                {isHomepage ? <Homepage /> : children}
            </main>
            <Footer />
        </div>
    );
};

registerTheme('Portfolio Theme', PortfolioTheme);