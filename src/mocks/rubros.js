// src/mocks/rubros.js - Mock data for Rubros (Product Lines)
// This data will be used for Phase 1 simulation
// In Phase 2, this will be replaced with real API responses

export const mockRubros = [
  {
    id: 1,
    nombre: 'Protección Personal',
    descripcion: 'Equipo de protección individual para trabajadores',
    icon: 'shield-alt',
    color: '#D32F2F',
    image: '/proteccion-respiratoria.jpg',
    categorias: [
      'Cascos de Seguridad',
      'Guantes de Protección', 
      'Calzado de Seguridad',
      'Ropa de Trabajo'
    ]
  },
  {
    id: 2,
    nombre: 'Trabajo en Altura',
    descripcion: 'Sistemas y equipos para trabajo seguro en alturas',
    icon: 'hard-hat',
    color: '#1976D2',
    image: '/banner-altura.jpg',
    categorias: [
      'Arneses de Seguridad',
      'Líneas de Vida',
      'Anclajes y Conectores',
      'Escaleras y Andamios'
    ]
  },
  {
    id: 3,
    nombre: 'Protección Respiratoria',
    descripcion: 'Máscaras, filtros y sistemas de protección respiratoria',
    icon: 'lungs',
    color: '#388E3C',
    image: '/proteccion-respiratoria.jpg',
    categorias: [
      'Máscaras Completas',
      'Semifaciales',
      'Filtros y Cartuchos',
      'Equipos Autónomos'
    ]
  },
  {
    id: 4,
    nombre: 'Señalización Industrial',
    descripcion: 'Elementos de señalización y demarcación',
    icon: 'exclamation-triangle',
    color: '#F57C00',
    image: '/banner-industria.jpg',
    categorias: [
      'Señales de Seguridad',
      'Cintas Demarcadoras',
      'Conos y Barreras',
      'Iluminación de Emergencia'
    ]
  },
  {
    id: 5,
    nombre: 'Protección Auditiva',
    descripcion: 'Equipos para protección contra ruido industrial',
    icon: 'headphones',
    color: '#7B1FA2',
    image: '/industria.jpg',
    categorias: [
      'Tapones Auditivos',
      'Orejeras',
      'Cascos con Protección',
      'Audífonos Comunicación'
    ]
  },
  {
    id: 6,
    nombre: 'Protección Visual',
    descripcion: 'Gafas y pantallas de protección ocular',
    icon: 'eye',
    color: '#00796B',
    image: '/default-product.jpg',
    categorias: [
      'Gafas de Seguridad',
      'Pantallas Faciales',
      'Gafas para Soldadura',
      'Protección Láser'
    ]
  }
];

// Helper functions for working with mock data
export const getRubroById = (id) => {
  return mockRubros.find(rubro => rubro.id === id);
};

export const getRubrosByCategory = (categoryName) => {
  return mockRubros.filter(rubro => 
    rubro.categorias.some(cat => 
      cat.toLowerCase().includes(categoryName.toLowerCase())
    )
  );
};

export const getAllCategories = () => {
  const allCategories = mockRubros.flatMap(rubro => rubro.categorias);
  return [...new Set(allCategories)].sort();
};

export default mockRubros;