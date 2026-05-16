# 📋 Registro de Visita a Obra — Eurocontrol PWA

## 🚀 Cómo instalar en GitHub Pages (paso a paso)

### 1. Crear cuenta en GitHub
- Ve a **https://github.com** y crea una cuenta gratuita si no tienes
- Confirma el email

### 2. Crear repositorio
- Haz clic en el botón verde **"New"** (o **"+"** arriba a la derecha → New repository)
- Nombre del repositorio: `rvo-eurocontrol` (o el que quieras)
- Marca **"Public"** (necesario para GitHub Pages gratuito)
- Haz clic en **"Create repository"**

### 3. Subir los archivos
- En el repositorio recién creado, haz clic en **"uploading an existing file"**
- Arrastra o selecciona **todos estos archivos/carpetas**:
  - `index.html`
  - `manifest.json`  
  - `sw.js`
  - `municipios.js`
  - carpeta `icons/` (con los dos PNG dentro)
- Haz clic en **"Commit changes"**

### 4. Activar GitHub Pages
- Ve a **Settings** (pestaña del repositorio)
- En el menú izquierdo: **Pages**
- En "Source": selecciona **Deploy from a branch**
- Branch: **main**, carpeta: **/ (root)**
- Haz clic en **Save**
- Espera 1-2 minutos

### 5. Tu URL
GitHub te dará una URL del tipo:
```
https://TU_USUARIO.github.io/rvo-eurocontrol/
```

### 6. Instalar como app en Android
- Abre Chrome en tu Android
- Ve a esa URL
- Chrome mostrará un banner "Añadir a pantalla de inicio"
- O ve al menú (⋮) → "Instalar app" / "Añadir a pantalla de inicio"
- ¡Listo! Aparecerá como app nativa con icono azul EC

---

## ✅ Características
- 📡 **GPS offline** — resolución automática de municipio y provincia sin internet
- 💾 **100% offline** — funciona sin conexión una vez instalada
- 📄 **Exportar PDF y JPG**
- ↗️ **Compartir** — menú nativo de Android/iOS
- 🔒 **HTTPS** — geolocalización habilitada
- 💬 **Sin Play Store** — instalación directa desde el navegador
