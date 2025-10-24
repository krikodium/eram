// src/features/admin/services/pdfService.js - Servicio de exportación a PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const pdfService = {
  // Generar lista de precios de productos
  generateProductPriceList: async (products, options = {}) => {
    try {
      const doc = new jsPDF();
      
      // Configuración del documento
      const {
        title = 'Lista de Precios ERAM',
        subtitle = 'Catálogo de Productos',
        companyName = 'ERAM',
        companyAddress = 'Buenos Aires, Argentina',
        includeImages = false,
        includeDescription = true,
        date = new Date().toLocaleDateString('es-ES')
      } = options;

      // Header del documento
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, 20);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 14, 30);
      
      doc.setFontSize(10);
      doc.text(`Generado el: ${date}`, 14, 40);
      doc.text(companyName, 14, 45);
      doc.text(companyAddress, 14, 50);

      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(14, 55, 196, 55);

      // Preparar datos para la tabla
      const tableData = products.map((product, index) => {
        const row = [
          index + 1,
          product.nombre || 'Sin nombre',
          product.categoria?.nombre || 'Sin categoría',
          `$${product.precio?.toLocaleString() || '0'}`,
          product.rubro?.nombre || 'Sin rubro'
        ];

        if (includeDescription && product.descripcion) {
          row.push(product.descripcion.length > 50 
            ? product.descripcion.substring(0, 50) + '...' 
            : product.descripcion
          );
        }

        return row;
      });

      // Configurar columnas de la tabla
      const columns = [
        { title: 'N°', dataKey: 0 },
        { title: 'Producto', dataKey: 1 },
        { title: 'Categoría', dataKey: 2 },
        { title: 'Precio', dataKey: 3 },
        { title: 'Rubro', dataKey: 4 }
      ];

      if (includeDescription) {
        columns.push({ title: 'Descripción', dataKey: 5 });
      }

      // Generar tabla
      doc.autoTable({
        head: [columns.map(col => col.title)],
        body: tableData,
        startY: 60,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [59, 130, 246], // Color azul ERAM
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Gris muy claro
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 }, // Número
          1: { cellWidth: 60 }, // Producto
          2: { cellWidth: 30 }, // Categoría
          3: { halign: 'right', cellWidth: 25 }, // Precio
          4: { cellWidth: 30 }, // Rubro
          5: { cellWidth: 40 } // Descripción
        },
        margin: { left: 14, right: 14 },
        tableWidth: 'auto'
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Línea separadora del footer
        doc.setLineWidth(0.3);
        doc.line(14, 280, 196, 280);
        
        // Información del footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${companyName} - Lista de Precios`, 14, 285);
        doc.text(`Página ${i} de ${pageCount}`, 170, 285);
        doc.text(`Total de productos: ${products.length}`, 14, 290);
      }

      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Error al generar el PDF');
    }
  },

  // Generar lista de categorías
  generateCategoryList: async (categories, options = {}) => {
    try {
      const doc = new jsPDF();
      
      const {
        title = 'Lista de Categorías ERAM',
        subtitle = 'Categorías de Productos',
        companyName = 'ERAM',
        date = new Date().toLocaleDateString('es-ES')
      } = options;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, 20);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 14, 30);
      doc.text(`Generado el: ${date}`, 14, 40);

      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(14, 45, 196, 45);

      // Datos de la tabla
      const tableData = categories.map((category, index) => [
        index + 1,
        category.nombre || 'Sin nombre',
        category.descripcion || 'Sin descripción',
        category.productos?.length || 0,
        category.activa ? 'Activa' : 'Inactiva',
        new Date(category.created_at).toLocaleDateString('es-ES')
      ]);

      // Generar tabla
      doc.autoTable({
        head: [['N°', 'Categoría', 'Descripción', 'Productos', 'Estado', 'Fecha']],
        body: tableData,
        startY: 50,
        styles: {
          fontSize: 9,
          cellPadding: 4
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 60 },
          3: { halign: 'center', cellWidth: 20 },
          4: { halign: 'center', cellWidth: 20 },
          5: { halign: 'center', cellWidth: 25 }
        }
      });

      return doc;
    } catch (error) {
      console.error('Error generating category PDF:', error);
      throw new Error('Error al generar el PDF de categorías');
    }
  },

  // Generar lista combinada (productos por categoría)
  generateCombinedList: async (categories, options = {}) => {
    try {
      const doc = new jsPDF();
      
      const {
        title = 'Catálogo Completo ERAM',
        subtitle = 'Productos por Categoría',
        companyName = 'ERAM',
        date = new Date().toLocaleDateString('es-ES')
      } = options;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, 20);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 14, 30);
      doc.text(`Generado el: ${date}`, 14, 40);

      let currentY = 50;

      // Iterar por cada categoría
      categories.forEach((category, categoryIndex) => {
        // Verificar si necesitamos una nueva página
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        // Título de la categoría
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${categoryIndex + 1}. ${category.nombre}`, 14, currentY);
        
        currentY += 10;

        // Descripción de la categoría
        if (category.descripcion) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(category.descripcion, 14, currentY);
          currentY += 8;
        }

        // Productos de la categoría
        if (category.productos && category.productos.length > 0) {
          const productData = category.productos.map((product, index) => [
            index + 1,
            product.nombre || 'Sin nombre',
            `$${product.precio?.toLocaleString() || '0'}`,
            product.rubro?.nombre || 'Sin rubro'
          ]);

          doc.autoTable({
            head: [['N°', 'Producto', 'Precio', 'Rubro']],
            body: productData,
            startY: currentY,
            styles: {
              fontSize: 8,
              cellPadding: 2
            },
            headStyles: {
              fillColor: [59, 130, 246],
              textColor: 255,
              fontStyle: 'bold'
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 15 },
              1: { cellWidth: 80 },
              2: { halign: 'right', cellWidth: 25 },
              3: { cellWidth: 40 }
            },
            margin: { left: 14, right: 14 }
          });

          currentY = doc.lastAutoTable.finalY + 15;
        } else {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('No hay productos en esta categoría', 14, currentY);
          currentY += 15;
        }

        // Línea separadora entre categorías
        if (categoryIndex < categories.length - 1) {
          doc.setLineWidth(0.3);
          doc.line(14, currentY, 196, currentY);
          currentY += 10;
        }
      });

      return doc;
    } catch (error) {
      console.error('Error generating combined PDF:', error);
      throw new Error('Error al generar el PDF combinado');
    }
  },

  // Función helper para descargar PDF
  downloadPDF: (doc, filename) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.pdf`;
    doc.save(finalFilename);
  }
};

export default pdfService;
