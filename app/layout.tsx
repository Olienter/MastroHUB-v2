import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MastroHUB</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
