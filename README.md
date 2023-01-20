<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



# Teslo Shop API

1. Clonar el repositiorio
```bash
git clone https://github.com/cmglezpdev/teslo-shop-nestjs.git
```

2. Instalar dependencias
```bash
yarn install
```

3. Clonar el archivo `.env.template` a `.env` y llenar las variables de entorno

4. Levantar la base de datos
```bash
docker-compose up -d
```

5. Ejecutar Seed para llenar la base de datos
```bash
GET http://localhost:3000/api/seed
```

6. Levantar la aplicación en producción
```bash
yarn start:dev
```
