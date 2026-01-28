function main() {
    // Obtener el canvas
    const canvas = document.querySelector('#glCanvas');
    if (!canvas) {
        console.error('No se encontró el canvas');
        return;
    }

    // Obtener el contexto WebGL usando TWGL
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('WebGL 2 no está disponible');
        return;
    }
    
    console.log('WebGL 2 está disponible');

    // Shaders para WebGL 2
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
        precision highp float;
        
        in vec3 vColor;
        out vec4 fragColor;
        
        void main(void) {
            fragColor = vec4(vColor, 1.0);
        }
    `;

    // Crear el programa usando TWGL
    const programInfo = twgl.createProgramInfo(gl, [vsSource, fsSource]);
    
    // Datos del triángulo
    const arrays = {
        aVertexPosition: {
            numComponents: 2,
            data: [
                0.0, 0.85,   // Vértice superior
                -0.85, -0.5, // Vértice inferior izquierdo
                0.85, -0.5,  // Vértice inferior derecho
            ],
        },
        aVertexColor: {
            numComponents: 3,
            data: [
                1.0, 0.0, 0.0, // Rojo - vértice superior
                0.0, 1.0, 0.0, // Verde - vértice inferior izquierdo
                0.0, 0.0, 1.0, // Azul - vértice inferior derecho
            ],
        },
    };

    // Crear buffers usando TWGL
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    function render(time) {
        // Redimensionar canvas si es necesario
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        
        // Configurar viewport
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // Limpiar el canvas
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Usar el programa
        gl.useProgram(programInfo.program);
        
        // Configurar atributos
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        
        // Dibujar el triángulo
        twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
        
        // Solicitar siguiente frame (para animaciones futuras)
        requestAnimationFrame(render);
    }

    // Iniciar el renderizado
    requestAnimationFrame(render);
}

// Ejecutar cuando la página cargue
window.onload = main;