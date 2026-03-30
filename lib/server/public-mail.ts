import "server-only";
import { createMailTransporter, sanitizeContactData, type ContactBody } from "@/lib/server/public-validation";

export function buildQuoteProducts(productsRaw: Array<Record<string, unknown>>) {
  return productsRaw.map((product) => {
    const name = String(product.name ?? product.nombre ?? "Producto").trim();
    const productCode = String(product.product_code ?? product.codigo ?? "").trim();
    const quantity = Math.max(1, parseInt(String(product.quantity ?? product.cantidad ?? 1), 10) || 1);
    const price = Math.max(0, Number(product.price ?? 0) || 0);

    return { name, productCode, quantity, price };
  });
}

export async function sendContactEmails(data: ContactBody) {
  const transporter = createMailTransporter();
  const { nombre, apellidos, email, telefono, empresa, ciudad, region, mensaje } = sanitizeContactData(data);
  const envTo = (process.env.MAIL_TO || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const safeReplyName = `${nombre} ${apellidos}`.replace(/[\r\n]/g, " ").trim();
  const safeReplyEmail = email.replace(/[\r\n]/g, "").trim();

  const subjectInternal = "Nuevo contacto del sitio web";
  const textInternal = `
Nuevo mensaje desde el formulario de contacto:

Nombre: ${nombre} ${apellidos}
Correo: ${email}
Telefono: ${telefono}
Empresa: ${empresa || "(no especifica)"}
Ciudad: ${ciudad || "(no especifica)"}
Region: ${region || "(no especifica)"}

Mensaje:
${mensaje || "(sin mensaje)"}`.trim();

  const htmlInternal = `
<div lang="es">
  <p><strong>Nuevo mensaje desde el formulario de contacto</strong></p>
  <p>
    <strong>Nombre:</strong> ${nombre} ${apellidos}<br />
    <strong>Correo:</strong> ${email}<br />
    <strong>Telefono:</strong> ${telefono}<br />
    <strong>Empresa:</strong> ${empresa || "(no especifica)"}<br />
    <strong>Ciudad:</strong> ${ciudad || "(no especifica)"}<br />
    <strong>Region:</strong> ${region || "(no especifica)"}<br />
  </p>
  <p><strong>Mensaje:</strong></p>
  <pre>${mensaje || "(sin mensaje)"}</pre>
</div>
`.trim();

  const subjectUser = "Hemos recibido tu mensaje";
  const textUser = `Hola ${nombre},

Hemos recibido tu mensaje y te contactaremos pronto.

Resumen:
Nombre: ${nombre} ${apellidos}
Telefono: ${telefono}
Empresa: ${empresa || "(no especifica)"}
Ciudad: ${ciudad || "(no especifica)"}
Region: ${region || "(no especifica)"}
Mensaje: ${mensaje || "(sin mensaje)"}

Atentamente,
RyCrep
https://rycrep.cl`.trim();

  const htmlUser = `
<div lang="es">
  <p>Hola <strong>${nombre}</strong>,</p>
  <p>Hemos recibido tu mensaje y te contactaremos pronto.</p>
  <p><strong>Resumen</strong><br />
    Nombre: ${nombre} ${apellidos}<br />
    Telefono: ${telefono}<br />
    Empresa: ${empresa || "(no especifica)"}<br />
    Ciudad: ${ciudad || "(no especifica)"}<br />
    Region: ${region || "(no especifica)"}<br />
    Mensaje: ${mensaje || "(sin mensaje)"}<br />
  </p>
  <hr />
  <p>
    Atentamente,<br />
    RyCrep<br />
    <a href="https://rycrep.cl">https://rycrep.cl</a>
  </p>
</div>
`.trim();

  if (envTo.length > 0) {
    await transporter.sendMail({
      from: `"RyCrep" <${process.env.GMAIL_USER}>`,
      to: envTo,
      subject: subjectInternal,
      text: textInternal,
      html: htmlInternal,
      replyTo: `"${safeReplyName}" <${safeReplyEmail}>`,
    });
  }

  await transporter.sendMail({
    from: `"RyCrep" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: subjectUser,
    text: textUser,
    html: htmlUser,
  });
}

export async function sendQuoteEmails(data: ContactBody, productsRaw: Array<Record<string, unknown>>) {
  const transporter = createMailTransporter();
  const { nombre, apellidos, email, telefono, empresa, ciudad, region, mensaje } = sanitizeContactData(data);
  const products = buildQuoteProducts(productsRaw);
  const envTo = (process.env.MAIL_TO || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const safeReplyName = `${nombre} ${apellidos}`.replace(/[\r\n]/g, " ").trim();
  const safeReplyEmail = email.replace(/[\r\n]/g, "").trim();

  const detailText = products.map((product) => `${product.name}${product.productCode ? ` [${product.productCode}]` : ""} (x${product.quantity})`).join("\n");
  const rowsHtml = products.map((product) => `
  <tr>
    <td style="padding:6px 8px;border:1px solid #ddd;">${product.name}${product.productCode ? ` <br /><small>${product.productCode}</small>` : ""}</td>
    <td style="padding:6px 8px;border:1px solid #ddd;">${product.quantity}</td>
  </tr>`).join("");
  const detailHtml = `
<table lang="es" style="border-collapse:collapse;border:1px solid #ddd;">
  <thead>
    <tr style="background:#f5f5f5;">
      <th style="padding:6px 8px;border:1px solid #ddd;">Producto</th>
      <th style="padding:6px 8px;border:1px solid #ddd;">Cantidad</th>
    </tr>
  </thead>
  <tbody>
    ${rowsHtml}
  </tbody>
</table>
`.trim();

  const subjectInternal = "Nueva Cotizacion desde la web";
  const textInternal = `Nueva solicitud de cotizacion

Nombre: ${nombre} ${apellidos}
Correo: ${email}
Telefono: ${telefono}
Empresa: ${empresa || "(no especifica)"}
Ciudad: ${ciudad || "(no especifica)"}
Region: ${region || "(no especifica)"}

Productos:
${detailText || "(sin productos)"}

Mensaje adicional:
${mensaje || "(sin mensaje)"}`.trim();

  const htmlInternal = `
<div lang="es" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <p><strong>Nueva solicitud de cotizacion</strong></p>
  <p>
    <strong>Nombre:</strong> ${nombre} ${apellidos}<br />
    <strong>Correo:</strong> ${email}<br />
    <strong>Telefono:</strong> ${telefono}<br />
    <strong>Empresa:</strong> ${empresa || "(no especifica)"}<br />
    <strong>Ciudad:</strong> ${ciudad || "(no especifica)"}<br />
    <strong>Region:</strong> ${region || "(no especifica)"}<br />
  </p>
  <p><strong>Productos solicitados</strong></p>
  ${detailHtml}
  <p><strong>Mensaje adicional:</strong></p>
  <pre>${mensaje || "(sin mensaje)"}</pre>
</div>
`.trim();

  const subjectUser = "Hemos recibido tu solicitud de cotizacion";
  const textUser = `Hola ${nombre},

Hemos recibido tu solicitud de cotizacion y te contactaremos pronto.

Resumen de productos:
${detailText || "(sin productos)"}

Datos de contacto:
Nombre: ${nombre} ${apellidos}
Telefono: ${telefono}
Empresa: ${empresa || "(no especifica)"}
Ciudad: ${ciudad || "(no especifica)"}
Region: ${region || "(no especifica)"}

Atentamente,
RyCrep
https://rycrep.cl`.trim();

  const htmlUser = `
<div lang="es" style="font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif">
  <p>Hola <strong>${nombre}</strong>,</p>
  <p>Hemos recibido tu solicitud de cotizacion y te contactaremos pronto.</p>
  <p><strong>Resumen de productos</strong></p>
  ${detailHtml}
  <p><strong>Datos de contacto</strong><br />
    Nombre: ${nombre} ${apellidos}<br />
    Telefono: ${telefono}<br />
    Empresa: ${empresa || "(no especifica)"}<br />
    Ciudad: ${ciudad || "(no especifica)"}<br />
    Region: ${region || "(no especifica)"}<br />
  </p>
  <p><strong>Mensaje adicional:</strong></p>
  <pre>${mensaje || "(sin mensaje)"}</pre>
  <hr />
  <p>
    Atentamente,<br />
    RyCrep<br />
    <a href="https://rycrep.cl">https://rycrep.cl</a>
  </p>
</div>
`.trim();

  if (envTo.length > 0) {
    await transporter.sendMail({
      from: `"RyCrep" <${process.env.GMAIL_USER}>`,
      to: envTo,
      subject: subjectInternal,
      text: textInternal,
      html: htmlInternal,
      replyTo: `"${safeReplyName}" <${safeReplyEmail}>`,
    });
  }

  await transporter.sendMail({
    from: `"RyCrep" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: subjectUser,
    text: textUser,
    html: htmlUser,
  });
}
