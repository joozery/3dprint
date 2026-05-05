// ModelViewer — SVG-based pseudo-3D cube rendering with rotation controls
// Renders a wireframe+shaded cube or gear-like placeholder to represent uploaded STL.

const ModelShape = ({ rotX = -20, rotY = 30, scale = 1, wireframe = false, heatmap = false }) => {
  // Simple isometric-ish bracket shape: L-bracket with a hole
  // We'll render a composed shape in SVG using multiple faces projected.
  const cos = (d) => Math.cos(d * Math.PI / 180);
  const sin = (d) => Math.sin(d * Math.PI / 180);

  // 3D points of an L-bracket (industrial-looking part)
  // Base: 60x40x8, Upright: 60x8x40
  const pts3d = [
    // base bottom
    [-30, -20, 0], [30, -20, 0], [30, 20, 0], [-30, 20, 0],
    // base top
    [-30, -20, 8], [30, -20, 8], [30, 20, 8], [-30, 20, 8],
    // upright (attached on +y side going up)
    [-30, 12, 8], [30, 12, 8], [30, 20, 8], [-30, 20, 8],
    [-30, 12, 48], [30, 12, 48], [30, 20, 48], [-30, 20, 48],
  ];

  // Project 3D -> 2D with rotation
  const project = ([x, y, z]) => {
    // rotate around Y
    let x1 = x * cos(rotY) + z * sin(rotY);
    let z1 = -x * sin(rotY) + z * cos(rotY);
    let y1 = y;
    // rotate around X
    let y2 = y1 * cos(rotX) - z1 * sin(rotX);
    let z2 = y1 * sin(rotX) + z1 * cos(rotX);
    return [x1 * scale, -y2 * scale, z2];
  };

  const p = pts3d.map(project);

  // Face definitions [indexes, shade]
  const faces = [
    // base
    { idx: [0,1,2,3], fill: '#a8b3c7' }, // bottom
    { idx: [4,5,6,7], fill: '#e4e9f2' }, // top
    { idx: [0,1,5,4], fill: '#c7d0e0' }, // front
    { idx: [1,2,6,5], fill: '#b3bdd0' }, // right
    { idx: [2,3,7,6], fill: '#d4dae8' }, // back
    { idx: [3,0,4,7], fill: '#b3bdd0' }, // left
    // upright
    { idx: [8,9,10,11], fill: '#c7d0e0' }, // upright bottom (interior)
    { idx: [12,13,14,15], fill: '#dde3ee' }, // upright top
    { idx: [8,9,13,12], fill: '#d4dae8' }, // upright back-facing
    { idx: [9,10,14,13], fill: '#b3bdd0' }, // upright right
    { idx: [10,11,15,14], fill: '#a8b3c7' }, // upright far
    { idx: [11,8,12,15], fill: '#b3bdd0' }, // upright left
  ];

  // Sort faces by avg z (painter's algorithm)
  const sorted = faces.map(f => ({
    ...f,
    avgZ: f.idx.reduce((s,i) => s + p[i][2], 0) / f.idx.length,
  })).sort((a,b) => a.avgZ - b.avgZ);

  const heatmapColor = (z) => {
    // fake: bottom faces = thin wall warning (red), top = ok (green/blue)
    const t = (z + 60) / 120;
    if (t < 0.3) return '#ef4444';
    if (t < 0.5) return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <g>
      {sorted.map((f, i) => {
        const points = f.idx.map(idx => p[idx].slice(0,2).join(',')).join(' ');
        const fill = heatmap ? heatmapColor(f.avgZ) : f.fill;
        return (
          <polygon key={i}
            points={points}
            fill={wireframe ? 'none' : fill}
            stroke={wireframe ? '#1e2433' : 'rgba(30,36,51,0.35)'}
            strokeWidth={wireframe ? 0.6 : 0.4}
            fillOpacity={heatmap ? 0.75 : 1}
          />
        );
      })}
    </g>
  );
};

function ModelViewer({ rotation, setRotation, mode = 'shaded', bounds, showGrid = true }) {
  const [dragging, setDragging] = React.useState(false);
  const lastPos = React.useRef({ x: 0, y: 0 });

  const onDown = (e) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation(r => ({ x: r.x - dy * 0.5, y: r.y + dx * 0.5 }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => setDragging(false);

  return (
    <svg viewBox="-120 -120 240 240" width="100%" height="100%"
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      style={{ cursor: dragging ? 'grabbing' : 'grab', display: 'block', userSelect: 'none' }}>
      {/* dot grid background */}
      {showGrid && (
        <>
          <defs>
            <pattern id="dotgrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="0.5" fill="rgba(30,36,51,0.15)"/>
            </pattern>
          </defs>
          <rect x="-120" y="-120" width="240" height="240" fill="url(#dotgrid)"/>
          {/* axis indicators */}
          <line x1="-120" y1="0" x2="120" y2="0" stroke="rgba(30,36,51,0.08)" strokeWidth="0.5"/>
          <line x1="0" y1="-120" x2="0" y2="120" stroke="rgba(30,36,51,0.08)" strokeWidth="0.5"/>
        </>
      )}
      {/* ground shadow */}
      <ellipse cx="0" cy="55" rx="55" ry="8" fill="rgba(30,36,51,0.12)" />
      <ModelShape rotX={rotation.x} rotY={rotation.y} scale={1.2}
        wireframe={mode === 'wireframe'}
        heatmap={mode === 'heatmap'} />

      {/* Dimension line (when ruler mode) */}
      {mode === 'ruler' && bounds && (
        <g fontFamily="'IBM Plex Mono', monospace" fontSize="6" fill="#1e2433">
          <line x1="-72" y1="70" x2="72" y2="70" stroke="#1e2433" strokeWidth="0.6"/>
          <line x1="-72" y1="66" x2="-72" y2="74" stroke="#1e2433" strokeWidth="0.6"/>
          <line x1="72" y1="66" x2="72" y2="74" stroke="#1e2433" strokeWidth="0.6"/>
          <text x="0" y="80" textAnchor="middle">{bounds.x}mm</text>
        </g>
      )}
    </svg>
  );
}

Object.assign(window, { ModelViewer });
