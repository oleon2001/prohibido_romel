# 🌌 Prohibido Romel — Portal de Sentencias Astrales

Una aplicación interactiva premium de sentencias cuántico-místicas diseñada para que **Romel** (el administrador) dicte el destino (Prohibido o Permitido) de los mortales, y estos puedan defenderse a través del tejido del hiperespacio.

---

## 🔮 Temática y Estética
La aplicación integra múltiples conceptos de alto impacto para crear una experiencia única:
1. **Física Cuántica y Entropía**: Fórmulas matemáticas reales flotando en el fondo (Ecuación de Schrödinger, incertidumbre de Heisenberg, entropía estadística de Boltzmann).
2. **Esquizofrenia y Voces del Consejo**: Un sintetizador de voz integrado (Web Speech API) que reproduce susurros y decretos del consejo de dioses, visible a través de burbujas astrales flotantes.
3. **Lost Canvas (Saint Seiya)**: Inspirado en la mística de Shaka de Virgo (animaciones del despertar del Cosmos, aura dorada brillante, ilustraciones de meditación).
4. **Yu-Gi-Oh!**: Cartas místicas de duelo con diseño interactivo, estrellas de nivel (órbitas) y estadísticas físicas de combate (Entropía, Voluntad Divina, Nivel Cuántico).
5. **Digimon**: Animación y destellos digitales de "Digievolución" cuando el estado del mortal cambia en tiempo real.

---

## 🚀 Funcionalidades Principales
- **Consola del Creador (Romel)**:
  - Creador de Juicios Astrales: Asigna nombre, selecciona estado (Prohibido/Permitido), escoge la cita del consejo (con vista previa de voz), y manipula el Nivel Cuántico y la Entropía.
  - Sincronización en la Nube: Guarda las sentencias en tiempo real usando un almacenamiento Key-Value público (`kvdb.io`).
  - Monitoreo en Tiempo Real: Romel puede ver las apelaciones (descargos) de los mortales instantáneamente y cambiar su veredicto (de Prohibido a Permitido) directamente desde su panel, actualizando la pantalla del usuario juzgado de forma interactiva.
- **Portal del Mortal Juzgado**:
  - Un portal de entrada con un gran botón místico para desbloquear el audio y revelar la carta.
  - Animación premium de revelación de carta (efecto de giros 3D y brillo de cosmos).
  - Formulario de Contraargumentación: Permite enviar defensas cuánticas al Creador Romel.

---

## 💻 Ejecución Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📡 Cómo entrar a la Consola de Romel
1. En la página de inicio, desplázate hasta la **Consola del Creador**.
2. Escribe la palabra clave: `revelacion esquizofrenica`.
3. Presiona **Entrar** para abrir el panel de control divino.
4. Genera una sentencia, copia el enlace generado y compártelo con el mortal juzgado.

---

## ⚡ Despliegue en Vercel
Esta aplicación está optimizada como una Single Page Application (SPA) basada en enrutamiento por query parameters (`?id=juicioId` o `?view=admin`). Esto significa que **funciona de inmediato al subirla a Vercel** sin necesidad de configurar reescrituras de rutas en `vercel.json` o lidiar con errores 404 al recargar la página.

1. Instala el CLI de Vercel (opcional) o conecta tu repositorio de GitHub a Vercel.
2. Despliega con:
   ```bash
   vercel
   ```
3. Vercel detectará el proyecto Vite automáticamente. ¡Y listo!
