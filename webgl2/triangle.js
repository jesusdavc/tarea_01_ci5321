// Función principal
function main() {
    // Obtener el canvas
    const canvas = document.querySelector('#glCanvas');
    if (!canvas) {
        console.error('No se encontró el canvas');
        return;
    }

    // Obtener el contexto WebGL
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('WebGL no está disponible');
        return;
    }
    
    console.log('WebGL está disponible');

    // Configurar viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Color de fondo
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Shaders
    const vsSource = `#version 300 es
        in vec2 aVertexPosition;
        in vec3 aVertexColor;
        out vec3 vColor;
        
        void main(void) {
            gl_Position = vec4(aVertexPosition, 0.0, 1.0);
            vColor = aVertexColor;
        }
    `;

    const fsSource = `#version 300 es
        precision mediump float;
        
        in vec3 vColor;
        out vec4 fragColor;
        
        void main(void) {
            fragColor = vec4(vColor, 1.0);
        }
    `;

    // Crear y compilar shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
        console.error('No se pudo crear el vertex shader');
        return;
    }
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compilando vertex shader:', gl.getShaderInfoLog(vertexShader));
        return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
        console.error('No se pudo crear el fragment shader');
        return;
    }
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compilando fragment shader:', gl.getShaderInfoLog(fragmentShader));
        return;
    }
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Error linkeando programa:', gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.useProgram(shaderProgram);

    // Coordenadas de los vértices del triángulo
    // [x, y, r, g, b] para cada vértice
    const vertices = new Float32Array([
        // Vértice superior 
        0.0, 0.85,    // Posición (x, y)
        1.0, 0.0, 0.0, // Color (r, g, b)
        
        // Vértice inferior izquierdo 
        -0.85, -0.5,  // Posición (x, y)
        0.0, 1.0, 0.0, // Color (r, g, b)
        
        // Vértice inferior derecho 
        0.85, -0.5,   // Posición (x, y)
        0.0, 0.0, 1.0  // Color (r, g, b)
    ]);

    // Crear buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Configurar atributos
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');

    const stride = 5 * 4; 
    // Configurar atributo de posición
    gl.vertexAttribPointer(
        vertexPosition, 
        2,           // 2 componentes (x, y)
        gl.FLOAT, 
        false, 
        stride,      // stride en bytes
        0            // offset
    );
    gl.enableVertexAttribArray(vertexPosition);
    
    // Configurar atributo de color
    gl.vertexAttribPointer(
        vertexColor, 
        3,           // 3 componentes (r, g, b)
        gl.FLOAT, 
        false, 
        stride,      // stride en bytes
        2 * 4        // offset: saltar 2 floats (posición)
    );
    gl.enableVertexAttribArray(vertexColor);

    // Dibujar el triángulo
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Ejecutar cuando la página cargue
window.onload = main;