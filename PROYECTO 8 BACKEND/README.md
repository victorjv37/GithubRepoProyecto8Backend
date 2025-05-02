# API REST de Guitarras Españolas
Dependencias
   ```bash
   npm install
   ```
Archivo `.env` variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://tuusuario:tupassword@tucluster.mongodb.net/guitarsDB?retryWrites=true&w=majority
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

## Ejecución

```bash
#Modo desarrollo
npm run dev

#Modo producción
npm start

#Ejecutar semilla 
npm run seed
```
## Modelos
### Guitarra (Guitar)
- **name**: Nombre de la guitarra
- **price**: Precio
- **image**: Imagen de la guitarra (Cloudinary)
- **manufacturer**: Referencia al fabricante
### Fabricante (Manufacturer)
- **name**: Nombre del fabricante
- **location**: Ubicación
- **logo**: Logo del fabricante (Cloudinary)

## Endpoints
### Guitarras
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/guitars | Obtener todas las guitarras |
| GET | /api/v1/guitars/:id | Obtener una guitarra por ID |
| POST | /api/v1/guitars | Crear una nueva guitarra |
| PUT | /api/v1/guitars/:id | Actualizar una guitarra |
| DELETE | /api/v1/guitars/:id | Eliminar una guitarra |

### Fabricantes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/v1/manufacturers | Obtener todos los fabricantes |
| GET | /api/v1/manufacturers/:id | Obtener un fabricante por ID |
| GET | /api/v1/manufacturers/:id/guitars | Obtener guitarras de un fabricante |
| POST | /api/v1/manufacturers | Crear un nuevo fabricante |
| PUT | /api/v1/manufacturers/:id | Actualizar un fabricante |
| DELETE | /api/v1/manufacturers/:id | Eliminar un fabricante |
