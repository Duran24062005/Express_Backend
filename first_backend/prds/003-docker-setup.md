# Product Requirements Document (PRD)

## Configuración de Docker para el Proyecto

---

## 1. Resumen Ejecutivo

### 1.1 Objetivo

Dockerizar la aplicación Express y la base de datos MySQL para facilitar el desarrollo, testing y despliegue en diferentes entornos de manera consistente y reproducible.

### 1.2 Alcance

- Contenedorización de la aplicación Node.js/Express
- Contenedorización de MySQL
- Configuración de Docker Compose para orquestación
- Scripts de inicialización
- Configuración para desarrollo y producción

---

## 2. ¿Qué es Docker?

### 2.1 Introducción

**Docker** es una plataforma de contenedores que permite empaquetar aplicaciones y sus dependencias en contenedores ligeros y portables. Un contenedor es como una "caja" que contiene todo lo necesario para ejecutar una aplicación.

### 2.2 Conceptos Clave

#### Contenedor (Container)
Un entorno aislado que ejecuta una aplicación. Es ligero y se inicia rápidamente.

#### Imagen (Image)
Una plantilla read-only para crear contenedores. Es como una "receta" que define qué contiene el contenedor.

#### Dockerfile
Un archivo de texto que contiene instrucciones para construir una imagen.

#### Docker Compose
Una herramienta para definir y ejecutar aplicaciones multi-contenedor.

### 2.3 Ventajas de Docker

- ✅ **Consistencia**: Mismo entorno en desarrollo, testing y producción
- ✅ **Aislamiento**: Cada aplicación tiene su propio entorno
- ✅ **Portabilidad**: Funciona en cualquier sistema con Docker
- ✅ **Escalabilidad**: Fácil de escalar horizontalmente
- ✅ **Reproducibilidad**: Mismo resultado cada vez

---

## 3. Arquitectura de Contenedores

### 3.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────┐
│         Docker Compose                  │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   App        │    │   MySQL      │  │
│  │  Container   │◄───┤  Container   │  │
│  │  (Node.js)   │    │  (Database)  │  │
│  └──────────────┘    └──────────────┘  │
│         │                   │           │
│         └───────────────────┘           │
│         backend-network                 │
└─────────────────────────────────────────┘
```

### 3.2 Servicios

#### Servicio: `app`
- **Imagen base**: `node:18-alpine`
- **Puerto**: 4000
- **Volúmenes**: Código fuente montado para hot-reload
- **Dependencias**: Espera a que MySQL esté saludable

#### Servicio: `mysql`
- **Imagen**: `mysql:8.0`
- **Puerto**: 3306
- **Volúmenes**: Datos persistentes + script de inicialización
- **Healthcheck**: Verifica que MySQL esté listo

---

## 4. Archivos de Configuración

### 4.1 Dockerfile

**Ubicación**: `Dockerfile`

```dockerfile
FROM node:18-alpine        # Imagen base
WORKDIR /app              # Directorio de trabajo
COPY package*.json ./     # Copiar dependencias
RUN npm install           # Instalar dependencias
COPY . .                  # Copiar código
EXPOSE 4000              # Exponer puerto
CMD ["node", "src/index.js"]  # Comando por defecto
```

**Explicación**:
- `FROM`: Define la imagen base (Node.js 18 en Alpine Linux - versión ligera)
- `WORKDIR`: Establece el directorio de trabajo
- `COPY`: Copia archivos al contenedor
- `RUN`: Ejecuta comandos durante la construcción
- `EXPOSE`: Documenta el puerto que usa la app
- `CMD`: Comando que se ejecuta al iniciar el contenedor

### 4.2 docker-compose.yml

**Ubicación**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASS}
      MYSQL_DATABASE: ${MYSQL_DB}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s

  app:
    build: .
    environment:
      MYSQL_HOST: mysql
      PORT: ${PORT:-4000}
    ports:
      - "${PORT:-4000}:4000"
    depends_on:
      mysql:
        condition: service_healthy
```

**Explicación**:
- `version`: Versión del formato de docker-compose
- `services`: Define los servicios (contenedores)
- `image`: Imagen a usar (o `build` para construir desde Dockerfile)
- `environment`: Variables de entorno
- `ports`: Mapeo de puertos (host:contenedor)
- `volumes`: Datos persistentes
- `depends_on`: Dependencias entre servicios
- `healthcheck`: Verificación de salud del servicio

### 4.3 .dockerignore

**Ubicación**: `.dockerignore`

```
node_modules
.env
.git
*.md
tests
coverage
```

**Propósito**: Excluir archivos innecesarios del contexto de Docker (similar a `.gitignore`)

---

## 5. Comandos Principales

### 5.1 Docker Compose

#### Iniciar Servicios
```bash
docker-compose up
```

#### Iniciar en Segundo Plano
```bash
docker-compose up -d
```

#### Detener Servicios
```bash
docker-compose down
```

#### Ver Logs
```bash
docker-compose logs
docker-compose logs app      # Solo logs de app
docker-compose logs -f       # Seguir logs en tiempo real
```

#### Reconstruir Imágenes
```bash
docker-compose build
docker-compose up --build    # Construir y levantar
```

#### Ejecutar Comandos en Contenedor
```bash
docker-compose exec app npm test
docker-compose exec mysql mysql -u root -p
```

### 5.2 Docker (Comandos Individuales)

#### Construir Imagen
```bash
docker build -t first_backend .
```

#### Ejecutar Contenedor
```bash
docker run -p 4000:4000 first_backend
```

#### Ver Contenedores Activos
```bash
docker ps
docker ps -a  # Incluye detenidos
```

#### Ver Imágenes
```bash
docker images
```

#### Eliminar Contenedor
```bash
docker rm <container_id>
```

#### Eliminar Imagen
```bash
docker rmi <image_id>
```

#### Limpiar Todo
```bash
docker system prune -a  # ⚠️ Cuidado: elimina todo
```

---

## 6. Desarrollo vs Producción

### 6.1 Desarrollo

**Características**:
- Hot-reload habilitado (volúmenes montados)
- Logs detallados
- Base de datos con datos de prueba
- Variables de entorno desde `.env`

**Comando**:
```bash
docker-compose -f docker-compose.dev.yml up
```

### 6.2 Producción

**Características**:
- Código copiado (sin volúmenes)
- Optimizaciones de build
- Variables de entorno desde sistema
- Base de datos persistente

**Comando**:
```bash
docker-compose up -d
```

---

## 7. Variables de Entorno

### 7.1 Archivo .env

```env
PORT=4000
MYSQL_HOST=mysql
MYSQL_USER=root
MYSQL_PASS=rootpassword
MYSQL_DB=first_backend_express
JWT_SECRET=tu-clave-secreta-super-segura
```

### 7.2 Uso en Docker Compose

Docker Compose lee automáticamente el archivo `.env` y puede usar variables con `${VARIABLE}` o `${VARIABLE:-default}`.

---

## 8. Volúmenes y Persistencia

### 8.1 Tipos de Volúmenes

#### Named Volumes (Volúmenes Nombrados)
```yaml
volumes:
  mysql_data:
```
- Persisten entre reinicios
- Gestionados por Docker
- Ubicación: `/var/lib/docker/volumes/`

#### Bind Mounts (Montajes de Enlace)
```yaml
volumes:
  - ./database.sql:/docker-entrypoint-initdb.d/init.sql
```
- Mapean directorios del host al contenedor
- Útiles para desarrollo (hot-reload)

### 8.2 Volúmenes en Este Proyecto

- `mysql_data`: Datos persistentes de MySQL
- `.:/app`: Código fuente (desarrollo)
- `/app/node_modules`: Excluir node_modules del host

---

## 9. Networking

### 9.1 Red por Defecto

Docker Compose crea automáticamente una red para los servicios. Los servicios pueden comunicarse usando el nombre del servicio como hostname.

**Ejemplo**:
```javascript
// En la app, conectar a MySQL
const host = 'mysql';  // Nombre del servicio
```

### 9.2 Red Personalizada

```yaml
networks:
  backend-network:
    driver: bridge
```

---

## 10. Healthchecks

### 10.1 ¿Qué es un Healthcheck?

Un healthcheck verifica que un servicio esté funcionando correctamente. Docker puede esperar a que un servicio esté "saludable" antes de iniciar dependencias.

### 10.2 Ejemplo

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 10s      # Verificar cada 10 segundos
  timeout: 5s        # Timeout de 5 segundos
  retries: 5         # Reintentar 5 veces
```

### 10.3 Uso con depends_on

```yaml
depends_on:
  mysql:
    condition: service_healthy  # Esperar hasta que esté saludable
```

---

## 11. Scripts de Inicialización

### 11.1 wait-for-mysql.sh

**Propósito**: Esperar a que MySQL esté listo antes de iniciar la app.

```bash
#!/bin/sh
until mysqladmin ping -h "$host" --silent; do
  sleep 1
done
exec $cmd
```

### 11.2 init-db.sh

**Propósito**: Inicializar la base de datos con el schema.

```bash
mysql -h mysql -u root -p"$MYSQL_PASS" < /docker-entrypoint-initdb.d/init.sql
```

---

## 12. Flujo de Trabajo

### 12.1 Primera Vez

```bash
# 1. Clonar repositorio
git clone <repo>
cd first_backend

# 2. Crear archivo .env
cp .env.example .env
# Editar .env con tus valores

# 3. Iniciar servicios
docker-compose up --build
```

### 12.2 Desarrollo Diario

```bash
# Iniciar servicios
docker-compose up

# Ver logs
docker-compose logs -f app

# Ejecutar tests
docker-compose exec app npm test

# Acceder a MySQL
docker-compose exec mysql mysql -u root -p

# Detener servicios
docker-compose down
```

### 12.3 Actualizar Código

```bash
# El código se actualiza automáticamente con volúmenes montados
# Solo necesitas reiniciar si cambias dependencias
docker-compose restart app
```

---

## 13. Troubleshooting

### 13.1 Puerto Ya en Uso

**Error**: `port is already allocated`

**Solución**:
```bash
# Cambiar puerto en docker-compose.yml o .env
# O detener el proceso que usa el puerto
lsof -i :4000
kill -9 <PID>
```

### 13.2 Contenedor No Inicia

**Verificar logs**:
```bash
docker-compose logs app
docker-compose logs mysql
```

### 13.3 Base de Datos No Conecta

**Verificar**:
1. MySQL está saludable: `docker-compose ps`
2. Variables de entorno correctas
3. Nombre del host: usar `mysql` (nombre del servicio)

### 13.4 Limpiar Todo y Empezar de Nuevo

```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar volúmenes
docker volume prune

# Reconstruir
docker-compose up --build
```

### 13.5 Permisos en Scripts

```bash
# Hacer scripts ejecutables
chmod +x scripts/*.sh
```

---

## 14. Mejores Prácticas

### 14.1 Imágenes Ligeras

- Usar imágenes Alpine (más pequeñas)
- Limpiar cache en Dockerfile
- Usar `.dockerignore`

### 14.2 Seguridad

- No hardcodear passwords
- Usar variables de entorno
- No exponer puertos innecesarios
- Usar secrets en producción

### 14.3 Performance

- Usar volúmenes nombrados para datos
- Cache de layers en Dockerfile
- Multi-stage builds para producción

### 14.4 Organización

- Un Dockerfile por servicio
- docker-compose.yml para desarrollo
- docker-compose.prod.yml para producción

---

## 15. Comandos Útiles

### 15.1 Inspeccionar

```bash
# Ver configuración de un servicio
docker-compose config

# Ver procesos en contenedor
docker-compose top

# Inspeccionar contenedor
docker inspect <container_id>
```

### 15.2 Limpieza

```bash
# Eliminar contenedores detenidos
docker-compose rm

# Eliminar imágenes no usadas
docker image prune

# Limpieza completa
docker system prune -a
```

### 15.3 Debugging

```bash
# Entrar al contenedor
docker-compose exec app sh

# Ver variables de entorno
docker-compose exec app env

# Verificar conectividad
docker-compose exec app ping mysql
```

---

## 16. Integración con el Proyecto

### 16.1 Estructura de Archivos

```
first_backend/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── .dockerignore
├── .env
├── scripts/
│   ├── wait-for-mysql.sh
│   └── init-db.sh
└── database.sql
```

### 16.2 Scripts NPM (Opcional)

```json
{
  "scripts": {
    "docker:up": "docker-compose up",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build",
    "docker:logs": "docker-compose logs -f"
  }
}
```

---

## 17. Recursos Adicionales

### 17.1 Documentación Oficial

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

### 17.2 Tutoriales

- [Docker Tutorial for Beginners](https://www.youtube.com/watch?v=fqMOX6JJhGo)
- [Docker Compose Tutorial](https://www.youtube.com/watch?v=HG6yIjZapSA)

---

## 18. Conclusión

Con esta configuración de Docker, el proyecto tiene:

- ✅ Entorno de desarrollo consistente
- ✅ Base de datos aislada y reproducible
- ✅ Fácil despliegue en diferentes entornos
- ✅ Hot-reload para desarrollo
- ✅ Persistencia de datos
- ✅ Healthchecks para dependencias

**Próximos pasos**: Configurar CI/CD con Docker y optimizar imágenes para producción.

---

**Versión**: 1.0.0  
**Fecha**: Enero 2026
