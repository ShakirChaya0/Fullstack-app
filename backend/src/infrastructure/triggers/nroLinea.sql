-- Función para calcular nroLinea

CREATE OR REPLACE FUNCTION asignar_nro_linea()
RETURNS TRIGGER AS $$
BEGIN
  -- Si nroLinea no se pasó manualmente

  IF NEW.nroLinea IS NULL THEN
    SELECT COALESCE(MAX(nroLinea), 0) + 1 -- Esa expresión calcula el siguiente número de línea disponible dentro de un pedido, empezando en 1 cuando no hay ninguna
    INTO NEW.nroLinea
    FROM "Linea De Pedido"
    WHERE "idPedido" = NEW."idPedido";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que ejecuta la función antes de insertar

CREATE TRIGGER trigger_asignar_nro_linea
BEFORE INSERT ON "Linea De Pedido"
FOR EACH ROW
EXECUTE FUNCTION asignar_nro_linea();