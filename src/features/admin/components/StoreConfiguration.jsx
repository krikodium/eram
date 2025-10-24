// src/features/admin/components/StoreConfiguration.jsx - Configuración general de la tienda
import React, { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaUndo, 
  FaUpload, 
  FaImage, 
  FaGlobe, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaPalette,
  FaAlignLeft,
  FaInfo,
  FaCheckCircle
} from 'react-icons/fa';
import { adminConfigService } from '../services/adminService';
import { useActivityLog } from '../hooks/useActivityLog';

const StoreConfiguration = () => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const logActivity = useActivityLog();

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const data = await adminConfigService.getConfiguration();
      setConfig(data);
      
      // Cargar previews de imágenes
      if (data.logo_url) {
        setLogoPreview(data.logo_url);
      }
      if (data.favicon_url) {
        setFaviconPreview(data.favicon_url);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminConfigService.updateConfiguration(config);
      logActivity('update', 'configuracion', null, 'Configuración de tienda actualizada');
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear la configuración a los valores por defecto?')) {
      loadConfiguration();
    }
  };

  const handleImageUpload = async (file, type) => {
    try {
      const imageUrl = await adminConfigService.uploadImage(file, type);
      
      if (type === 'logo') {
        setConfig({ ...config, logo_url: imageUrl });
        setLogoPreview(imageUrl);
      } else if (type === 'favicon') {
        setConfig({ ...config, favicon_url: imageUrl });
        setFaviconPreview(imageUrl);
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FaCog },
    { id: 'branding', label: 'Marca', icon: FaPalette },
    { id: 'contact', label: 'Contacto', icon: FaEnvelope },
    { id: 'social', label: 'Redes Sociales', icon: FaFacebook },
    { id: 'seo', label: 'SEO', icon: FaGlobe },
    { id: 'advanced', label: 'Avanzado', icon: FaInfo }
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
            <FaCog style={{ color: 'var(--admin-primary)' }} />
            Configuración de la Tienda
          </h1>
          <p style={{ 
            margin: '0', 
            color: 'var(--admin-text-muted)',
            fontSize: '1rem'
          }}>
            Personaliza la apariencia y configuración general de tu tienda
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleReset}
            className="admin-btn admin-btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem'
            }}
          >
            <FaUndo />
            Resetear
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem'
            }}
          >
            <FaSave />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--admin-border)',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              color: activeTab === tab.id ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--admin-primary)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <div style={{
        background: 'var(--admin-bg-secondary)',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
        padding: '2rem'
      }}>
        {activeTab === 'general' && <GeneralSettings config={config} setConfig={setConfig} />}
        {activeTab === 'branding' && <BrandingSettings config={config} setConfig={setConfig} onImageUpload={handleImageUpload} logoPreview={logoPreview} faviconPreview={faviconPreview} />}
        {activeTab === 'contact' && <ContactSettings config={config} setConfig={setConfig} />}
        {activeTab === 'social' && <SocialSettings config={config} setConfig={setConfig} />}
        {activeTab === 'seo' && <SEOSettings config={config} setConfig={setConfig} />}
        {activeTab === 'advanced' && <AdvancedSettings config={config} setConfig={setConfig} />}
      </div>
    </div>
  );
};

// Componente de configuración general
const GeneralSettings = ({ config, setConfig }) => (
  <div>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--admin-text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600'
    }}>
      Configuración General
    </h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          Nombre de la Tienda *
        </label>
        <input
          type="text"
          value={config.store_name || ''}
          onChange={(e) => setConfig({ ...config, store_name: e.target.value })}
          placeholder="Mi Tienda"
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
          Descripción Corta
        </label>
        <input
          type="text"
          value={config.store_tagline || ''}
          onChange={(e) => setConfig({ ...config, store_tagline: e.target.value })}
          placeholder="Tu descripción en una línea"
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
          Moneda
        </label>
        <select
          value={config.currency || 'ARS'}
          onChange={(e) => setConfig({ ...config, currency: e.target.value })}
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
          <option value="ARS">Peso Argentino (ARS)</option>
          <option value="USD">Dólar Americano (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="BRL">Real Brasileño (BRL)</option>
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
          Zona Horaria
        </label>
        <select
          value={config.timezone || 'America/Argentina/Buenos_Aires'}
          onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
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
          <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
          <option value="America/New_York">Nueva York (GMT-5)</option>
          <option value="Europe/London">Londres (GMT+0)</option>
          <option value="Europe/Madrid">Madrid (GMT+1)</option>
        </select>
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          Descripción Completa
        </label>
        <textarea
          value={config.store_description || ''}
          onChange={(e) => setConfig({ ...config, store_description: e.target.value })}
          placeholder="Describe tu tienda, productos y servicios..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--admin-border)',
            borderRadius: '0.5rem',
            background: 'var(--admin-bg-primary)',
            color: 'var(--admin-text-primary)',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  </div>
);

// Componente de configuración de marca
const BrandingSettings = ({ config, setConfig, onImageUpload, logoPreview, faviconPreview }) => (
  <div>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--admin-text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600'
    }}>
      Identidad Visual
    </h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {/* Logo */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          Logo de la Tienda
        </label>
        <div style={{
          border: '2px dashed var(--admin-border)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--admin-bg-primary)'
        }}>
          {logoPreview ? (
            <div>
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '100px', 
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }} 
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => document.getElementById('logo-upload').click()}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  <FaUpload /> Cambiar
                </button>
                <button
                  onClick={() => {
                    setConfig({ ...config, logo_url: '' });
                    setLogoPreview(null);
                  }}
                  className="admin-btn admin-btn-danger"
                  style={{ fontSize: '0.875rem' }}
                >
                  <FaImage /> Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <FaImage style={{ fontSize: '2rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                Sube el logo de tu tienda
              </p>
              <button
                onClick={() => document.getElementById('logo-upload').click()}
                className="admin-btn admin-btn-primary"
              >
                <FaUpload /> Subir Logo
              </button>
            </div>
          )}
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onImageUpload(file, 'logo');
            }}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Favicon */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          Favicon
        </label>
        <div style={{
          border: '2px dashed var(--admin-border)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--admin-bg-primary)'
        }}>
          {faviconPreview ? (
            <div>
              <img 
                src={faviconPreview} 
                alt="Favicon preview" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }} 
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={() => document.getElementById('favicon-upload').click()}
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  <FaUpload /> Cambiar
                </button>
                <button
                  onClick={() => {
                    setConfig({ ...config, favicon_url: '' });
                    setFaviconPreview(null);
                  }}
                  className="admin-btn admin-btn-danger"
                  style={{ fontSize: '0.875rem' }}
                >
                  <FaImage /> Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <FaImage style={{ fontSize: '2rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                Sube el favicon (32x32px)
              </p>
              <button
                onClick={() => document.getElementById('favicon-upload').click()}
                className="admin-btn admin-btn-primary"
              >
                <FaUpload /> Subir Favicon
              </button>
            </div>
          )}
          <input
            id="favicon-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onImageUpload(file, 'favicon');
            }}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>

    {/* Colores */}
    <div style={{ marginTop: '2rem' }}>
      <h4 style={{ 
        margin: '0 0 1rem 0', 
        color: 'var(--admin-text-primary)',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        Colores de la Marca
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--admin-text-primary)'
          }}>
            Color Primario
          </label>
          <input
            type="color"
            value={config.primary_color || '#3B82F6'}
            onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
            style={{
              width: '100%',
              height: '40px',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.5rem',
              cursor: 'pointer'
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
            Color Secundario
          </label>
          <input
            type="color"
            value={config.secondary_color || '#10B981'}
            onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
            style={{
              width: '100%',
              height: '40px',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

// Componente de configuración de contacto
const ContactSettings = ({ config, setConfig }) => (
  <div>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--admin-text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600'
    }}>
      Información de Contacto
    </h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <FaEnvelope style={{ marginRight: '0.5rem' }} />
          Email de Contacto
        </label>
        <input
          type="email"
          value={config.contact_email || ''}
          onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
          placeholder="contacto@mitienda.com"
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
          <FaPhone style={{ marginRight: '0.5rem' }} />
          Teléfono
        </label>
        <input
          type="tel"
          value={config.contact_phone || ''}
          onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
          placeholder="+54 11 1234-5678"
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
          <FaWhatsapp style={{ marginRight: '0.5rem' }} />
          WhatsApp
        </label>
        <input
          type="tel"
          value={config.whatsapp || ''}
          onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
          placeholder="+54 9 11 1234-5678"
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

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
          Dirección
        </label>
        <textarea
          value={config.address || ''}
          onChange={(e) => setConfig({ ...config, address: e.target.value })}
          placeholder="Dirección completa de la tienda..."
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--admin-border)',
            borderRadius: '0.5rem',
            background: 'var(--admin-bg-primary)',
            color: 'var(--admin-text-primary)',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  </div>
);

// Componente de configuración de redes sociales
const SocialSettings = ({ config, setConfig }) => (
  <div>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--admin-text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600'
    }}>
      Redes Sociales
    </h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <FaFacebook style={{ marginRight: '0.5rem', color: '#1877F2' }} />
          Facebook
        </label>
        <input
          type="url"
          value={config.social_facebook || ''}
          onChange={(e) => setConfig({ ...config, social_facebook: e.target.value })}
          placeholder="https://facebook.com/mitienda"
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
          <FaInstagram style={{ marginRight: '0.5rem', color: '#E4405F' }} />
          Instagram
        </label>
        <input
          type="url"
          value={config.social_instagram || ''}
          onChange={(e) => setConfig({ ...config, social_instagram: e.target.value })}
          placeholder="https://instagram.com/mitienda"
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
          <FaTwitter style={{ marginRight: '0.5rem', color: '#1DA1F2' }} />
          Twitter
        </label>
        <input
          type="url"
          value={config.social_twitter || ''}
          onChange={(e) => setConfig({ ...config, social_twitter: e.target.value })}
          placeholder="https://twitter.com/mitienda"
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
          <FaLinkedin style={{ marginRight: '0.5rem', color: '#0077B5' }} />
          LinkedIn
        </label>
        <input
          type="url"
          value={config.social_linkedin || ''}
          onChange={(e) => setConfig({ ...config, social_linkedin: e.target.value })}
          placeholder="https://linkedin.com/company/mitienda"
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
          <FaYoutube style={{ marginRight: '0.5rem', color: '#FF0000' }} />
          YouTube
        </label>
        <input
          type="url"
          value={config.social_youtube || ''}
          onChange={(e) => setConfig({ ...config, social_youtube: e.target.value })}
          placeholder="https://youtube.com/c/mitienda"
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
  </div>
);

// Componente de configuración SEO
const SEOSettings = ({ config, setConfig }) => (
  <div>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--admin-text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600'
    }}>
      Configuración SEO
    </h3>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <FaGlobe style={{ marginRight: '0.5rem' }} />
          Título SEO
        </label>
        <input
          type="text"
          value={config.seo_title || ''}
          onChange={(e) => setConfig({ ...config, seo_title: e.target.value })}
          placeholder="Mi Tienda - Productos de Calidad"
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
        <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          Recomendado: 50-60 caracteres
        </small>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <FaAlignLeft style={{ marginRight: '0.5rem' }} />
          Meta Descripción
        </label>
        <textarea
          value={config.seo_description || ''}
          onChange={(e) => setConfig({ ...config, seo_description: e.target.value })}
          placeholder="Descripción que aparecerá en los resultados de búsqueda..."
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--admin-border)',
            borderRadius: '0.5rem',
            background: 'var(--admin-bg-primary)',
            color: 'var(--admin-text-primary)',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
        <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          Recomendado: 150-160 caracteres
        </small>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <FaGlobe style={{ marginRight: '0.5rem' }} />
          Palabras Clave
        </label>
        <input
          type="text"
          value={config.seo_keywords || ''}
          onChange={(e) => setConfig({ ...config, seo_keywords: e.target.value })}
          placeholder="tienda, productos, calidad, envío"
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
        <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          Separa las palabras clave con comas
        </small>
      </div>
    </div>
  </div>
);

// Componente de configuración avanzada
const AdvancedSettings = ({ config, setConfig }) => (
  <div>
    <h3 style={{ 
      margin: '0 0 1.5rem 0', 
      color: 'var(--admin-text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600'
    }}>
      Configuración Avanzada
    </h3>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <input
            type="checkbox"
            checked={config.maintenance_mode || false}
            onChange={(e) => setConfig({ ...config, maintenance_mode: e.target.checked })}
            style={{ margin: 0 }}
          />
          Modo Mantenimiento
        </label>
        <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          Activa esta opción para mostrar una página de mantenimiento a los visitantes
        </small>
      </div>

      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          <input
            type="checkbox"
            checked={config.analytics_enabled || false}
            onChange={(e) => setConfig({ ...config, analytics_enabled: e.target.checked })}
            style={{ margin: 0 }}
          />
          Habilitar Analytics
        </label>
        <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          Activa el seguimiento de visitantes y estadísticas
        </small>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--admin-text-primary)'
        }}>
          Google Analytics ID
        </label>
        <input
          type="text"
          value={config.google_analytics_id || ''}
          onChange={(e) => setConfig({ ...config, google_analytics_id: e.target.value })}
          placeholder="GA-XXXXXXXXX-X"
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
          Código Personalizado (Head)
        </label>
        <textarea
          value={config.custom_head_code || ''}
          onChange={(e) => setConfig({ ...config, custom_head_code: e.target.value })}
          placeholder="<!-- Código personalizado para el <head> -->"
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--admin-border)',
            borderRadius: '0.5rem',
            background: 'var(--admin-bg-primary)',
            color: 'var(--admin-text-primary)',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
        <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
          Código HTML/JavaScript que se insertará en el &lt;head&gt; de todas las páginas
        </small>
      </div>
    </div>
  </div>
);

export default StoreConfiguration;
