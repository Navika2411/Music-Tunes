const siteUrl = "https://music-tunes.8man.in";

export async function generateMetadata({ params }) {
  const query = decodeURIComponent(params.query);

  return {
    title: `${query} - Download & Listen Free`,
    description: `Listen to ${query} songs online for free. Download ${query} mp3 songs, albums, and playlists. Stream high quality music on Music Tunes.`,
    keywords: [
      query,
      `${query} songs`,
      `${query} download`,
      `${query} mp3`,
      `listen ${query} online`,
      `${query} music`,
      "free music download",
      "stream songs",
    ],
    openGraph: {
      title: `${query} - Download & Listen Free | Music Tunes`,
      description: `Listen to ${query} songs online for free. Download mp3 songs and stream high quality music.`,
      url: `${siteUrl}/search/${params.query}`,
      siteName: "Music Tunes",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${query} - Download & Listen Free | Music Tunes`,
      description: `Listen to ${query} songs online for free. Download mp3 songs and stream high quality music.`,
    },
    alternates: {
      canonical: `${siteUrl}/search/${params.query}`,
    },
  };
}

export default function SearchLayout({ children }) {
  return <>{children}</>;
}
