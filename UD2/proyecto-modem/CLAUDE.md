# Proyecto DIW — Web del estudio indie "modem"

## Qué es
- Asignatura: Desenvolvemento de Interfaces Web (DIW), DAW, IES San Clemente. Tema UD2.
- Proyecto en grupo: grupo 2. Jefe de grupo: Miguel Tubío (yo).
  Equipo: Lucas Trillo Noya, Daniel Lijó Gómez, Santiago Díaz Fuentes, Diego González Gómez.
- Enunciado (proyecto 2, estudio de videojuegos indie): web con
  - Inicio: presentación del estudio y su filosofía, banner con el juego destacado.
  - Juegos: listado con imágenes, descripciones y enlaces de descarga o demo.
  - Noticias: entradas de blog o actualizaciones.
  - Contacto: formulario y redes sociales.
- Entrega: el diseño en Figma y un documento con muchos bocetos. Según nos dijeron en
  clase, NO hay que implementarlo en código; el objetivo es que el profe dé el visto bueno.

## Identidad
- Nombre del estudio: "modem". Lema: "Estudio de videojuegos independiente".
- Logo: icono de un router con 4 antenas, estilo de línea. Archivos en
  ~/Clase/DIW/UD2/proyecto-modem/logo-modem/ (versiones blanca y negra, SVG y PNG).
  El nombre se escribe en Figma con Press Start 2P, nunca dentro de la imagen.
- Inspiración de estructura: web de Team Cherry (logo y menú arriba, blog con miniaturas,
  footer con la misión del estudio).
- Colores: basados en la paleta de Steam (azules oscuros + acento). Los valores
  oficiales son las variables y estilos de la página "Guía de estilo" del archivo A.
- Tipografía: Press Start 2P para títulos (títulos cortos, es poco legible en textos
  largos) e Inter para el texto. Los tamaños oficiales son los estilos de texto de Figma.
- Redes sociales: X, Instagram y Facebook. Iconos de Tabler Icons (outline) en
  ~/Clase/DIW/UD2/proyecto-modem/recursos/.
- Las decisiones de diseño se justifican con la teoría del tema UD2: psicología del
  color, paleta monocromática con un acento, máximo 3 colores de base, jerarquía visual,
  retícula, contraste y patrones de layout (imagen a pantalla completa en Inicio,
  tarjetas en Juegos, blog en columna única en Noticias, pantalla dividida en Contacto).

## Figma
- Archivo principal (A): "DIW Grupo 2 · Guía de estilo", en la carpeta compartida del
  equipo "DIW Grupo 2". https://www.figma.com/design/JBCWAqYXO3YtL32SiMftgg
  - Páginas: "Guía de estilo" y "01 · Pantallas". NO cambiar esta estructura de
    páginas: mis compañeros trabajan ahí.
  - "Guía de estilo": columnas Fundamentos, Componentes, Módulos de página y Bocetos
    (copia de los bocetos en gris + "Notas del grupo").
  - "01 · Pantallas": pantallas a color de escritorio (1440 px), en columnas por sección.
    Fila de arriba: "<Sección> · Escritorio" (Inicio, Juegos, Noticias, Contacto).
    Debajo de Juegos, de arriba abajo (ejemplos solo para el primer juego,
    Beast Acquirer Savage):
    - "Ficha de juego · Escritorio": plantilla de detalle de juego (banner, galería,
      columna lateral de datos, "Acerca de este juego", tráiler, requisitos).
    - "Demo · Paso 1/2/3 · Escritorio" (1440×900): modal de "Descargar demo" sobre una
      copia de Juegos con el velo oscuro (elegir plataforma, descargando, completada).
      Si cambia la pantalla de Juegos, hay que rehacer la copia de fondo de estos tres.
    - "Tráiler · Escritorio": reproductor, datos del vídeo, botones y "Más vídeos".
    Debajo de Noticias: "Noticia abierta · Escritorio" (primera noticia de la lista).
  - Lo que está entre corchetes ("[Descripción larga del juego]") es texto de relleno
    que tiene que rellenar el grupo.
  - Los enlaces y botones son solo visuales: no hay interacciones de prototipo.
- Archivo de bocetos (B): bocetos de baja fidelidad en grises de las 4 pantallas. Está
  fuera de la carpeta del equipo. No se toca; solo se lee o se copia de él.
  https://www.figma.com/design/DvBa6jbxYjt9SyFzuvVNnG
- Boceto y versión a color NO tienen por qué tener la misma estructura.
- Versión móvil: todavía NO. Pendiente de confirmar con el profe.

## Contenido
- El profe nos deja usar juegos que ya existen (con nombre real o parodiado).
  No tocar nada de los juegos (nombres, imágenes, textos) sin que yo lo pida.
- Paleta cerrada: los colores son los de la guía, decididos en grupo. No se cambia
  ningún color ni variable sin el OK del grupo. Único añadido aprobado: "Velo del modal"
  ("Fondo footer" #0d1821 al 70 %), para el fondo del modal y los controles de vídeo.
- Tarjeta de juego, jerarquía de acciones: Steam y Epic Games son los botones principales
  ("Botón de tienda"), "Descargar demo" es botón secundario, y "Ver tráiler" y
  "Ver ficha →" son enlaces de texto. Los 3 juegos tienen "PC" entre sus plataformas.
- Categorías de noticias: Todas · Anuncios · Juegos en tendencia · Actualizaciones ·
  Eventos · Diario de desarrollo. Cada noticia lleva su "Etiqueta de categoría".
- Iconos: tiendas (Steam, Epic Games) de Simple Icons en un solo color; el resto de
  Tabler Icons (outline). Los SVG están en recursos/.
- Componentes añadidos por los cambios del profe (documentados en la guía): Botón de
  tienda, Enlace de texto, Filtro, Etiqueta de categoría, Modal, Barra de progreso,
  Opción de plataforma, Reproductor de vídeo, Miniatura de vídeo, Galería de juego,
  Datos del juego, Requisitos, Banner de juego, Datos del vídeo, Cabecera de artículo,
  Cuerpo de artículo y Compartir. La guía tiene además un bloque "Iconos" y un apartado
  "Estructura de la página" por cada pantalla nueva.
- En las pantallas nuevas, las imágenes y los textos de relleno entre corchetes los
  ponen mis compañeros: no tocarlos.

## Estado actual (7 de octubre de 2026)

### Terminado
- Guía de estilo completa en el archivo A: fundamentos, componentes, módulos de página
  y columna de bocetos (los 4 bocetos en gris originales + "Notas del grupo").
- Las 4 pantallas originales a color (Inicio, Juegos, Noticias, Contacto), con las
  erratas corregidas, datos ficticios en el formulario y firmas "modem".
- Cambios que pidió el profe:
  - Juegos: botones de Steam y Epic Games, "Descargar demo", "Ver tráiler" y
    "Ver ficha →" en las 3 tarjetas.
  - Pantallas nuevas: Ficha de juego, Demo (pasos 1-3), Tráiler y Noticia abierta.
  - Noticias: barra de filtros y etiqueta de categoría en cada noticia (también en Inicio).
  - Todo lo nuevo está documentado en la guía y revisado contra las pantallas.

### Lo tienen que rellenar mis compañeros (no tocar)
- Imágenes: capturas 2-4 de la galería de la ficha, miniaturas de "Más vídeos",
  imagen intermedia de la noticia y las imágenes definitivas de banner, reproductor
  y noticias si quieren cambiarlas.
- Textos entre corchetes: descripción larga del juego, fecha de lanzamiento, precio,
  requisitos mínimos y recomendados, título y descripción del tráiler, títulos y
  duración de "Más vídeos", tamaño de la descarga, subtítulos y párrafos de la noticia.

### Pendiente
- Documento de entrega con los bocetos y la justificación del diseño (teoría de UD2).
- Bocetos en gris de las pantallas nuevas en la columna "Bocetos": por decidir.
- Versión móvil: por confirmar con el profe.

## Cómo trabajar
- Antes de usar las herramientas de Figma, carga las skills o guías que pida el MCP.
- Lee el archivo antes de cambiar nada. No borres nada sin preguntar.
- Colores y textos SIEMPRE vinculados a las variables y estilos de la guía, nunca hex sueltos.
- No inventes colores, fuentes ni contenido importante: si falta algo, propónmelo y
  espera mi OK. Prefiero que preguntes antes que dar cosas por hecho.
- Usa componentes e instancias (header, footer, botones, tarjetas, etiquetas,
  redes sociales, logo) y documenta cualquier componente nuevo en la guía de estilo.
- Contraste mínimo de texto: 4.5:1.
- Al acabar cada tarea, dame el enlace al archivo y un resumen de lo que has cambiado.
- ~/Clase/DIW es un repositorio git (la carpeta del proyecto está dentro, en
  UD2/proyecto-modem/).
  No hagas commit ni push sin que te lo pida.
- Los commits y push se hacen SIEMPRE en main, sin crear ramas.
- Háblame en español y en tono informal.
