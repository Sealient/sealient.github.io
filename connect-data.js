const socialChannelsData = [
  {
    id: "discord",
    label: "DISCORD",
    handle: "sealrl_",
    type: "copy",
    value: "sealrl_",
    status: "ONLINE // ACTIVE",
    desc: "Primary communication line for commissions, server inquiries, and development collabs.",
    icon: "fa-brands fa-discord"
  },
  {
    id: "github",
    label: "REPOSITORIES",
    handle: "sealient.github.io",
    type: "link",
    value: "https://github.com/Sealient",
    status: "ONLINE // HOSTED",
    desc: "Main repository hub for open-source frameworks, scripts, and documentation.",
    icon: "fa-solid fa-terminal"
  },
  {
    id: "tiktok",
    label: "TIKTOK",
    handle: "@sealient",
    type: "link",
    value: "https://tiktok.com/@sealient",
    status: "ACTIVE FEED",
    desc: "Clips, development highlights, script showcases, and project previews.",
    icon: "fa-brands fa-tiktok"
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    handle: "@sealient_",
    type: "link",
    value: "https://instagram.com/sealient_",
    status: "ACTIVE FEED",
    desc: "Traditional art studies, graphite shading work, and personal updates.",
    icon: "fa-brands fa-instagram"
  }
];

// Spotify Live Telemetry Mock / Config Data (Ready to wire to an API or update manually/via Last.fm/Spotify API)
const spotifyCurrentTrack = {
  songTitle: "Caramel",
  artistName: "Sleep Token",
  albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
  durationMs: 245000, // e.g. 4:05 total
  currentMs: 78000,   // Starting progress point
  spotifyUri: "spotify:track:4Q0qVhFQa7j6jRKzo3HDmP",
  spotifyWebLink: "https://open.spotify.com",
  lyrics: [
    { time: 0, text: "Tracing patterns in the dark..." },
    { time: 15, text: "You color and fracture the light" },
    { time: 30, text: "Dissolve the heavy air around us" },
    { time: 48, text: "And sugar coats the silent sound" },
    { time: 72, text: "Caramel skies wrapping over your eyes..." },
    { time: 95, text: "You can't help but shine through it all." }
  ]
};