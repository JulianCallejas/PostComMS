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

Los usuarios generados son:
- jc@example.com   ->Password: password123
- sc@example.com   ->Password: password123

7. La API de backend estará disponible en [http://localhost:3000/api](http://localhost:3000/api) y la aplicación web estará disponible en [http://localhost:3005](http://localhost:3005).

## Configuración

La aplicación está configurada para conectarse a una API backend en `http://localhost:3000/api`. Si necesitas cambiar esta URL.
Los contenedores del backend (Base de datos y micro servicios) estan configurados en una red privada dentro de docker, pero el servicio de la API y el Frontend estan en una red pública.

```

## Estructura del Proyecto

```Plaintext
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
│   ├── swagger/            # Swagger Documentación
│   │   ├── auth/           # Swagger para el microservicio de autenticación
│   │   ├── gateway/        # Swagger para el API Gateway, todos los microservicios 
│   │   ├── users/          # Swagger para el microservicio de usuarios
│   │   └── posts/          # Swagger para el microservicio de publicaciones
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

La aplicación se comunica con una API REST documentada con Swagger.

## Documentación del Backend con Swagger

### Gateway (API Gateway)

El **API Gateway** es el punto central para acceder a todos los microservicios. En él se gestionan las peticiones de los usuarios y se enrutan a los microservicios correspondientes. Los endpoints de este servicio se documentan a continuación.

#### Endpoints del Gateway:

##### Endpoints de Autenticación:
- `POST /api/auth/register`: Registra un nuevo usuario.
- `POST /api/auth/login`: Inicia sesión con un usuario.
- `POST /api/auth/refresh`: Actualiza el token de acceso.

##### Endpoints de Usuarios:
- `GET /api/users/profile`: Obtiene el perfil del usuario.
- `PUT /api/users/profile`: Actualiza el perfil del usuario.

##### Endpoints de Publicaciones:
- `GET /api/posts`: Obtiene todas las publicaciones.
- `GET /api/posts/my-posts`: Obtiene las publicaciones propias del usuario.
- `POST /api/posts`: Crea una nueva publicación.
- `PUT /api/posts/:id`: Actualiza una publicación.
- `POST /api/posts/:id/like`: Da "like" a una publicación.

#### Para acceder a la documentación Swagger del Gateway:

1. Asegúrate de que el servidor de **API Gateway** esté corriendo.
2. Abre tu navegador y ve a [http://localhost:3000/api-docs](http://localhost:3000/api-docs) para ver la documentación de Swagger que incluye todos los endpoints del Gateway.

## Microservicios

Cada microservicio tiene su propia documentación Swagger, la cual incluye los endpoints disponibles para interactuar con ellos.

#### Microservicio de Autenticación:

- `POST /api/auth/register`: Registra un nuevo usuario.
- `POST /api/auth/login`: Inicia sesión de usuario.
- `POST /api/auth/refresh`: Refresca el token.

Para acceder a la documentación Swagger del Microservicio de Autenticación, visita [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

#### Microservicio de Usuarios:

- `GET /api/users/profile`: Obtiene el perfil del usuario.
- `PUT /api/users/profile`: Actualiza el perfil del usuario.

Para acceder a la documentación Swagger del Microservicio de Usuarios, visita [http://localhost:3002/api-docs](http://localhost:3002/api-docs).

#### Microservicio de Publicaciones:

- `GET /api/posts`: Obtiene todas las publicaciones.
- `GET /api/posts/my-posts`: Obtiene las publicaciones propias del usuario.
- `POST /api/posts`: Crea una nueva publicación.
- `PUT /api/posts/:id`: Actualiza una publicación.
- `POST /api/posts/:id/like`: Da "like" a una publicación.

Para acceder a la documentación Swagger del Microservicio de Publicaciones, visita [http://localhost:3003/api-docs](http://localhost:3003/api-docs).


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

