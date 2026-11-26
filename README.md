# Si la UTB tuviera 100 estudiantes: Hábitos de Sueño, Fatiga Académica y Rendimiento

Proyecto de investigación y divulgación de **Introducción a la Ciencia de Datos**  
**Universidad Tecnológica de Bolívar (UTB)** — Cartagena de Indias, Colombia (2024–2026)

**Autores:** Nerlis Otero, Elian Perea, Maria Barrientos, Luz Martinez   
**Programa:** Ciencia de Datos — Facultad de Ingeniería / Escuela de Transformación Digital  

---

## 1. Descripción del Proyecto

¿Cómo duermen y descansan los estudiantes universitarios, y qué factores determinan su fatiga en las aulas?

Bajo la metáfora de **"Si el mundo tuviera 100 personas"**, este proyecto escala la comunidad estudiantil de la Universidad Tecnológica de Bolívar a una muestra representativa de **100 estudiantes**, transformando datos estadísticos complejos en una narrativa visual, accesible e interactiva.

El proyecto cuenta con:
1. **Pipeline de Análisis en Python**: Limpieza, análisis exploratorio, bivariado y correlaciones ordinales de Spearman.
2. **Dashboard Web Interactivo**: Aplicación web moderna (HTML5/CSS3/JavaScript) con matriz Waffle interactiva, gráficos dinámicos, simulador de perfil y galería.
3. **Póster Científico**: Formato A1 vertical en LaTeX (`beamerposter`) listo para impresión y sustentación en feria de ciencias.

---

## 2. Objetivos

- **Objetivo General:** Caracterizar los hábitos de sueño, descanso y fatiga de 100 estudiantes de la UTB mediante técnicas de ciencia de datos, evaluando su asociación con factores conductuales y el rendimiento académico.
- **Objetivos Específicos:**
  - Identificar la prevalencia de déficit de sueño (<5 horas) y calidad subjetiva del descanso.
  - Determinar los principales detonantes del insomnio (uso de celular en cama, carga académica, trasnocho, transporte).
  - Medir la relación estadística entre horas de sueño y promedio ponderado acumulado mediante coeficientes de correlación no paramétricos.
  - Desarrollar una herramienta interactiva para que los estudiantes diagnostiquen sus hábitos frente a la media institucional.

---

## 3. Hallazgos Principales (Métricas Clave)

-  **26 de cada 100** estudiantes duermen **menos de 5 horas** por noche (déficit biológico severo).
-  **69 de cada 100** califican la calidad de su descanso como **regular o muy mala**. Solo 8% la considera muy buena.
-  **47 de cada 100** usan el teléfono celular **más de 1 hora en la cama** antes de dormir, consolidándose como el hábito conductual más dañino para conciliar el sueño.
-  **58 de cada 100** manifiestan sentirse cansados en clase **muchas veces o siempre**.
-  **La Paradoja Académica ($\rho = 0.05$):** La correlación de Spearman entre horas de sueño y promedio académico es prácticamente nula. Los estudiantes compensan el déficit de descanso a costa de su salud para mantener las notas.

---

##  4. Estructura del Repositorio

```text
├── Si la UTB tuviera 100 estudiantes(Sheet1).csv  # Dataset fuente depurado (100 registros)
├── analisis .ipynb                               # Jupyter Notebook con el análisis exploratorio
├── index.html                                    # Aplicación web interactiva principal
├── styles.css                                    # Estilos modernos con paleta institucional
├── app.js                                        # Lógica interactiva, filtros, simulador y charts
├── data.js                                       # Microdatos anonimizados y matrices relacionales
├── poster.tex                                    # Código fuente LaTeX para el póster A1 (Overleaf)
├── logo_utb_horizontal.png                       # Logo oficial UTB horizontal
├── logo_utb_vertical.png                         # Logo oficial UTB vertical
├── figuras/                                      # Directorio con las 24 visualizaciones científicas
│   ├── waffle_sueno_cansancio.png
│   ├── factor_principal.png
│   ├── correlaciones_spearman.png
│   ├── cruce_celular_calidad.png
│   └── ...
└── README.md                                     # Documentación reproducible del proyecto
```

---

##  5. Diccionario de Datos

| Variable | Tipo | Valores / Categorías | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | Entero | 1 al 100 | Identificador único anonimizado |
| `edad` | Categórica | Rango de edad | Grupo etario del estudiante |
| `genero` | Categórica | Femenino, Masculino, Otro | Género reportado |
| `programa` | Texto | Programas UTB | Carrera académica cursada |
| `horas` | Ordinal | Menos de 5 h, 5 a 7 h, 7 a 9 h, Más de 9 h | Horas habituales de sueño por noche |
| `calidad` | Ordinal | Muy mala (1), Regular (2), Buena (3), Muy buena (4) | Calidad subjetiva percibida del descanso |
| `cansancio` | Ordinal | Nunca, Algunas veces, Muchas veces, Siempre | Frecuencia de fatiga y somnolencia en aula |
| `impacto` | Texto | Concentración, Ánimo, Notas, etc. | Área más afectada por el cansancio |
| `factor` | Texto | Trabajos, Exámenes, Celular, Problemas, etc. | Principal detonante de pérdida de sueño |
| `trasnocho` | Ordinal | Nunca (1) a Siempre (5) | Frecuencia de estudio en horario nocturno |
| `hora_acostarse` | Categórica | 9 p.m., 9-11 p.m., 11 p.m.-1 a.m., 1-3 a.m., 3-5 a.m. | Horario habitual de ir a la cama |
| `celular` | Ordinal | 15 min, 30 min, 1 h, Más de 1 h | Tiempo de pantalla en cama antes de dormir |
| `transporte` | Categórica | <30 min, 30 min - 1 h, 1 a 2 h, >2 h | Tiempo diario de desplazamiento a la sede |
| `promedio` | Ordinal | 3.0 a 3.5, 3.6 a 4.0, 4.1 a 4.5, Más de 4.5 | Rango de promedio ponderado semestral |
| `faltas` | Ordinal | Nunca, Algunas veces, Muchas veces, Siempre | Ausencias o llegadas tarde por falta de sueño |
| `cafeina` | Ordinal | Nunca, Algunas veces/sem, Casi diario, Diario | Consumo de café o bebidas estimulantes |

---

##  6. Metodología de Ciencia de Datos

1. **Recolección y Muestreo:** Aplicación de formulario estructurado anónimo aplicado a estudiantes activos de la Universidad Tecnológica de Bolívar en 2024.
2. **Tratamiento y Limpieza:**
   - Normalización de rangos horarios y tipologías de texto.
   - 100% de registros depurados, sin redundancias ni valores corruptos.
   - Codificación numérica ordinal para cálculo de correlaciones no paramétricas.
3. **Análisis Estadístico:**
   - **Distribuciones de Frecuencia Proporcional (Waffle):** Normalización intuitiva a escala $n=100$.
   - **Tablas de Contingencia Bivariadas:** Cruce de variables de comportamiento nocturno vs. rendimiento y fatiga.
   - **Correlación de Spearman ($\rho$):** Análisis de monotonía para variables ordinales sin presuponer normalidad lineal.
4. **Desarrollo del Ecosistema Web:**
   - Implementado en vanilla JavaScript sin dependencias pesadas para asegurar alta velocidad en dispositivos móviles y portátiles.
   - Modos especiales para stands: **Modo Pantalla Completa (Feria)**, filtros dinámicos, simulador interactivo y visor lightbox.

---

##  7. Instrucciones de Reproducción y Despliegue

### A. Ejecutar el Notebook de Análisis Localmente
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/utb-100-estudiantes.git
   cd utb-100-estudiantes
   ```
2. Instala las dependencias necesarias:
   ```bash
   pip install pandas numpy matplotlib
   ```
3. Inicia Jupyter Lab o Notebook:
   ```bash
   jupyter notebook "analisis .ipynb"
   ```

### B. Probar el Dashboard Web Localmente
Al no requerir compilación ni backend, puedes abrir directamente el archivo `index.html` en tu navegador, o levantarlo con un servidor local:
```bash
# Con Python 3
python -m http.server 8000

# O con extensiones como Live Server en VS Code
```
Luego abre tu navegador en `http://localhost:8000`.

### C. Desplegar en la Web (Gratis en Netlify)
1. Inicia sesión en [Netlify](https://app.netlify.com/).
2. Arrastra la carpeta completa del proyecto hacia el recuadro **"Deploy manually" / Drag & Drop**.
3. En pocos segundos obtendrás un enlace público para compartir en la feria mediante el código QR.

### D. Compilar el Póster en Overleaf
1. Crea un proyecto en blanco en [Overleaf](https://www.overleaf.com/).
2. Copia y pega el código de `poster.tex` en `main.tex`.
3. Sube las imágenes de la carpeta `figuras/`, los logos institucionales y tus códigos QR (`qr_dashboard.png` y `qr_github.png`).
4. Selecciona el compilador **pdfLaTeX** y descarga el archivo PDF listo en alta resolución para impresión en formato A1 (60cm x 90cm).

---

##  8. Ética, Privacidad y Habeas Data

- **Cumplimiento Legal:** El estudio se enmarca bajo la **Ley 1581 de 2012** (Régimen General de Protección de Datos Personales en Colombia).
- **Consentimiento y Anonimato:** La participación fue voluntaria, informada y anónima. No se recopilaron ni almacenan datos biométricos, correos personales, nombres ni identificaciones institucionales.
- **Uso Exclusivamente Académico:** Los resultados se presentan agregados a nivel poblacional sin trazabilidad hacia individuos particulares.

---

##  9. Limitaciones y Trabajo Futuro

- **Limitaciones:**
  - Muestra transversal de conveniencia ($n=100$), representativa a nivel exploratorio pero no extrapolable como censo total institucional.
  - Las variables corresponden a autoreporte (sujetas a sesgo de recuerdo y deseabilidad social).
  - Las correlaciones detectadas no constituyen inferencia causal médica directa.
- **Trabajo Futuro:**
  - Ampliación del estudio a cohortes longitudinales de seguimiento semestral.
  - Integración de métricas objetivas mediante pulseras o sensores pasivos (*wearables*).
  - Desarrollo de modelos supervisados de Machine Learning para predecir riesgo de agotamiento académico (*burnout*) o deserción temprana asociada al descanso deficiente.

---

##  Licencia

Este proyecto está bajo la Licencia [MIT](https://opensource.org/licenses/MIT). El código y los datos anonimizados son de libre uso para fines académicos, educativos y de investigación con la correspondiente atribución.
