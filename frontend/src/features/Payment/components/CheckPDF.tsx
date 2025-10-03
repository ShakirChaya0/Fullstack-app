import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { CheckType } from "../types/PaymentSharedTypes";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";
import { pdfStyles } from "../constants/PaymentConstants";

export default function CheckPDF({ check }: { check: CheckType }) {
    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.container}>

                    <View style={pdfStyles.header}>
                        <Text style={pdfStyles.title}>{check.nombreRestaurante}</Text>
                        <Text style={pdfStyles.subtitle}>{check.direccionRestaurante}</Text>
                        <Text style={pdfStyles.subtitle}>{check.telefonoContacto}</Text>
                    </View>

                    <View style={pdfStyles.section}>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Mesa:</Text>
                            <Text style={pdfStyles.value}>{check.nroMesa}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Cubiertos:</Text>
                            <Text style={pdfStyles.value}>
                                {formatCurrency(check.totalCubiertos, "es-AR", "ARS")}
                            </Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Fecha:</Text>
                            <Text style={pdfStyles.value}>
                                {formatDate(new Date(check.fecha), "en-US")}
                            </Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Mozo:</Text>
                            <Text style={pdfStyles.value}>{check.nombreMozo}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text style={pdfStyles.label}>Pedido N°:</Text>
                            <Text style={pdfStyles.value}>{check.pedido.idPedido}</Text>
                        </View>
                    </View>

                    <View style={pdfStyles.section}>
                        <View style={pdfStyles.row}>
                            <Text style={{ fontWeight: "bold", fontSize: 10 }}>Producto</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 10 }}>Total</Text>
                        </View>
                        {check.pedido.lines.map((line) => (
                            <View key={line.nombreProducto} style={pdfStyles.productRow}>
                                <View style={pdfStyles.productInfo}>
                                    <Text style={pdfStyles.productName}>{line.nombreProducto}</Text>
                                    <Text style={pdfStyles.productDetail}>
                                        {line.cantidad} x{" "}
                                        {formatCurrency(line.montoUnitario, "es-AR", "ARS")}
                                    </Text>
                                </View>
                                <Text style={{ fontWeight: "bold" }}>
                                    {formatCurrency(line.importe, "es-AR", "ARS")}
                                </Text>
                            </View>
                        ))}
                    </View>
                    
                    <View style={pdfStyles.totalSection}>
                        <View style={pdfStyles.row}>
                            <Text>Subtotal:</Text>
                            <Text>{formatCurrency(check.pedido.subtotal, "es-AR", "ARS")}</Text>
                        </View>
                        <View style={pdfStyles.row}>
                            <Text>Impuestos (IVA 21%):</Text>
                            <Text>
                              {formatCurrency(check.pedido.importeImpuestos, "es-AR", "ARS")}
                            </Text>
                        </View>
                        <View style={pdfStyles.totalRow}>
                            <Text>TOTAL:</Text>
                            <Text>{formatCurrency(check.pedido.total, "es-AR", "ARS")}</Text>
                        </View>
                    </View>
                    
                    <View style={pdfStyles.footer}>
                        <Text style={pdfStyles.thanks}>¡Gracias por su visita!</Text>
                        <Text style={pdfStyles.legal}>{check.razonSocial}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
