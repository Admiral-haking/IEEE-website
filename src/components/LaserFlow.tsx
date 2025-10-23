"use client";

import React, { useRef, useEffect } from 'react';

interface LaserFlowProps {
  horizontalBeamOffset?: number;
  verticalBeamOffset?: number;
  color?: string;
  intensity?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function LaserFlow({
  horizontalBeamOffset = 0.0,
  verticalBeamOffset = 0.0,
  color = "#FF79C6",
  intensity = 1.0,
  speed = 1.0,
  className = "",
  style = {}
}: LaserFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS animation');
      return;
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_uv = a_position * 0.5 + 0.5;
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform float u_time;
      uniform float u_horizontalBeamOffset;
      uniform float u_verticalBeamOffset;
      uniform vec3 u_color;
      uniform float u_intensity;
      uniform float u_speed;
      uniform vec2 u_resolution;
      
      varying vec2 v_uv;
      
      // Noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Smooth noise
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      // Fractal noise
      float fractalNoise(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * smoothNoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = v_uv;
        float time = u_time * u_speed;
        
        // Create laser beam effect
        float beam1 = 0.0;
        float beam2 = 0.0;
        
        // Horizontal laser beam
        float horizontalBeam = abs(uv.y - (0.5 + u_horizontalBeamOffset));
        horizontalBeam = 1.0 - smoothstep(0.0, 0.1, horizontalBeam);
        
        // Add noise to horizontal beam
        float horizontalNoise = fractalNoise(vec2(uv.x * 10.0 + time * 2.0, uv.y * 5.0));
        horizontalBeam *= (0.7 + 0.3 * horizontalNoise);
        
        // Vertical laser beam
        float verticalBeam = abs(uv.x - (0.5 + u_verticalBeamOffset));
        verticalBeam = 1.0 - smoothstep(0.0, 0.1, verticalBeam);
        
        // Add noise to vertical beam
        float verticalNoise = fractalNoise(vec2(uv.x * 5.0, uv.y * 10.0 + time * 2.0));
        verticalBeam *= (0.7 + 0.3 * verticalNoise);
        
        // Combine beams
        float combinedBeam = max(horizontalBeam, verticalBeam);
        
        // Add some additional laser effects
        float laserPulse = sin(time * 3.0) * 0.5 + 0.5;
        combinedBeam *= (0.5 + 0.5 * laserPulse);
        
        // Add glow effect
        float glow = 0.0;
        for (int i = 0; i < 5; i++) {
          float offset = float(i) * 0.02;
          glow += 1.0 - smoothstep(0.0, 0.3 + offset, 
            min(abs(uv.y - (0.5 + u_horizontalBeamOffset)), 
                abs(uv.x - (0.5 + u_verticalBeamOffset))) - offset);
        }
        glow *= 0.2;
        
        // Final color
        vec3 finalColor = u_color * (combinedBeam + glow) * u_intensity;
        
        gl_FragColor = vec4(finalColor, combinedBeam + glow);
      }
    `;

    // Create shader
    function createShader(type: number, source: string) {
      if (!gl) return null;
      const webgl = gl as WebGLRenderingContext;
      const shader = webgl.createShader(type);
      if (!shader) return null;
      
      webgl.shaderSource(shader, source);
      webgl.compileShader(shader);
      
      if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', webgl.getShaderInfoLog(shader));
        webgl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    // Create program
    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      if (!gl) return null;
      const webgl = gl as WebGLRenderingContext;
      const program = webgl.createProgram();
      if (!program) return null;
      
      webgl.attachShader(program, vertexShader);
      webgl.attachShader(program, fragmentShader);
      webgl.linkProgram(program);
      
      if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
        console.error('Program linking error:', webgl.getProgramInfoLog(program));
        webgl.deleteProgram(program);
        return null;
      }
      
      return program;
    }

    if (!gl) return;
    const webgl = gl as WebGLRenderingContext;
    const vertexShader = createShader(webgl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(webgl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(vertexShader, fragmentShader);
    if (!program) return;

    // Get attribute and uniform locations
    const positionLocation = webgl.getAttribLocation(program, 'a_position');
    const timeLocation = webgl.getUniformLocation(program, 'u_time');
    const horizontalBeamOffsetLocation = webgl.getUniformLocation(program, 'u_horizontalBeamOffset');
    const verticalBeamOffsetLocation = webgl.getUniformLocation(program, 'u_verticalBeamOffset');
    const colorLocation = webgl.getUniformLocation(program, 'u_color');
    const intensityLocation = webgl.getUniformLocation(program, 'u_intensity');
    const speedLocation = webgl.getUniformLocation(program, 'u_speed');
    const resolutionLocation = webgl.getUniformLocation(program, 'u_resolution');

    // Create buffer
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), webgl.STATIC_DRAW);

    // Parse color
    const parseColor = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      return [r, g, b];
    };

    const colorRGB = parseColor(color);

    // Animation loop
    const animate = (currentTime: number) => {
      timeRef.current = currentTime * 0.001;

      // Resize canvas
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      webgl.viewport(0, 0, canvas.width, canvas.height);

      // Use program
      webgl.useProgram(program);

      // Set uniforms
      webgl.uniform1f(timeLocation, timeRef.current);
      webgl.uniform1f(horizontalBeamOffsetLocation, horizontalBeamOffset);
      webgl.uniform1f(verticalBeamOffsetLocation, verticalBeamOffset);
      webgl.uniform3fv(colorLocation, colorRGB);
      webgl.uniform1f(intensityLocation, intensity);
      webgl.uniform1f(speedLocation, speed);
      webgl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      // Set attributes
      webgl.enableVertexAttribArray(positionLocation);
      webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

      // Draw
      webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      webgl.deleteShader(vertexShader);
      webgl.deleteShader(fragmentShader);
      webgl.deleteProgram(program);
      webgl.deleteBuffer(buffer);
    };
  }, [horizontalBeamOffset, verticalBeamOffset, color, intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}
