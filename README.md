# Widget de YouTube Music

Una aplicación sin servidor desplegada en Vercel que genera un widget SVG dinámico mostrando una canción aleatoria de una playlist de YouTube. El widget muestra el título de la canción, el artista y un visualizador de música animado con barras moradas, ideal para incrustar en sitios web o READMEs de GitHub.

**Widget:** README de GitHub:
[<img align="left" width="1000" src="https://youtube-music-widget.vercel.app/_Now_Playing-FF0000?style=flat-square&logo=youtube-music&logoColor=white" height="300">](https://music.youtube.com/playlist?list=PLlHhWhyPeWs7qJtNiUH3f8Z3oSO8CgiH-)



## Características
- Obtiene una canción aleatoria de una playlist de YouTube usando la API de YouTube Data.
- Genera un SVG responsivo con:
  - Título de la canción y nombre del artista.
  - Barras de ecualizador animadas en tonos morados.
  - Marca sutil de "YouTube Music".
- Ligero y optimizado para despliegue en Vercel.
- Manejo de errores con un SVG de respaldo para problemas de la API.

## Requisitos
- Cuenta en [Vercel](https://vercel.com/) para el despliegue.
- [Clave de la API de YouTube Data](https://developers.google.com/youtube/v3) desde Google Cloud Console.
- Node.js y npm (para desarrollo local, opcional).

## Instalación
1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/youtube-music-widget.git
   cd youtube-music-widget
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:** Crea un archivo .env en la raíz del proyecto o configúralo en Vercel:
   ```bash
   YOUTUBE_API_KEY=tu_clave_de_api_de_youtube
   ```

## Configuración

* **ID de la playlist:** El ID de la playlist está hardcoded en ***api/youtube.js*** (PLlHhWhyPeWs7qJtNiUH3f8Z3oSO8CgiH-). Para usar otra playlist, actualiza la constante ***PLAYLIST_ID*** en el código.
  
* Asegúrate de que la playlist sea pública y contenga videos.

## Uso

1. **Desarrollo local:** Ejecuta el servidor de desarrollo con Vercel CLI:
   ```bash
   npm run dev
   ```

Accede al widget en **http://localhost:3000/api/youtube.**

2. **Despliegue en Vercel:**
   ```bash
   npm run deploy
   ```
Tras el despliegue, el widget estará disponible en **https://youtube-music-widget.vercel.app/**



## Estructura del proyecto
```
├── api/
│   └── youtube.js       # Función sin servidor para obtener la canción y generar el SVG
├── package.json        # Dependencias y scripts del proyecto
└── vercel.json         # Configuración de Vercel para compilación y enrutamiento
```

## Ejemplo de salida
El widget muestra:

* **Título:** Nombre de la canción (ej., "Shape of You").
  
* **Artista:** Nombre del artista (ej., "Ed Sheeran").
* **Visualizador:** 10 barras moradas animadas.
* **Marca:** Texto pequeño "YouTube Music" en la parte inferior.

## Solución de problemas

* **"YOUTUBE_API_KEY no configurada":** Asegúrate de que la clave de la API esté configurada en Vercel o en tu archivo .env.
  
* **"Playlist vacía":** Verifica que el ID de la playlist sea correcto y que la playlist tenga videos.
Errores de la API: Revisa la cuota de tu API de YouTube y la validez de la clave en Google Cloud Console.

## Contribuciones
¡Siéntete libre de hacer un fork del repositorio y enviar pull requests con nuevas funciones o mejoras!

## Licencia
Este proyecto está bajo la Licencia MIT.

## Créditos
Creado por Iván Mora. Potenciado por la API de YouTube Data y Vercel
