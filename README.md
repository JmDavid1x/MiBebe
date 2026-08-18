# 🌹 Para Cachetes

Una rosa hecha con código, para Carolina.

No hay imágenes ni librerías: la flor, los pétalos que caen y el jardín están
dibujados en `<canvas>` con puro JavaScript. Todo funciona abriendo el archivo,
sin instalar nada.

## Cómo verlo

Abre `index.html` en cualquier navegador. Ya está.

Si lo quieres publicar en internet (gratis) para mandarle el link:

1. Entra a **Settings → Pages** en este repositorio.
2. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda y espera un minuto. Queda en:
   `https://jmdavid1x.github.io/MiBebe/`

## Cómo cambiar los textos

Todo lo que se lee está en **`contenido.js`**. Abre ese archivo, cambia lo que
quieras entre las comillas y guarda. No necesitas tocar nada más.

```js
hero: {
  saludo: "Para ti,",
  titulo: "Cachetes",     // <- aquí el apodo
  ...
}
```

Puedes agregar o quitar tarjetas y mensajes del jardín: solo agrega o borra
líneas dentro de las listas.

## Qué hay en cada sección

| Sección | Qué pasa |
|---|---|
| **Inicio** | Crece el tallo, salen las hojas y la rosa se abre pétalo por pétalo. Después queda respirando. |
| **La carta** | La frase se escribe sola cuando llegas, y abajo van los párrafos. |
| **Razones** | Seis tarjetas: al tocarlas se voltean y muestran el mensaje. |
| **Jardín** | Toca cualquier parte del recuadro y nace una rosa con un mensaje. |
| **Final** | Un corazón latiendo y un botón que suelta pétalos y corazones. |

## Archivos

```
index.html          estructura de la página
contenido.js        TODOS los textos (edita aquí)
style.css           estilos
rosa.js             la rosa que florece
petalos.js          la lluvia de pétalos del fondo
jardin.js           el jardín interactivo
app.js              arma la página y las animaciones de scroll
para-cachetes.html  todo en un solo archivo, por si lo quieres mandar suelto
```

Hecho con cariño. 🌹
