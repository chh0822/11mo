import React, { useState, useEffect, useRef } from 'react';
import './carta.css';

export default function CartaAniversario() {
  const [abierta, setAbierta] = useState(false);
  const [flores, setFlores] = useState([]);
  const [floresFondo, setFloresFondo] = useState([]); // Nuevo estado para el fondo
  const [memorias, setMemorias] = useState([]); // NUEVO: Estado para fotos y canción
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (abierta) {
      // Reproducir música
      if (audioRef.current) {
        audioRef.current.volume = 0.2; // Ajusta el volumen según sea necesario
        audioRef.current.play().catch((error) => console.log("Autoplay bloqueado:", error));
      }

      const tiposPetalos = [
        '/flor1.png',
        '/flor2.png',
        '/flor3.png',
        '/flor4.png',
        '/flor5.png'
      ];

      // --- 1. Generar Memorias Flotantes (Canción y fotos) ---
      // Asegúrate de tener estos archivos en tu carpeta /public
      const archivosMemorias = [
        '/cancion.png', // Imagen de Apple Music
        '/foto1.jpeg',  // Foto 1
        '/foto2.jpeg',  // Foto 2
        '/foto3.jpeg',  // Foto 3
        '/foto4.jpeg',  // Foto 4
        '/foto5.jpeg',  // Foto 5
        '/foto6.jpeg',  // Foto 6
        '/foto7.jpg',  // Foto 7
      ];

      const nuevasMemorias = archivosMemorias.map((src, i) => {
        // Distribuimos las fotos en círculo para que rodeen la carta
        const angulo = (Math.PI * 2 * i) / archivosMemorias.length + (Math.random() * 0.5);
        
        // --- CAMBIO AQUÍ: Radio mucho más amplio para alejar las imágenes del centro ---
        const radio = 280 + Math.random() * 80; 
        
        return {
          id: `memo-${i}`,
          imgSrc: src,
          x: Math.cos(angulo) * radio,
          y: Math.sin(angulo) * radio,
          // Rotación aleatoria para que parezcan fotos tiradas en una mesa
          rotacion: (Math.random() - 0.5) * 40, 
          retraso: i * 0.2 
        };
      });
      setMemorias(nuevasMemorias);

      // --- 2. Generar flores de fondo (Detrás de la carta) ---
      const cantidadFondo = 20; 
      const nuevasFloresFondo = Array.from({ length: cantidadFondo }).map((_, i) => ({
        id: `fondo-${i}`,
        imgSrc: tiposPetalos[Math.floor(Math.random() * tiposPetalos.length)],
        // Dispersión aleatoria alrededor del centro
        x: (Math.random() - 0.5) * 350, 
        y: (Math.random() - 0.5) * 350,
        scale: 0.5 + Math.random() * 0.7, 
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5 
      }));
      setFloresFondo(nuevasFloresFondo);
      
      // --- 3. Generar la espiral de flores (Delante de la carta) ---
      const cantidadFlores = 40;
      const nuevasFlores = Array.from({ length: cantidadFlores }).map((_, i) => {
        const angulo = 0.4 * i; 
        const radio = 8 * i; 
        
        const x = Math.cos(angulo) * radio;
        const y = Math.sin(angulo) * radio;
        
        return {
          id: i,
          imgSrc: tiposPetalos[Math.floor(Math.random() * tiposPetalos.length)],
          x: x,
          y: y,
          retrasoSalida: i * 0.03, 
          retrasoCaida: (cantidadFlores * 0.03) + 1 + (Math.random() * 2)
        };
      });
      
      setFlores(nuevasFlores);
    } else {
      setFlores([]);
      setFloresFondo([]);
      setMemorias([]);
    }
  }, [abierta]);

  return (
    <div className="escenario">
      <audio ref={audioRef} loop>
        <source src="/cancion.mp3" type="audio/mpeg" />
      </audio>

      {/* --- Contenedor de flores de FONDO (Capa -1) --- */}
      <div className="fondo-petalos-backdrop">
        {floresFondo.map((flor) => (
          <div
            key={flor.id}
            className="petalo-backdrop"
            style={{
              '--pos-x': `${flor.x}px`,
              '--pos-y': `${flor.y}px`,
              '--scale': flor.scale,
              '--rotation': `${flor.rotation}deg`,
              '--delay': `${flor.delay}s`,
            }}
          >
            <img src={flor.imgSrc} alt="Flor de fondo" className="imagen-petalo" />
          </div>
        ))}
      </div>

      {/* --- NUEVO: Contenedor de MEMORIAS FLOTANTES (Capa 5) --- */}
      <div className="centro-memorias">
        {memorias.map((memo) => (
          <div
            key={memo.id}
            className="memoria-flotante"
            style={{
              '--final-x': `${memo.x}px`,
              '--final-y': `${memo.y}px`,
              '--rotacion': `${memo.rotacion}deg`,
              '--retraso': `${memo.retraso}s`,
            }}
          >
            <img src={memo.imgSrc} alt="Memoria" />
          </div>
        ))}
      </div>

      {/* --- Contenedor de la espiral de flores (Capa 20 - GIGANTES Y DELANTE) --- */}
      <div className="centro-espiral">
        {flores.map((flor) => (
          <div
            key={flor.id}
            className="flor-animada"
            style={{
              '--destino-x': `${flor.x}px`,
              '--destino-y': `${flor.y}px`,
              '--retraso-salida': `${flor.retrasoSalida}s`,
              '--retraso-caida': `${flor.retrasoCaida}s`,
            }}
          >
            <img 
              src={flor.imgSrc} 
              alt="Pétalo real" 
              className="imagen-petalo" 
            />
          </div>
        ))}
      </div>

      {/* --- Sobre y Carta (Capa 10) --- */}
      <div className={`sobre ${abierta ? 'abierto' : ''}`} onClick={() => setAbierta(true)}>
        <div className="parte-trasera"></div>
        <div className="carta">
          <h2>¡Felices 11 mesecitos mi Amor Hermosa!</h2>
          <p>
            Sé que estamos lejos pero quiero que sepas que quisiera estar ahi contigo para apoyarte; y pese a que no estoy, sé que vas a pasar esta fase y pronto nos veremos de vuelta (con mas cosas que hacer porque vas a ganar y vamos a implementar tu proyecto). Muchas fuercitas, te amo y te extraño muchísimo.
          </p>
          <p>💖💖💖💖💖💖💖</p>
          <button 
            className="boton-galeria" 
            onClick={(e) => {
              e.stopPropagation();
              setMostrarGaleria(true);
            }}
          >
            Ver nuestros momentos
          </button>
        </div>
        <div className="parte-frontal"></div>
        <div className="solapa"></div>
      </div>

      {/* --- Modal de la Galería (Capa 30) --- */}
      {mostrarGaleria && (
        <div className="galeria-overlay" onClick={() => setMostrarGaleria(false)}>
          <div className="galeria-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="boton-cerrar" onClick={() => setMostrarGaleria(false)}>✕</button>
            <h3>Los 11 mejores meses del mundo con la mejor novia del mundo</h3>
            <div className="grilla-fotos">
              <img src="/recuerdo1.jpg" alt="Foto 1" className="foto-galeria" />
              <img src="/recuerdo2.jpg" alt="Foto 2" className="foto-galeria" />
              <img src="/recuerdo3.jpeg" alt="Foto 3" className="foto-galeria" />
              <img src="/recuerdo4.jpeg" alt="Foto 4" className="foto-galeria" />
              <img src="/recuerdo5.jpeg" alt="Foto 5" className="foto-galeria" />
              <img src="/recuerdo6.jpeg" alt="Foto 6" className="foto-galeria" />
              <img src="/recuerdo7.jpeg" alt="Foto 7" className="foto-galeria" />
              <img src="/recuerdo8.jpeg" alt="Foto 8" className="foto-galeria" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}