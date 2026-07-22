import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { BOARD_COLS, BOARD_ROWS, HEX_SIZE } from '../../constants';

/**
 * Cámara isométrica fija.
 * Vista 3/4 desde arriba mirando al centro del tablero.
 */
export default function Camera() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const centerX = (BOARD_COLS * HEX_SIZE * 1.5) / 2;
    const centerZ = (BOARD_ROWS * HEX_SIZE * Math.sqrt(3)) / 2;

    const distance = 28;
    const angle = Math.PI / 5.5; // ~33 grados de elevación

    camera.position.set(
      centerX + distance * Math.cos(angle),
      distance * Math.sin(angle) + centerZ * 0.3,
      centerZ + distance * Math.cos(angle),
    );
    camera.lookAt(centerX, 0, centerZ);
    (camera as THREE.PerspectiveCamera).fov = 42;
    camera.updateProjectionMatrix();

    gl.setClearColor('#0a0a0f');
  }, [camera, gl]);

  return null;
}
