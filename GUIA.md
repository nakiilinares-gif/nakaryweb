# Guía: poner en línea tu web con portal de clientas

Todo se hace desde el navegador (celular o computadora). No necesitas instalar nada.
Tiempo estimado: 30–40 minutos la primera vez. Todo es gratis en los planes iniciales.

---

## Qué incluye

**Web pública**, con un inicio y una página por categoría:
- `/` **Inicio**: portada, las 3 categorías, tu filosofía y casos de éxito.
- `/nutricion` **Nutrición Consciente**: qué incluye y botón para solicitarlo.
- `/entrenamiento` **Planes**: presencial y online, con precios.
- `/evolucion` **Evolución y resultados**: casos de éxito y testimonios.
- En todas las páginas: formulario de contacto que te lleva a WhatsApp.
- Se adapta a celular, tablet, laptop y pantallas grandes/TV.

**Portal de clientas** (`/ingresar` → `/mi-plan`): cada clienta entra con su correo y contraseña y ve:
- Su plan, fecha de inicio y fin, **días restantes** y barra de avance.
- **Fecha de pago**, monto y estado (al día, próximo, pendiente, vencido).
- Su **plan de alimentación** y su **rutina de entrenamiento**.
- Su **progreso**: gráfica y tabla con las medidas que tú cargues.
- Un mensaje tuyo destacado.

**Tu panel** (`/admin`, solo con tu correo):
- **Clientas**: crear cuentas, plan, fechas, pagos, alimentación, rutina y medidas. Botón "Registrar pago y renovar +1 mes".
- **Contenido web**: editar todos los textos, precios, planes, logo y tu foto.
- **Casos y testimonios**: subir fotos, ordenar, ocultar y eliminar.
- **Solicitudes**: quién llenó el formulario de contacto (con botón de WhatsApp).

---

## PARTE 1 · Crear tu base de datos (Firebase)

1. Entra a **console.firebase.google.com** con tu cuenta de Google → **Agregar proyecto** → nombre (ej. `nakary-wellness`) → desactiva Google Analytics → **Crear**.
2. Menú **Compilación → Authentication → Comenzar** → pestaña **Método de acceso** → **Correo electrónico/contraseña** → activar → **Guardar**.
3. **Compilación → Firestore Database → Crear base de datos** → elige la ubicación más cercana (ej. `eur3` o `nam5`) → **Iniciar en modo de producción** → Crear.
4. En Firestore, pestaña **Reglas** → borra lo que haya → pega todo el contenido del archivo `firestore.rules` → **Publicar**.
   - Estas reglas hacen que cada clienta vea **solo su información** y que solo tú puedas editar.
   - Si usas otro correo como administradora, cámbialo dentro de las reglas (`nakiilinares@gmail.com`).
5. Engranaje ⚙ **Configuración del proyecto → General → Tus apps → icono Web `</>`** → ponle un nombre → **Registrar app**. Te muestra un bloque `firebaseConfig`. Cópialo.
6. Abre el archivo **`public/config.js`** y pega esos valores en `firebase: { ... }` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). Deja `adminEmail` con tu correo.
7. **MUY IMPORTANTE, hazlo antes de publicar:** en **Authentication → Usuarios → Agregar usuario**, crea tu cuenta con tu correo de administradora y una contraseña fuerte. Así nadie más puede registrarse con ese correo.
8. (Opcional) **Authentication → Plantillas → Restablecimiento de contraseña → Editar → Idioma: español**, para que el correo de "olvidé mi contraseña" llegue en español.

## PARTE 2 · Publicar la web (GitHub + Netlify)

1. Crea una cuenta en **github.com** → **New repository** → nombre `nakary-web` → **Create**.
2. En el repositorio: **uploading an existing file** → arrastra **todo el contenido** de esta carpeta (ya con tu `config.js` completado) → **Commit changes**.
3. Crea una cuenta en **netlify.com** → **Add new site → Import an existing project → GitHub** → elige `nakary-web` → **Deploy**. (El archivo `netlify.toml` ya trae la configuración.)
4. Si subiste la carpeta completa y quedó dentro de una subcarpeta (ej. `nakary-wellness`), en Netlify ve a **Project configuration → Build & deploy → Build settings** y escribe **Base directory:** `nakary-wellness`, **Build command:** `npm run build`, **Publish directory:** `dist`. Luego **Deploys → Trigger deploy → Clear cache and deploy site**.
5. En 1–2 minutos tendrás tu enlace (`algo.netlify.app`). Puedes cambiar el nombre o conectar tu dominio en **Domain management**.
6. Prueba: entra a `tu-enlace/ingresar` con tu correo de administradora. Debes ver tu panel.

> Para cambiar la configuración después (config.js): en GitHub abre el archivo → ícono del lápiz → editar → **Commit**. Netlify se actualiza solo.

## PARTE 3 · Uso diario

- **Nueva clienta**: Panel → Clientas → **Nueva clienta** → nombre, correo, contraseña temporal → llena su plan y fechas → **Crear clienta**. Te da un mensaje listo para copiar o abrir en WhatsApp con su acceso.
- **Medidas**: entra a la ficha de la clienta → sección **Medidas y progreso** → escribe lo que mediste (deja en blanco lo demás) → **Agregar medidas**. Ella lo ve de inmediato.
- **Renovación**: cuando pague, **Registrar pago y renovar +1 mes** y luego **Guardar cambios**.
- **Alimentación y rutina**: una tarjeta por comida o por día; escribe un alimento o ejercicio por línea. Puedes pegar desde tus documentos.
- **Imágenes**: se suben desde el panel y se reducen automáticamente para que la web cargue rápido. Las fotos de Google Drive de tu versión anterior siguen funcionando, pero conviene reemplazarlas (Casos y testimonios → **Importar los 2 casos actuales** y luego cambiarlas).
- **Olvidó su contraseña**: ella usa "Olvidé mi contraseña" en la pantalla de ingreso.

## CÓMO MODIFICAR LA WEB (tres niveles)

**Nivel 1 · Desde tu panel, sin código (lo de todos los días).** Entra a `tu-enlace/ingresar` con tu correo de administradora.
- Textos, precios, planes, página de Nutrición, logo y tu foto: **Contenido web** → editar → **Publicar cambios**. Se ve al instante.
- Fotos de casos de éxito y testimonios: **Casos y testimonios**.
- Clientas, planes, pagos, comidas, rutina y medidas: **Clientas**.

**Nivel 2 · Cambiar el código (diseño, colores, nuevas secciones).**
1. En GitHub abre tu repositorio y navega hasta el archivo (ej. `src/pages/Home.jsx`).
2. Toca el ícono del **lápiz** → haz el cambio → **Commit changes**.
3. Netlify detecta el cambio y publica solo en 1–2 minutos (lo ves en **Deploys**).
4. Si algo sale mal: en Netlify → **Deploys** → elige un despliegue anterior → **Publish deploy** para volver atrás.

Dónde está cada cosa:
| Quieres cambiar… | Archivo |
|---|---|
| Colores de la marca | `src/index.css` (arriba, `--color-...`) |
| Inicio | `src/pages/Home.jsx` |
| Página de nutrición / planes / evolución | `src/pages/Nutricion.jsx`, `Entrenamiento.jsx`, `Evolucion.jsx` |
| Menú, formulario de contacto y pie de página | `src/components/SiteLayout.jsx` |
| Textos iniciales por defecto | `src/defaults.js` |
| Conexión con Firebase | `public/config.js` |

**Nivel 3 · Pedirle a Claude cambios más grandes.** Descríbeme lo que quieres, te devuelvo los archivos actualizados y los subes a GitHub (en la carpeta correspondiente, arrastrando y aceptando reemplazar los existentes). Netlify publica solo.

## Buenas prácticas y límites

- **Privacidad**: las medidas y planes son datos personales de salud. Cada clienta solo ve lo suyo gracias a las reglas del paso 4. No publiques fotos o testimonios de alumnas sin su permiso.
- **Eliminar una clienta** borra su ficha y medidas; su usuario de acceso se quita aparte en Firebase → Authentication.
- **Plan gratuito de Firebase**: sobra para empezar (50.000 lecturas diarias). Las imágenes se guardan en la base de datos (máx. ~700 KB cada una); si algún día tienes decenas de fotos, se puede migrar a Firebase Storage.
- **Copia de seguridad**: guarda tu `config.js` y las reglas; el contenido vive en Firebase.
- **Contraseña de administradora**: fuerte y única. Quien entre a tu panel ve a todas las clientas.

## Modo demostración

Si `config.js` tiene `firebase` vacío, el sitio funciona en modo demo (datos solo en tu navegador) con estos accesos de prueba:
- Clienta: `clienta@demo.com` / `demo1234`
- Administradora: `admin@demo.com` / `demo1234`

Al conectar Firebase, el modo demo se apaga solo.

## Para quien programa (opcional)

```
npm install
npm run dev      # servidor local
npm run build    # genera /dist
```
Stack: React 18 + Vite + Tailwind 4 + Firebase (Auth + Firestore) + React Router. Hosting alternativo: Firebase Hosting (`firebase.json` incluido) o cualquier hosting estático con redirección SPA (`public/_redirects`).
