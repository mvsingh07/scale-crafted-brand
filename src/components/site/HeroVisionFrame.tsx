import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const stats = [
  { label: "Experience", value: "3+ yrs" },
  { label: "Scale", value: "50K+ users" },
  { label: "Craft", value: "Full-Stack · AI" },
];

export const HeroVisionFrame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let frame = 0;
    const render = (now: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, now * 0.001);
      gl.uniform2f(pointer, canvas.width * 0.5, canvas.height * 0.5);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-[2rem] border border-border/70 bg-black shadow-elegant md:min-h-[680px]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Depth gradients */}
      <div className="absolute"/>
      <div className="absolute" />

      {/* Identity card — the signal emerging from the nebula */}
      <div className="absolute inset-x-5 bottom-5 md:inset-x-8 md:bottom-8">
        <div className="rounded-2xl border border-white/[0.08] bg-background/50  md:rounded-3xl overflow-hidden">

          {/* Top bar — identity stripe */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 md:px-8 md:py-4">
            <div className="flex items-center gap-2.5">
              {/* Live pulse — the system is online, the vision is active */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground">
               Engineer · Creator 
              </span>
            </div>
            
          </div>

          {/* Main body */}
          <div className="grid gap-5 p-4 md:grid-cols-12 md:gap-8 md:p-8 lg:items-end">

            {/* Left — name + thesis + description */}
            <div className="md:col-span-8">
              <p className="font-editorial not-italic font-light text-sm md:text-base tracking-wide text-foreground/80 mb-1.5">
                Manvir Singh
              </p>
              <h2 className="font-editorial italic leading-[1.22] text-lg md:text-[1.65rem]">
                <span className="text-primary">Visionary Mind: </span>
                <span className="text-secondary">Igniting Innovation through continuous learning</span>
              </h2>

              <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-muted-foreground md:mt-4 md:text-[0.9rem] hidden md:block">
                I design the quiet infrastructure behind ambitious products: scalable distributed
                systems, real-time platforms, AI workflows, and interfaces that feel intentional
                — from first click to last deploy.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-5">
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => scrollTo("work")}
                  className="gap-1.5 h-8 text-xs md:h-9 md:text-sm"
                >
                  Explore work <ArrowRight size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollTo("contact")}
                  className="text-muted-foreground hover:text-foreground h-8 text-xs md:h-9 md:text-sm"
                >
                  Let's talk
                </Button>
              </div>
            </div>

            {/* Right — proof points (desktop only) */}
            <div className="hidden md:flex md:col-span-4 flex-row flex-wrap gap-2 md:flex-col md:items-end">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2 md:text-right"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
                    {s.label}
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
