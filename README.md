# Grupo 9 NED's

Este es el repositorio del grupo 9 NED's, cuyos integrantes son:

* Integrante 1: Joel Dominguez N. - 201973500-4
* Integrante 2: Pablo Estobar F. -  201973615-9
* Integrante 3: Sebastian Naranjo H. - 201973614-0
* **Tutor**: Christian Riquelme

# Videos

- [Presentación del contexto del negocio](https://youtu.be/NC5jpBDBrCM)
- [Presentación de la propuesta](https://youtu.be/saKhDmEK148)

## Trabajando con docker

Para trabajar con docker debes tener instalado docker y docker-compose en tu computador, para ello puedes seguir las instrucciones de la página oficial de docker.

Una vez instalado docker y docker-compose debes ejecutar el siguiente comando en la raíz del proyecto:

```bash
docker-compose up
```

## Git y sus ramas

Les recomendamos trabajar con ramas de la siguiente forma

* main: rama principal, solo se debe hacer merge de ramas de dev, nunca hacer commits directamente en esta rama.
* dev: rama de desarrollo, se debe hacer merge de las ramas de feature, nunca hacer commits directamente en esta rama. Cuando tengan una versión estable de su proyecto y lista para presentar en sus entregables, deben hacer un merge de dev a main.
* feature: Por cada feature que se vaya a implementar se debe crear una rama de feature, una vez que se termine la feature se debe hacer merge a la rama de dev.  

De esta forma, cuando revisemos sus tareas, unicamente revisaremos el merge mas reciente a la rama main.  

## Datos db 
```py
host="postgres",
database="isw",
user="user",
password="pass"

```
