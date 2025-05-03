# Microservicio de Películas (GraphQL + Auth)

## Descripción

Este proyecto consiste en dos microservicios:

1. **Auth Microservice**: Gestiona la autenticación de usuarios y entrega un token JWT.
2. **GraphQL Microservice**: Consume el endpoint de películas (`films-graphql`), realiza cálculos de estadísticas y expone endpoints para obtener la lista de películas y estadísticas.

---

## Requisitos

- **Node.js** v14 o superior
- **npm** (o **yarn**)
- **Postman** (para pruebas manuales)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repositorio-url>
cd <carpeta-del-proyecto>
