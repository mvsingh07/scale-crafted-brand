import { useEffect, useRef } from "react";

const shaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 pointer;

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = rnd(i);
  float b = rnd(i + vec2(1, 0));
  float c = rnd(i + vec2(0, 1));
  float d = rnd(i + 1.);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float t = .0, a = 1.;
  mat2 m = mat2(1., -.5, .2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2. * m;
    a *= .5;
  }
  return t;
}

float clouds(vec2 p) {
  float d = 1., t = .0;
  for (float i = .0; i < 3.; i++) {
    float a = d * fbm(i * 10. + p.x * .2 + .2 * (1. + i) * p.y + d + i * i + p);
    t = mix(t, d, a);
    d = a;
    p *= 2. / (i + 1.);
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - .5 * R) / MN;
  vec2 mouse = (pointer - .5 * R) / MN;
  vec2 st = uv * vec2(2, 1);
  vec3 col = vec3(0);
  float bg = clouds(vec2(st.x + T * .38 + mouse.x * .6, -st.y + mouse.y * .35));

  uv *= 1. - .24 * (sin(T * .2) * .5 + .5);
  uv += mouse * .16;

  for (float i = 1.; i < 12.; i++) {
    uv += .1 * cos(i * vec2(.1 + .01 * i, .8) + i * i + T * .42 + .1 * uv.x);
    vec2 p = uv;
    float d = length(p);
    vec3 spectral = cos(sin(i) * vec3(1.2, 2.1, 3.0)) + 1.;
    spectral *= vec3(.55, .78, 1.18);
    col += .0015 / d * spectral;
    float b = noise(i + p + bg * 1.731);
    col += .002 * b / length(max(p, vec2(b * p.x * .02, p.y)));
    col = mix(col, vec3(bg * .045, bg * .09, bg * .18), d);
  }

  vec3 tint = vec3(.03, .08, .16);
  col = mix(tint, col, .88);
  O = vec4(pow(col, vec3(.82)), 1);
}`;

const vertexSource = `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

export const HeroVisionFrame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, shaderSource);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    const pointer = gl.getUniformLocation(program, "pointer");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      pointerRef.current = [canvas.width * 0.5, canvas.height * 0.5];
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = canvas.width / Math.max(rect.width, 1);
      pointerRef.current = [
        (event.clientX - rect.left) * dpr,
        canvas.height - (event.clientY - rect.top) * dpr,
      ];
    };

    let frame = 0;
    const render = (now: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, now * 0.001);
      gl.uniform2f(pointer, pointerRef.current[0], pointerRef.current[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-[2rem] border border-border/70 bg-black shadow-elegant md:min-h-[580px]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,transparent_0%,hsl(var(--background)/0.08)_42%,hsl(var(--background)/0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,hsl(var(--background)/0.72))]" />
      <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/10 bg-background/42 p-6 backdrop-blur-2xl md:inset-x-8 md:bottom-8 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          Embedded Frame
        </p>
        <h2 className="mt-3 max-w-lg text-balance font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
          Visionary Mind: Igniting Innovation through continous learning
        </h2>
      </div>
    </div>
  );
};
