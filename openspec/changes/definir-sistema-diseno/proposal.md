# Propuesta: Definir sistema de diseño

## Identificador

`definir-sistema-diseno`

## Objetivo

Definir reglas visuales reutilizables antes de producir la interfaz final, manteniendo el sistema visual separado de las reglas monetarias y de persistencia.

La validación manual mostró que la aplicación es funcional, pero algunos estados no se comunican con suficiente claridad: ejemplos visuales parecen datos ya ingresados, la actividad activa tiene poca jerarquía y acciones no permitidas siguen pareciendo disponibles después de conciliar o cerrar. El sistema de diseño se amplía para que cada componente comunique mejor qué se puede hacer, qué estado tiene el sistema y qué resultado produjo una acción.

## Alcance

- colores semánticos;
- tipografía;
- escala de espaciado;
- radios, bordes y sombras;
- botones y campos;
- tarjetas y listas;
- estados `normal`, `hover`, `focus`, `active` y `disabled`;
- estados de actividad, validación, vacío y pago;
- actividad seleccionada con jerarquía visual explícita;
- presentación de actividad cerrada como historial de solo lectura;
- placeholders y textos de ayuda que no parezcan datos ya registrados;
- feedback visible mediante mensajes de éxito, advertencia y error;
- tooltips breves solo para conceptos que necesitan explicación;
- iconografía de apoyo sin depender únicamente del icono para comunicar significado;
- foco visible y accesibilidad básica;
- microinteracciones breves y no obstructivas;
- aplicación coherente al flujo end-to-end.

## Fuera de alcance

- cálculo monetario;
- conversión;
- base de datos;
- catálogo de categorías de gasto;
- lógica de selección entre actividades, que pertenece al cambio `completar-seleccion-actividades`;
- funciones nuevas del producto.
