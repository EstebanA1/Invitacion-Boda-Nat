# Invitación Natalia & Gabriel

Invitación digital de boda para Natalia y Gabriel. Está construida con React, Vite y TypeScript, con una experiencia vertical pensada primero para teléfonos y una secuencia visual inspirada en una invitación que se abre desde un sobre.

La fecha configurada actualmente es el sábado 28 de noviembre de 2026.

## Funcionalidades

- Portada personalizada para una invitación de 1 o 2 lugares.
- Variantes mediante la URL: `?inv=1` y `?inv=2`.
- Animación de apertura y desplazamiento hacia la invitación.
- Escenas visuales con las portadas, el sobre, la fecha y la bendición.
- Información de ceremonia y recepción.
- Cuenta regresiva hasta la boda.
- Formulario de confirmación de asistencia.
- Registro de nombre, asistencia, acompañantes, teléfono, restricciones alimentarias y mensaje.
- Envío de respuestas a Google Sheets mediante Google Apps Script.
- Respaldo local en el navegador cuando Google Sheets no está configurado o no responde.
- Resumen privado de confirmaciones mediante un enlace con clave.
- Reproductor de música para la invitación.

## Rutas y parámetros

La aplicación utiliza una sola página. Las variantes se controlan con parámetros de consulta:

```text
https://TU-URL/?inv=1
https://TU-URL/?inv=2
```

Si no se incluye `inv`, se muestra la invitación de 1 lugar.

El resumen privado se abre con la clave configurada:

```text
https://TU-URL/?admin=TU_CLAVE_PRIVADA
```

El resumen no aparece para los invitados que acceden sin el parámetro `admin` correcto.

## Instalación y desarrollo local

Requiere Node.js y npm.

```bash
npm install
npm run dev
```

Después, abre la dirección local indicada por Vite. El proyecto usa el puerto `3000` por defecto.

## Comandos disponibles

```bash
npm run dev       # Inicia el servidor local
npm run build     # Genera la versión de producción
npm run preview   # Previsualiza la versión generada
npm run lint      # Comprueba los tipos de TypeScript
```

Antes de publicar, conviene ejecutar:

```bash
npm run lint
npm run build
```

## Configuración del evento

Los nombres, fecha, horarios, lugares, enlaces de mapas, fecha límite y conexión con RSVP se encuentran en:

```text
src/config.ts
```

En ese archivo se pueden cambiar los datos visibles de la invitación. Las direcciones actuales son textos provisionales y deben reemplazarse por las direcciones oficiales antes de publicar.

## Confirmaciones en Google Sheets

La invitación puede enviar las respuestas a una hoja de cálculo usando un Web App de Google Apps Script.

La configuración paso a paso y el código del script están en:

```text
GOOGLE_SHEETS_SETUP.md
```

Variables utilizadas:

```text
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec
VITE_ADMIN_KEY=elige-una-clave-privada
```

Para desarrollo local, pueden colocarse en un archivo `.env.local`. Los archivos `.env` están ignorados por Git, por lo que no deben subirse al repositorio.

La hoja recibe estas columnas:

```text
Fecha, Nombre, Asistencia, Acompañantes, Total personas, Teléfono, Restricciones, Mensaje, Invitación
```

El formulario guarda primero una copia local. Esto permite conservar la respuesta en ese navegador si el endpoint todavía no está configurado, aunque la fuente principal para la administración es Google Sheets.

## Imágenes y música

Las imágenes de la invitación están en:

```text
assets/invitation/
```

Las composiciones nuevas utilizan capas independientes dentro de:

```text
assets/invitation/layers/
```

Capas actuales:

- `white-flowers.png`: arreglo de flores blancas.
- `green-envelope.png`: sobre cerrado.
- `envelope-back.png`: parte trasera del sobre abierto.
- `envelope-front.png`: parte frontal con flores y sello.
- `envelope-seal.png`: sello con las iniciales NG.
- `pearl-strands.png`: perlas decorativas.
- `ornate-frame.png`: marco para la tarjeta de fecha y las ubicaciones.
- `gold-divider.png`: separadores de la tarjeta de fecha.
- `mint-heart-divider.png`: adorno inferior de la escena de bendición.
- `green-oval-frame.png`: marco ovalado.
- `mixed-flowers.png`: arreglo de flores variadas.
- `handwritten-paper.png`: recortes manuscritos de la sección de ubicaciones.
- `white-rose-spray.png`: rosas blancas de la sección de ubicaciones.
- `formal-photo.jpg` y `looking-photo.jpg`: fotografías de Natalia y Gabriel.

Si se reemplaza una imagen, se debe conservar el nombre del archivo o actualizar la importación correspondiente en `src/components/DigitalWeddingInvitation.tsx`. Las posiciones, tamaños y animaciones de cada capa se controlan desde `src/index.css`.

### Ajustes manuales de las escenas

Las escenas visuales utilizan un lienzo vertical que ocupa toda la sección visible. En móvil toma el ancho completo y en escritorio se mantiene centrado con un ancho máximo de `540px`. Las posiciones principales están expresadas en porcentajes para que el diseño se escale como una sola pieza.

- Portada: clases que comienzan con `.cover-`.
- Sobre abierto: clases que comienzan con `.open-envelope-`.
- Tarjeta de fecha: clases que comienzan con `.date-card-`.
- Fotografía ovalada: clases que comienzan con `.oval-` y `.blessing-`.
- Ubicaciones: clases que comienzan con `.details-` y `.location-`.
- Código de vestimenta y programa: clases que comienzan con `.dress-code-` y `.program-`.

Cada escena y cada pieza importante también tiene un `id` único para seleccionarla directamente desde DevTools:

- Escenas: `#scene-cover`, `#scene-envelope`, `#scene-date`, `#scene-blessing`, `#scene-details`, `#scene-countdown`, `#scene-program`, `#rsvp` y `#scene-admin`.
- Portada: `#cover-intro`, `#cover-names`, `#cover-envelope`, `#cover-seal`, `#cover-bouquet` y `#cover-reserved`.
- Sobre abierto: `#envelope-back`, `#envelope-photo`, `#envelope-front` y `#envelope-pearls`.
- Tarjeta: `#date-frame`, `#date-names`, `#date-divider-main`, `#date-row`, `#date-year`, `#date-quote` y `#date-flower`.
- Bendición: `#blessing-frame`, `#blessing-photo`, `#blessing-copy` y `#blessing-heart-divider`.
- Programa: `#dress-code`, `#program-envelope`, `#program-frame`, `#program-seal`, `#program-title` y `#event-timeline`.

Los atributos `data-scene` y `data-group` permiten filtrar grupos completos como `text`, `photo`, `envelope`, `decoration` o `interaction` sin depender del orden del DOM.

Para mover una capa se deben modificar principalmente `top`, `left`, `right` o `width`. Conviene mantener estos valores en porcentajes y evitar márgenes fijos en píxeles dentro de las escenas, porque esos valores no se escalan con el lienzo.

Para comparar las capas con las composiciones de referencia, se puede activar temporalmente una guía semitransparente mediante la URL:

```text
http://127.0.0.1:3000/?inv=1&guide=1
http://127.0.0.1:3000/?inv=2&guide=1
```

Las imágenes de calibración están en `assets/invitation/guides/`. El parámetro `guide=1` es solo una ayuda visual y nunca se utiliza en los enlaces enviados a los invitados.

La música se administra desde `src/components/AudioPlayer.tsx`. La versión actual genera acordes suaves directamente en el navegador, por lo que no depende de un archivo de audio externo.

## Publicación en Google AI Studio

El proyecto conserva la estructura React/Vite para poder sincronizarse desde GitHub hacia Google AI Studio y publicarse con la URL gratuita que entregue ese servicio.

Flujo recomendado:

1. Sincronizar o importar la rama `main` del repositorio.
2. Configurar las variables de entorno de producción, especialmente `VITE_GOOGLE_SCRIPT_URL` y `VITE_ADMIN_KEY`.
3. Ejecutar la publicación desde Google AI Studio.
4. Probar la URL pública con `?inv=1`, `?inv=2` y el enlace privado de administración.

La URL pública será la que entregue Google AI Studio. No es necesario disponer de un dominio `.cl` para utilizar las variantes de la invitación.

## Seguridad

- No guardar API keys, claves privadas ni archivos `.env` en GitHub.
- La aplicación actual no utiliza Firebase ni `firebase-applet-config.json`.
- La clave de administración se incorpora durante la configuración de publicación, no en el README.
- Si una clave anterior fue expuesta, debe revocarse o rotarse desde el servicio correspondiente aunque ya se haya eliminado del código y del historial publicado.

## Estructura principal

```text
assets/invitation/                 Imágenes de las escenas
src/components/DigitalWeddingInvitation.tsx  Experiencia principal
src/components/AudioPlayer.tsx     Música de la invitación
src/config.ts                      Datos y configuración del evento
src/index.css                      Estilos visuales y responsive
GOOGLE_SHEETS_SETUP.md             Configuración del RSVP
```

## Repositorio

[EstebanA1/Invitacion-Boda-Nat](https://github.com/EstebanA1/Invitacion-Boda-Nat)
