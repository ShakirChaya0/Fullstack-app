CREATE OR REPLACE FUNCTION fn_pedido_mesa_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Pedidos"
    SET "nroMesa" = NULL
    WHERE "nroMesa" = OLD."nroMesa";
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_pedido_mesa
BEFORE DELETE ON "Mesa"
FOR EACH ROW
EXECUTE FUNCTION fn_pedido_mesa_before_delete();
