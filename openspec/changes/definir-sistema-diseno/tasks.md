# Tareas delta: definir-sistema-diseno

Estas tareas son independientes de las 16 tareas históricas.

- [x] D1. Formalizar tokens CSS, sombras, transiciones y estructura responsive.
- [x] D2. Implementar controles y tarjetas reutilizables mediante clases CSS.
- [x] D3. Implementar estados `hover`, `focus-visible`, `active`, `disabled`, éxito, advertencia y error.
- [x] D4. Hacer visible el contexto de la actividad seleccionada sin confundirlo con el formulario para crear otra actividad.
- [x] D5. Presentar la actividad cerrada como historial de solo lectura y evitar acciones visualmente disponibles cuando el dominio las prohíbe.
- [x] D6. Diferenciar placeholders de valores reales y añadir textos de ayuda donde exista ambigüedad.
- [x] D7. Mejorar feedback no modal y tooltips contextuales manteniendo accesibilidad.
- [x] D8. Aplicar iconografía de apoyo y microinteracciones breves sin añadir funcionalidades nuevas.
- [ ] D9. Verificar navegación por teclado, foco visible y ausencia de información dependiente solo del color.
- [x] D10. Verificar legibilidad y funcionamiento en ancho móvil y escritorio, incluyendo `prefers-reduced-motion`.


## Evidencia del incremento 4

- Verificación manual del incremento 4: actividad `Abierta` con orientación textual, `hover`, foco visible, ayudas `i`/tooltip, jerarquía visual y comportamiento estable al reducir el ancho del navegador.
- D1 y D2 comprobados por inspección del CSS/HTML: tokens, sombras, transiciones, responsive y clases reutilizables.
- D3 verificado mediante inspección de estados `hover`, `focus-visible`, `active`, `disabled`, badges semánticos y feedback de error/éxito; `hover` y foco también fueron comprobados manualmente.
- D7 y D8: tooltips accesibles, toast no modal, marca/iconografía de apoyo y microinteracciones implementadas; ayudas contextuales verificadas manualmente.
- D10: ancho reducido verificado manualmente sin deformación; existe regla `@media (prefers-reduced-motion: reduce)` para reducir transiciones/animaciones.
- Regresión funcional: P1-P16 continúan aprobadas y la sintaxis JavaScript fue validada.
- D9 queda pendiente únicamente de una comprobación manual final de navegación completa con teclado (`Tab`/`Shift+Tab`) antes del cierre técnico.
