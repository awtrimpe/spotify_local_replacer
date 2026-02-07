export const tools = [
  {
    title: 'Local Track Replacer',
    overview: 'Swap a local file with a Spotify-hosted track',
    description: `### Replacing Local Tracks

You are able to take a playlist that contains local tracks and procedurally click through each one to select a copy of your choosing that Spotify hosts. It will swap out the link to your local file for Spotify's track. If you are not wanting to fully replace tracks in a playlist, it is suggested to make a copy of your playlist and use that clone instead. To find more information on Spotify's local files feature, [read more here](https://support.spotify.com/us/article/local-files/).
> **Example:** I wanted to take my iPod's old music with me on the go. Rather than self-hosting the music, and secretly because I wanted all listening to count towards my Spotify Wrapped (_they got me_), I:
>
> 1. Imported all of my old MP3 files as Local Tracks in the Spotify Desktop client
> 1. Navigated to the Local Tracks folder and selected all tracks (CTRL + A on Windows/Linux, CMD + A on Mac)
> 1. Created a new playlist and pasted all tracks (CTRL + P on Windows/Linux, CMD + P on Mac)
> 1. Used Local Track Replacer to complete the work!`,
    routerLink: '/playlists',
  },
  {
    title: 'Playlist Track Replacer',
    overview: 'Swap a track with a new track in place',
    description: `_Does not include Liked Songs at the moment_

Find and replace any track inside of a playlist with another track from Spotify. This feature is designed for times when you accidentally saved the clean version instead of the explicit version, added the single but now want the album release, or actually prefer the remix to the original, and you want to preserve the order of addition.`,
    routerLink: '/playlists',
  },
  {
    title: 'Removed Liked Songs Finder',
    overview:
      'Discover which of your Liked Songs have been removed from Spotify',
    description:
      'Do you miss that favorite song which was removed from Spotify for unknown reasons? Find them back so you can look for the track again!',
    routerLink: '/liked',
  },
];
