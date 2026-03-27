import "./globals.css";
import Protected from "./protected";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Protected>{children}</Protected>
      </body>
    </html>
  );
}