# CRM-CK Frontend

Dashboard de administración para gestión de stock, ventas y proveedores de un comercio pequeño. Permite registrar entradas y salidas de mercadería, visualizar el estado del stock en tiempo real y tomar decisiones basadas en métricas de ventas.

## Stack

### React + Vite
React es la librería principal para construir la interfaz. Vite reemplaza a Create React App como bundler — arranca más rápido en desarrollo y genera builds más livianos para producción. Toda la lógica de la app está organizada en componentes funcionales con hooks.

### React Router DOM
Maneja la navegación entre vistas sin recargar la página. Implementa rutas privadas — si el usuario no tiene token JWT válido, es redirigido automáticamente al login. Las rutas protegidas están anidadas bajo un layout común que comparte el sidebar y el header.

### Axios
Cliente HTTP para comunicarse con el backend. Configurado con una instancia centralizada que agrega automáticamente el token JWT en cada request y maneja la expiración de sesión redirigiendo al login cuando el backend devuelve un 401.

### Context API
Manejo del estado global de autenticación sin librerías externas. El `AuthContext` provee el token, las funciones de login y logout a toda la app sin prop drilling.

### Ant Design
Librería de componentes UI. Se usó para tablas con paginación y filtros, formularios con validación integrada, modales, selects, tags de estado y el layout principal con sidebar colapsable. Elegida por la calidad de sus componentes operativos — especialmente `Table` y `Form`.

### Recharts
Librería de gráficas construida específicamente para React. Se usó en el dashboard para visualizar ventas por día del mes (línea), productos más y menos vendidos (barras) y distribución de ventas por tipo de pago (torta). Elegida sobre Chart.js por su integración nativa con React y su API declarativa.

### Day.js
Librería liviana para formateo de fechas. Usada en el log de operaciones para mostrar fechas en formato local argentino (DD/MM/YYYY HH:mm).

---

## Requisitos

- Node.js 18+
- Backend CRM-CK corriendo

## Configuración

Crear un archivo `.env` en el root:

```bash
VITE_API_URL=http://localhost:3000
```

## Instalación y desarrollo

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| VITE_API_URL | URL base del backend |

## Vistas

| Ruta | Descripción |
|---|---|
| /login | Inicio de sesión |
| /dashboard | Métricas y gráficas |
| /stock | Stock de productos con CRUD |
| /sales | Registro y listado de ventas |
| /shipments | Entradas de mercadería |
| /log | Log unificado de operaciones |
| /abm/brands | ABM de marcas |
| /abm/categories | ABM de categorías |
| /abm/colors | ABM de colores |
| /abm/genders | ABM de géneros |
| /abm/models | ABM de modelos |
| /abm/suppliers | ABM de proveedores |
| /abm/payment-types | ABM de tipos de pago |

## Credenciales

Registrá un usuario desde el backend:

```bash
POST /auth/register
{
"name": "Nombre",
"email": "email@ejemplo.com",
"password": "contraseña"
}
```