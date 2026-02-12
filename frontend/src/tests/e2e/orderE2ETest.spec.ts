import { test, expect } from "@playwright/test";

test.describe("Flujo E2E: Armado y Confirmación de Pedido", () => {
    let waiterToken: string;
    let qrToken: string;

    test.beforeAll(async ({ request }) => {
        // Login del mozo
        const loginResponse = await request.post(
            "http://localhost:3000/auth/login",
            {
                data: { email: "mozo@test.com", password: "Test1234" },
            },
        );
        const loginData = await loginResponse.json();
        waiterToken = loginData.token;

        // Generamos el QR una sola vez para todos los tests
        const qrResponse = await request.post("http://localhost:3000/qr", {
            data: { tableNumber: 1 },
            headers: {
                Authorization: `Bearer ${waiterToken}`,
                "Content-Type": "application/json",
            },
        });
        const qrData = await qrResponse.json();
        qrToken = qrData.QrToken;
    });

    test.beforeEach(async ({ page }) => {
        // Cada test navega al menú con el QR válido
        await page.goto(`/Cliente/Menu?qrToken=${qrToken}&mesa=1`);
        await expect(page.getByText("Comidas")).toBeVisible({
            timeout: 15_000,
        });
    });

    test("debe navegar a la lista de comidas y mostrar productos", async ({
        page,
    }) => {
        await page.getByText("Comidas").click();

        await expect(page.getByText("ENTRADA").first()).toBeVisible({
            timeout: 15_000,
        });
        await expect(page.getByText("PLATO PRINCIPAL").first()).toBeVisible({
            timeout: 15_000,
        });
        await expect(page.getByText("POSTRE").first()).toBeVisible({
            timeout: 15_000,
        });

        const productCards = page.locator(".min-w-\\[200px\\]").first();
        await expect(productCards).toBeVisible();
    });

    test("debe agregar un producto al carrito al hacer click en el botón +", async ({
        page,
    }) => {
        await page.getByText("Comidas").click();

        await expect(page.getByText("ENTRADA").first()).toBeVisible({
            timeout: 15_000,
        });

        const firstProductCard = page.locator(".min-w-\\[200px\\]").first();

        const addButton = firstProductCard.locator("button").last();

        await addButton.click();

        await expect(
            firstProductCard.getByText("1", { exact: true }),
        ).toBeVisible();

        await addButton.click();

        await expect(
            firstProductCard.getByText("2", { exact: true }),
        ).toBeVisible();
    });

    test("debe quitar un producto al carrito al hacer click en el botón -", async ({
        page,
    }) => {
        await page.getByText("Comidas").click();

        await expect(page.getByText("ENTRADA").first()).toBeVisible({
            timeout: 15_000,
        });

        const firstProductCard = page.locator(".min-w-\\[200px\\]").first();

        const addButton = firstProductCard.locator("button").last();

        const removeButton = firstProductCard.locator("button").first();

        await addButton.click();

        await addButton.click();

        await expect(
            firstProductCard.getByText("2", { exact: true }),
        ).toBeVisible();

        await removeButton.click();

        await expect(
            firstProductCard.getByText("1", { exact: true }),
        ).toBeVisible();
    });

    test("debe navegar a la lista de bebidas y agregar un producto", async ({
        page,
    }) => {
        await page.getByText("Bebidas").click();

        await expect(page.getByText("ALCOHOLICAS").first()).toBeVisible({
            timeout: 15_000,
        });
        await expect(page.getByText("NO ALCOHOLICAS").first()).toBeVisible({
            timeout: 15_000,
        });

        const productCards = page.locator(".min-w-\\[200px\\]").first();
        await expect(productCards).toBeVisible();

        const addButton = productCards.locator("button").last();

        await addButton.click();

        await expect(
            productCards.getByText("1", { exact: true }),
        ).toBeVisible();
    });

    test("debe mostrar los productos agregados en el panel: Mi Pedido; y funcionalidad de agregar y quitar productos desde el panel", async ({
        page,
    }) => {
        await page.getByText("Comidas").click();

        await expect(page.getByText("ENTRADA").first()).toBeVisible({
            timeout: 15_000,
        });

        const firstProductCard = page.locator(".min-w-\\[200px\\]").first();

        const productName = await firstProductCard
            .locator("h1")
            .first()
            .textContent();

        const addButton = firstProductCard.locator("button").last();

        await addButton.click();

        const orderPanelButton = page.locator("button", {
            hasText: "Mi Pedido",
        });

        if (await orderPanelButton.isVisible()) {
            await orderPanelButton.click();
        }

        if (productName) {
            await expect(
                page.locator("aside").getByText("Mi Pedido"),
            ).toBeVisible();

            await expect(
                page.locator("aside").getByText(productName, { exact: true }),
            ).toBeVisible();

            const counterInPanel = page
                .locator("aside")
                .getByText("1", { exact: true })
                .first();

            const panelAddButton = counterInPanel
                .locator("..")
                .locator("button")
                .last();

            await panelAddButton.click();

            await expect(
                page.locator("aside").getByText("2", { exact: true }),
            ).toBeVisible();
        } else {
            throw new Error("No se pudo obtener el nombre del producto");
        }
    });

    test("Flujo completo: desde visualizar menú hasta confirmar pedido", async ({
        page,
    }) => {
        await page.getByText("Comidas").click();

        await expect(page.getByText("ENTRADA").first()).toBeVisible({
            timeout: 15_000,
        });

        const firstProductCard = page.locator(".min-w-\\[200px\\]").first();

        const productName = await firstProductCard
            .locator("h1")
            .first()
            .textContent();

        const addButton = firstProductCard.locator("button").last();

        await addButton.click();

        const orderPanelButton = page.locator("button", {
            hasText: "Mi Pedido",
        });

        if (await orderPanelButton.isVisible()) {
            await orderPanelButton.click();
        }

        if (productName) {
            await expect(
                page.locator("aside").getByText("Mi Pedido"),
            ).toBeVisible();

            await expect(
                page.locator("aside").getByText(productName, { exact: true }),
            ).toBeVisible();

            const completeOrderButton = page.getByText("Completar Pedido", {
                exact: true,
            });

            await completeOrderButton.click();

            await page.waitForURL("**/RealizarPedido", { timeout: 10_000 });

            await expect(page.getByText("Mi Pedido").first()).toBeVisible();

            const desktopForm = page.locator(".hidden.md\\:block");
            const comensalesInput = desktopForm.locator(
                'input[name="cantidad"]',
            );

            await comensalesInput.fill("4");

            const observacionesInput = desktopForm.locator(
                'textarea[name="observaciones"]',
            );
            await observacionesInput.fill("Prueba de observaciones desde E2E");

            const confirmButton = desktopForm.getByText("Confirmar Pedido", {
                exact: true,
            });

            await confirmButton.click();

            await page.waitForURL("**/PedidoConfirmado**", { timeout: 10_000 });
        } else {
            throw new Error("No se pudo obtener el nombre del producto");
        }
    });
});
