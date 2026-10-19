# Login y registro — Nodo

**Alumno:** Miguel Tubío Vidal · **Módulo:** Deseño de Interfaces Web (DAW) · IES San Clemente

Sistema completo de autenticación para una aplicación web ficticia, **Nodo** (herramienta de gestión de proyectos en equipo). Incluye el diseño en Figma y la implementación en HTML + CSS + JavaScript.

## 1. Diseño en Figma

Archivo: https://www.figma.com/design/TQt4TBGTjhmVwWQM8n27td

El archivo tiene dos páginas:

- **📱 Pantallas**: las 8 vistas a 1440 × 900, el mapa del flujo de navegación y un **prototipo navegable** (botón ▶ *Present*). Todos los enlaces y botones del flujo están conectados.
- **🎨 Guía de estilo**: colores, tipografía, iconos y componentes con variantes (botón, campo de texto, checkbox, dígito de código, medidor de seguridad, etc.). Las pantallas están hechas con instancias de esos componentes y usan los estilos de color y texto.

En la carpeta `diseno-figma/` hay una exportación en PNG de cada pantalla, del flujo y de la guía.

## 2. Pantallas

| # | Vista | Archivo HTML |
|---|-------|--------------|
| 01 | Login | `index.html` |
| 02 | Registro (Sign Up) | `registro.html` |
| 03 | Verificar código (registro) | `verificar-registro.html` |
| 04 | Cuenta verificada | `exito-cuenta.html` |
| 05 | Recuperar contraseña (Forgot Password) | `recuperar.html` |
| 06 | Verificar código (recuperación) | `verificar-recuperacion.html` |
| 07 | Nueva contraseña (Set a Password) | `nueva-contrasena.html` |
| 08 | Contraseña actualizada | `exito-contrasena.html` |

Las vistas 04 y 08 no se piden en el enunciado. Se añaden para confirmar al usuario que la acción ha terminado bien antes de volver al login.

## 3. Requisitos cubiertos

- **Login**: correo y contraseña, checkbox *Recordarme*, enlaces a recuperar contraseña y a registro, y botones de Google, Facebook y Apple.
- **Registro**: nombre, apellido, correo y contraseña. Valida el formato del correo, la seguridad de la contraseña (medidor en vivo) y la aceptación de términos. Después redirige a la verificación por código.
- **Verificar código**: 6 casillas con avance automático, borrado hacia atrás, flechas y pegado del código completo. Comprueba que el código sea correcto. Tiene 3 intentos, caducidad de 10 minutos y reenvío con cuenta atrás.
- **Recuperar contraseña**: pide el correo, envía un código y redirige a la verificación.
- **Nueva contraseña**: medidor de seguridad, lista de requisitos que se marcan en vivo y confirmación. No permite repetir la contraseña anterior.
- **Flujo**: Login → Registro → Verificar → Login, y Login → Recuperar → Verificar → Nueva contraseña → Login.

## 4. Cómo probarlo

Abre `index.html` en el navegador. No hace falta servidor.

- **Cuenta de prueba:** `demo@nodo.app` / `Demo1234!`
- O crea una cuenta nueva desde *Regístrate*.

Como no hay servidor de correo, el código de verificación aparece en una **notificación de "correo simulado"** en la esquina superior derecha.

## 5. Decisiones de diseño

- **Panel de marca + formulario**: a la izquierda, un panel con la identidad de la app que se repite en todas las vistas para dar continuidad. A la derecha, una única columna de 400 px para que la lectura y el foco sean lineales.
- **Color**: un violeta (`#5B47F5`) como color de marca para acciones y foco. Grises con matiz frío para el texto. Rojo, ámbar y verde solo para estados (error, seguridad media y correcto).
- **Tipografía**: *Plus Jakarta Sans* en titulares y *Inter* en la interfaz.
- **Estados visibles**: cada campo tiene estado normal, foco (anillo violeta), error (borde y fondo rojos con mensaje) y válido.
- **Accesibilidad**: etiquetas `<label>` en todos los campos y errores asociados con `aria-describedby` y `aria-invalid`. Incluye enlace para saltar al contenido, foco visible, notificaciones en una región `aria-live` y soporte de `prefers-reduced-motion`.
- **Responsive**: en pantallas estrechas el panel de marca se oculta y el formulario ocupa todo el ancho.

## 6. Estructura

```
├── index.html, registro.html, … (8 vistas)
├── css/styles.css      ← tokens con los mismos nombres que los estilos de Figma
├── js/app.js           ← validaciones, flujo y almacenamiento simulado
├── assets/favicon.svg
└── diseno-figma/       ← exportación PNG del diseño
```

## 7. Nota técnica

Es una maqueta funcional sin backend. Los usuarios se guardan en `localStorage` y la contraseña se guarda cifrada con SHA-256, nunca en texto plano. El estado del flujo (correo, código e intentos) va en `sessionStorage`. El acceso con redes sociales es solo visual, porque necesitaría OAuth en un servidor real.
