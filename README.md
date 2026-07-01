# Cuestionario de Iniciativas de IA y Procesos Repetitivos · IKUSI

Este proyecto es una aplicación web full-stack diseñada para capturar, almacenar y procesar iniciativas de Inteligencia Artificial y tecnología desarrolladas por los colaboradores de la empresa, así como identificar tareas repetitivas y manuales que les consumen tiempo.

El sistema tiene un enfoque de comunicación empático y amigable ("Tiempo para lo que importa"), diseñado para fomentar la participación sin generar temores de automatización o recortes de personal.

---

## 🚀 Características Principales

1. **Flujo Híbrido Dinámico (Cuestionario):**
   - **Camino A (Iniciativas de IA):** Flujo técnico basado en el diseño original del PDF. Captura estado del desarrollo, tecnologías utilizadas (GPT, Claude, etc.), fuentes de información (SharePoint, CRM, etc.), impacto y proyecciones de ahorro de tiempo.
   - **Camino B (Reportar Tarea Tediosa):** Flujo enfocado en el dolor del colaborador cotidiano. Identifica tareas repetitivas, frecuencia, duración y si el colaborador cuenta con una idea o desea sumarse al desarrollo del proyecto.

2. **Panel de Administración Inteligente (`/admin`):**
   - **Gráficos Estadísticos:** Visualización en tiempo real usando **Chart.js** con la distribución de aportes por Área e impacto tecnológico.
   - **Métricas Clave (KPIs):** Total de aportes, distribución porcentual y proyección de **horas de ahorro mensuales acumuladas**.
   - **Exportación Directa:** Descarga de la base de datos en formato **CSV estructurado (UTF-8 con BOM)** compatible directamente con Microsoft Excel.
   - **Seguridad Básica:** Acceso protegido mediante contraseña configurada en variables de entorno.

3. **Modo Demo (GitHub Pages):**
   - Detección automática del entorno. Si la web se abre desde GitHub Pages (`github.io`) o de forma estática en local (`file://`), la aplicación opera en **Modo Demostración**, guardando y recuperando los registros en el **`localStorage`** del navegador. Esto permite mostrar el formulario interactivo en GitHub sin necesidad de configurar un backend activo.

---

## 🛠️ Estructura del Proyecto

- `index.html`: Formulario del cuestionario (Frontend).
- `admin.html`: Panel de administración (Frontend).
- `logo-ikusi.jpg`: Logotipo corporativo institucional de Ikusi.
- `server.js`: Servidor Express de Node.js (API & Rutas estáticas).
- `database.js`: Controlador de la base de datos SQLite.
- `Dockerfile` & `docker-compose.yml`: Archivos de configuración para despliegue en contenedores.
- `.env.example` / `.env`: Configuración de variables de entorno.

---

## 💻 Desarrollo Local (Nativo)

Si deseas probar la aplicación de forma nativa en tu máquina local:

1. **Prerrequisitos:** Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
2. **Instalación de Dependencias:**
   ```bash
   npm install
   ```
3. **Configuración:**
   Copia el archivo `.env.example` como `.env` y define tu contraseña administrativa:
   ```env
   PORT=8080
   ADMIN_PASSWORD=mi_contrasena_segura
   ```
4. **Ejecutar:**
   ```bash
   npm start
   ```
5. **Acceso:**
   - Formulario: `http://localhost:8080`
   - Panel de control: `http://localhost:8080/admin` (contraseña por defecto: `ikusiadmin123` si no configuraste `.env`).

---

## 🐳 Despliegue en AWS EC2 (Con Docker Compose)

Para poner la aplicación en producción en un servidor de AWS EC2 de forma rápida y persistente:

1. **Instalar Docker y Docker Compose** en la instancia EC2:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
2. **Clonar o copiar** esta carpeta en la instancia de EC2.
3. **Modificar la Contraseña en `docker-compose.yml`**:
   Edita la variable `ADMIN_PASSWORD` en el archivo `docker-compose.yml` con la contraseña que utilizará el administrador de la página.
4. **Levantar el Contenedor:**
   ```bash
   sudo docker-compose up -d --build
   ```
5. **Persistencia de Datos:**
   Docker creará una carpeta llamada `data` en el directorio actual en donde se guardará el archivo SQLite `ikusi_cuestionario.db`. Aunque el contenedor se actualice o se detenga, los datos permanecerán seguros en el disco del host de EC2.

---

## 🌐 Despliegue de Demostración en GitHub Pages

Para habilitar la previsualización interactiva de demostración directamente en GitHub:

1. Crea un repositorio en GitHub y sube los archivos de este proyecto.
2. Ve a la pestaña **Settings** (Configuración) de tu repositorio en GitHub.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**, selecciona la rama `main` (o `master`) y la carpeta `/ (root)`, luego haz clic en **Save**.
5. GitHub generará un enlace público (ej. `https://tu-usuario.github.io/tu-repo/`).
6. **Cómo funciona en Pages:** Al ingresar al enlace, se mostrará el formulario de forma completamente operativa. Podrás llenarlo y, al finalizar, los datos se almacenarán en el navegador. También puedes acceder a `/admin.html` (ej. `https://tu-usuario.github.io/tu-repo/admin.html`), ingresar con la contraseña `ikusiadmin123` y ver el comportamiento del panel con gráficos y la opción de exportar CSV de tus datos locales de prueba.
