# Frontend Hult Prize Registro

Aplicación Angular para el registro de proyectos Hult Prize.

## Desarrollo

### Prerrequisitos
- Node.js 18+
- Angular CLI

### Instalación
```bash
npm install
```

### Ejecutar en desarrollo
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

## Producción

### Build
```bash
ng build --configuration production
```

Los archivos se generan en `dist/hult-prize-registro/`.

### Despliegue en Render

1. **Sube el código a GitHub** (asegúrate de incluir el directorio del frontend)

2. **En Render.com:**
   - Crea un nuevo **Static Site**
   - Conecta tu repositorio de GitHub
   - **Root Directory:** `frotend/hult-prize-registro` (ajusta según tu estructura)

3. **Configuración:**
   - **Build Command:** `ng build --configuration production`
   - **Publish Directory:** `dist/hult-prize-registro/browser`
   - **Redirects:** Ya está configurado con el archivo `_redirects`

4. **Deploy!** Render construirá y desplegará automáticamente.

### Variables de entorno

La aplicación usa diferentes URLs para desarrollo y producción:
- **Desarrollo:** `http://localhost:3000`
- **Producción:** `https://hult-prize-registro-backend.onrender.com`

## Características

- Formulario de registro responsive
- Validación de campos
- Integración con backend API
- Diseño moderno con Tailwind CSS

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
