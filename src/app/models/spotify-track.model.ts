export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Album {
  available_markets: string[];
  type: string;
  album_type: string;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  uri: string;
  artists: Artist[];
  external_urls: ExternalUrls;
  total_tracks: number;
}

export interface Track {
  preview_url: string | null;
  available_markets: string[];
  explicit: boolean;
  type: string;
  episode: boolean;
  track: boolean;
  album: Album;
  artists: Artist[];
  disc_number: number;
  track_number: number;
  duration_ms: number;
  external_ids: {
    isrc: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  uri: string;
  is_local: boolean;
}

export interface User {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface PlaylistTrack {
  added_at: string;
  added_by: User;
  is_local: boolean;
  primary_color: string | null;
  track: Track;
  video_thumbnail: {
    url: string | null;
  };
}
