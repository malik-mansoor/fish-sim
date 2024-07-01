uniform float uTime;
uniform float uSpeed;
uniform float uShift;

varying vec2 vUv;

void main() {
    float timeSpeed = (uTime + uShift) * uSpeed;

    float angle = cos(timeSpeed * 10.0) * 100.0 * 1.0;

    float mult = 1.0 / 650.0;
    float add = 0.5;
    float strenght = 1.0 - smoothstep(0.0, 1.0, ((position.z * mult) + add));
    
    float x = position.x + sin(position.z * 0.01 + timeSpeed * 3.0) * 50.0 * strenght * 2.0;
    float z = position.z;

    vec3 transformed = vec3(x, position.y, z);
   
    // Apply the instance matrix to the transformed position
    vec4 worldPosition = instanceMatrix * vec4(transformed, 1.0);
   
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;

    vUv = uv;
}