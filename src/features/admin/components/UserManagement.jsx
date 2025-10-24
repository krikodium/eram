// src/features/admin/components/UserManagement.jsx - Gestión de usuarios del sistema
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import DataTable from './DataTable';
import { adminUserService } from '../services/adminService';
import { useActivityLog } from '../hooks/useActivityLog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const logActivity = useActivityLog();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminUserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await adminUserService.createUser(userData);
      await loadUsers();
      setShowUserForm(false);
      logActivity('create', 'usuarios', null, `Usuario creado: ${userData.email}`);
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await adminUserService.updateUser(id, userData);
      await loadUsers();
      setEditingUser(null);
      logActivity('update', 'usuarios', id, `Usuario actualizado: ${userData.email}`);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await adminUserService.deleteUser(id);
        await loadUsers();
        logActivity('delete', 'usuarios', id, 'Usuario eliminado');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        throw error;
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminUserService.updateUser(id, { activo: !currentStatus });
      await loadUsers();
      logActivity('update', 'usuarios', id, `Usuario ${!currentStatus ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      throw error;
    }
  };

  const handleResetPassword = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres resetear la contraseña de este usuario?')) {
      try {
        await adminUserService.resetPassword(id);
        logActivity('update', 'usuarios', id, 'Contraseña reseteada');
      } catch (error) {
        console.error('Error reseteando contraseña:', error);
        throw error;
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.apellido?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.activo) ||
                         (statusFilter === 'inactive' && !user.activo);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'var(--admin-error)', label: 'Administrador' },
      editor: { color: 'var(--admin-warning)', label: 'Editor' },
      viewer: { color: 'var(--admin-info)', label: 'Visualizador' },
      client: { color: 'var(--admin-text-muted)', label: 'Cliente' }
    };
    
    const config = roleConfig[role] || roleConfig.client;
    
    return (
      <span style={{
        background: `${config.color}20`,
        color: config.color,
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (activo) => {
    return (
      <span style={{
        background: activo ? 'var(--admin-success)20' : 'var(--admin-error)20',
        color: activo ? 'var(--admin-success)' : 'var(--admin-error)',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        {activo ? <FaCheck /> : <FaTimes />}
        {activo ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaEnvelope style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }} />
          <span style={{ fontWeight: '500' }}>{user.email}</span>
        </div>
      )
    },
    {
      key: 'nombre',
      label: 'Nombre',
      render: (user) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {user.nombre} {user.apellido}
          </div>
          {user.telefono && (
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--admin-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.25rem'
            }}>
              <FaPhone style={{ fontSize: '0.625rem' }} />
              {user.telefono}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rol',
      render: (user) => getRoleBadge(user.role)
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (user) => getStatusBadge(user.activo)
    },
    {
      key: 'created_at',
      label: 'Fecha de Registro',
      render: (user) => (
        <div style={{ 
          fontSize: '0.875rem',
          color: 'var(--admin-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <FaCalendarAlt style={{ fontSize: '0.75rem' }} />
          {new Date(user.created_at).toLocaleDateString('es-AR')}
        </div>
      )
    },
    {
      key: 'last_login',
      label: 'Último Acceso',
      render: (user) => (
        <div style={{ 
          fontSize: '0.875rem',
          color: 'var(--admin-text-muted)'
        }}>
          {user.last_login ? 
            new Date(user.last_login).toLocaleDateString('es-AR') : 
            'Nunca'
          }
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (user) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setEditingUser(user)}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            title="Editar usuario"
          >
            <FaEdit />
          </button>
          
          <button
            onClick={() => handleToggleStatus(user.id, user.activo)}
            className={`admin-btn ${user.activo ? 'admin-btn-warning' : 'admin-btn-success'}`}
            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            title={user.activo ? 'Desactivar' : 'Activar'}
          >
            {user.activo ? <FaTimes /> : <FaCheck />}
          </button>
          
          <button
            onClick={() => handleResetPassword(user.id)}
            className="admin-btn admin-btn-info"
            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            title="Resetear contraseña"
          >
            <FaShieldAlt />
          </button>
          
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="admin-btn admin-btn-danger"
            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            title="Eliminar usuario"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="admin-fade-in">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <div className="admin-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-fade-in">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 0.5rem 0', 
            color: 'var(--admin-text-primary)',
            fontSize: '2rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <FaUsers style={{ color: 'var(--admin-primary)' }} />
            Gestión de Usuarios
          </h1>
          <p style={{ 
            margin: '0', 
            color: 'var(--admin-text-muted)',
            fontSize: '1rem'
          }}>
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>

        <button
          onClick={() => setShowUserForm(true)}
          className="admin-btn admin-btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem'
          }}
        >
          <FaUserPlus />
          Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Buscar
            </label>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--admin-text-muted)',
                fontSize: '0.875rem'
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por email, nombre o apellido..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.5rem',
                  background: 'var(--admin-bg-primary)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Rol
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="viewer">Visualizador</option>
              <option value="client">Cliente</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--admin-text-primary)'
            }}>
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.5rem',
                background: 'var(--admin-bg-primary)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        overflow: 'hidden'
      }}>
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron usuarios"
          searchable={false}
        />
      </div>

      {/* Modal de formulario de usuario */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSave={editingUser ? handleUpdateUser : handleCreateUser}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

// Componente de formulario de usuario
const UserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    role: user?.role || 'client',
    activo: user?.activo !== undefined ? user.activo : true
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userData = { ...formData };
      if (!user && !userData.password) {
        throw new Error('La contraseña es requerida para nuevos usuarios');
      }
      if (user && !userData.password) {
        delete userData.password; // No actualizar contraseña si está vacía
      }
      
      await onSave(user?.id, userData);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert(error.message || 'Error guardando usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--admin-bg-secondary)',
        borderRadius: '0.75rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            margin: 0,
            color: 'var(--admin-text-primary)',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--admin-text-primary)'
              }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.5rem',
                  background: 'var(--admin-bg-primary)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--admin-text-primary)'
              }}>
                Contraseña {!user && '*'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!user}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '0.5rem',
                    background: 'var(--admin-bg-primary)',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--admin-text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--admin-text-primary)'
                }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '0.5rem',
                    background: 'var(--admin-bg-primary)',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--admin-text-primary)'
                }}>
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '0.5rem',
                    background: 'var(--admin-bg-primary)',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--admin-text-primary)'
              }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.5rem',
                  background: 'var(--admin-bg-primary)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--admin-text-primary)'
                }}>
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '0.5rem',
                    background: 'var(--admin-bg-primary)',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="client">Cliente</option>
                  <option value="viewer">Visualizador</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--admin-text-primary)'
                }}>
                  Estado
                </label>
                <select
                  value={formData.activo ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.value === 'active' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '0.5rem',
                    background: 'var(--admin-bg-primary)',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
