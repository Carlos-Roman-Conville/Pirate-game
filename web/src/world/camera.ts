// Main-camera scroll bounds: centre the map when it is smaller than the view at the current zoom.

export interface MapCameraBounds {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Bounds for Phaser's main camera. When the map fits inside the visible world area, padding
 * centres it; when the map is larger on an axis, bounds stay flush to the map on that axis.
 */
export function mapCameraBounds(
  mapWidthPx: number,
  mapHeightPx: number,
  viewWidthPx: number,
  viewHeightPx: number,
  zoom: number,
): MapCameraBounds {
  const visibleW = viewWidthPx / zoom
  const visibleH = viewHeightPx / zoom
  const padX = Math.max(0, (visibleW - mapWidthPx) / 2)
  const padY = Math.max(0, (visibleH - mapHeightPx) / 2)
  if (padX === 0 && padY === 0) {
    return { x: 0, y: 0, width: mapWidthPx, height: mapHeightPx }
  }
  return {
    x: -padX,
    y: -padY,
    width: mapWidthPx + 2 * padX,
    height: mapHeightPx + 2 * padY,
  }
}
