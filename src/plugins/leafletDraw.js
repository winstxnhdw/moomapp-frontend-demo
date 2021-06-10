export const leafletDraw = map => {
  const drawControl = new window.L.Control.Draw({
    position: 'topleft',
    draw: {
      polyline: false,
      polygon: false,
      rectangle: true,
      circle: true,
      circlemarker: false,
      marker: false
    }
  })

  map.addControl(drawControl)
}
