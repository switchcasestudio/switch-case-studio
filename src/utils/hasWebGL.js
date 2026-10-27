// Can this browser create a WebGL context at all? Ask before mounting a
// three.js canvas: without WebGL, fiber's renderer throws on mount. The probe
// context is released at once, since browsers cap live contexts.
export default function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}
