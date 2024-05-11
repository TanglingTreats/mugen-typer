export default function manifest() {
  return {
    name: "Mugen Typer",
    short_name: "Mugen",
    description: "Mugen Typer is a typing game that helps you improve your typing speed, accuracy and ergonomics.",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      }
    ],
    start_url: "/",
    background_color: "#000000",
    display: "standalone"
  }
}
