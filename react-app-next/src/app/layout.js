import "./styles/globals.css";

export const metadata = {
  title: "Getting Started Wizard",
  description: "Wizard for new users and Settings page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
