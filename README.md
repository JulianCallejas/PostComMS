<h1 align="center" > PostComMS - Red Social </h1>

<p align="center">
    <a href="https://github.com/JulianCallejas/PostComMS" target="_blank" rel="noreferrer">
      <img src="https://res.cloudinary.com/dphleqb5t/image/upload/v1742581735/PostComMS/logo250_eab8n4.webp" width="200" alt="Age of Dragons Logo" />
    </a>
</p>


<h2 align="center">Por Julian Callejas { jc - develop }</h2>

PostComMS es una red social para publicaciones de texto donde los usuarios pueden registrarse, iniciar sesión, ver su perfil y visualizar publicaciones de otros usuarios con conteo de "likes".

## Descripción

Esta aplicación web permite a los usuarios crear una cuenta, publicar mensajes cortos, ver publicaciones de otros usuarios y dar "like" a las publicaciones. También incluye funcionalidades para editar el perfil del usuario.

## Tecnologías Utilizadas

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Zustand (manejo de estado)
  - Tailwind CSS (estilos)
  - shadcn/ui (componentes)
  - Zod (validaciones)
  - Axios (peticiones HTTP)

- **Backend**:
  - Express.js
  - TypeScript
  - Prisma (ORM)
  - JSON Web Token (autenticación)
  - PostgreSQL (base de datos)
  - Proxy (servidor proxy)
  - Docker (despliegue y ejecución)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 18 o superior)
- npm o yarn
- Docker y Docker Compose (opcional, para ejecución con contenedores)
- Puertos 3000 - 3005 disponibles

## Instalación

### Levantar con docker

Sigue estos pasos para instalar y configurar el proyecto localmente, recuerda tener docker y docker-compose instalados y en ejecución:

1. Clona el repositorio:

```bash
git clone https://github.com/JulianCallejas/PostComMS.git

```

2. Instala las dependencias del backend:

```bash
cd backend
npm install
# o
yarn install
```

3. Instala las dependencias del frontend:
```bash
cd ../frontend
npm install
# o
yarn install
```

4. Levanta los servicios de backend y frontend:
```bash
cd ..
docker-compose -f docker-compose-project.yml up -d
```

5. En el contenedor de backend users ejecuta la migración de la base de datos:
```bash
docker exec -it postcomms-user-service-1 npx prisma migrate deploy
```

6. En el contenedor de backend users ejecuta el seed de la base de datos:
```bash
docker exec -it postcomms-user-service-1 node prisma/seed.js
```

7. La API de backend estará disponible en [http://localhost:3000/api](http://localhost:3000/api) y la aplicación web estará disponible en [http://localhost:3005](http://localhost:3005).

## Configuración

La aplicación está configurada para conectarse a una API backend en `http://localhost:3000/api`. Si necesitas cambiar esta URL.
Los contenedores del backend (Base de datos y micro servicios) estan configurados en una red privada dentro de docker, pero el servicio de la API y el Frontend estan en una red pública.

```

## Estructura del Proyecto

```plaintext
backend/
├── prisma/                 # Configuración de la base de datos
│   ├── migrations/         # Migraciones de la base de datos
├── src/                    # Código del backend
│   ├── config/             # Configuración del backend
│   ├── lib/                # Librerías y utilidades
│   ├── middleware/         # Middleware para la autenticación
│   ├── services/           # Servicios de la API
│   │   ├── auth/           # Servicios de autenticación
│   │   ├── users/          # Servicios de usuarios
│   │   └── posts/          # Servicios de publicaciones
│   └── index.ts            # Archivo principal del backend
└──────
docker/                     # Scripts de Docker para construir y ejecutar la aplicación
├── auth-service.Dockerfile
├── frontend.Dockerfile
├── gateway.Dockerfile
├── post-service.Dockerfile
├── user-service.Dockerfile
└──────
front/
├── public/                 # Archivos estáticos
├── src/                    # Código del frontend
│   ├── actions/            # Server actions (ejecución de acciones del servidor)
│   ├── app/                # Rutas y páginas
│   │   ├── (protected)/    # Rutas protegidas que requieren autenticación
│   │   │   ├── posts/      # Página de publicaciones
│   │   │   └── profile/    # Página de perfil
│   │   ├── login/          # Página de inicio de sesión
│   │   └── register/       # Página de registro
│   ├── components/         # Componentes reutilizables
│   │   ├── auth/           # Componentes relacionados con autenticación
│   │   ├── posts/          # Componentes para publicaciones
│   │   ├── profile/        # Componentes para el perfil
│   │   ├── ui/             # Componentes de UI (shadcn)
│   │   └── ...
│   ├── interfaces/         # Interfaces y types para la aplicación
│   ├── lib/                # Utilidades y lógica de negocio
│   ├── schemas/            # Esquemas de validación con Zod
│   ├── services/           # Servicios para comunicación con la API
│   ├── stores/             # Stores de Zustand para manejo de estado
└──────
```

## Funcionalidades Principales

### Autenticación

- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Protección de rutas
- Microservicio de autenticación


### Perfil de Usuario

- Visualización de información del perfil
- Edición de nombre y biografía
- Microservicio de usuarios


### Publicaciones

- Creación de publicaciones
- Visualización de todas las publicaciones
- Visualización de publicaciones propias
- Dar "like" a publicaciones
- Microservicio de publicaciones


## API Backend

La aplicación se comunica con una API backend que proporciona los siguientes endpoints:

### Autenticación

- `POST /api/auth/register`: Registro de usuarios
- `POST /api/auth/login`: Inicio de sesión
- `POST /api/auth/refresh`: Actualización del token


### Usuarios

- `GET /api/users/profile`: Obtener perfil del usuario
- `PUT /api/users/profile`: Actualizar perfil del usuario


### Publicaciones

- `GET /api/posts`: Obtener todas las publicaciones
- `GET /api/posts/my-posts`: Obtener publicaciones del usuario
- `POST /api/posts`: Crear una publicación
- `PUT /api/posts/:id`: Actualizar una publicación
- `POST /api/posts/:id/like`: Dar "like" a una publicación


## Seguridad

La aplicación utiliza tokens JWT para la autenticación. El token se almacena en localStorage y se envía en las cabeceras de las peticiones HTTP.

## Contribución

Si deseas contribuir a este proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

<p align="center">
<a href="https://github.com/JulianCallejas">
  <img src="https://res.cloudinary.com/dphleqb5t/image/upload/v1740784502/github-jc-develop/JC-LOGO-Horizontal-170-50-thin-github_uu3b5n.svg" width="170" alt="{ jc - develop }"  /> 
</a>
</p>

