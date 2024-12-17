import "./page-layout.scss";

export default function PageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="page-layout">
            <div className="page-layout-content">
                {children}
            </div>
        </div>
    )
}