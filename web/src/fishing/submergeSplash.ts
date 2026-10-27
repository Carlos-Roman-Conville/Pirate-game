/** When bite submerge FX resolves, register the splash container on the world layer (DockScene). */
export function attachSubmergeSplashToWorld<T>(
  promise: Promise<T>,
  world: (obj: T) => T,
): Promise<T> {
  return promise.then((splash) => world(splash))
}
