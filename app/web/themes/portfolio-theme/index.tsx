import "./theme.scss";
import { Header } from './header'
import { Footer } from './footer'
import { registerTheme } from "app/web/thirdparty/theme";

export const PortfolioTheme = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="theme-portfolio">
            <Header />
            <main className="theme-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

registerTheme('Portfolio Theme', PortfolioTheme);