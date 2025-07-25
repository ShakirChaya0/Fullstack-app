CREATE OR REPLACE FUNCTION fn_pedido_mozo_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Pedido"
    SET "idMozo" = NULL
    WHERE "idMozo" = OLD."idMozo";
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_pedido_mozo
BEFORE DELETE ON "Mozos"
FOR EACH ROW
EXECUTE FUNCTION fn_pedido_mozo_before_delete();
