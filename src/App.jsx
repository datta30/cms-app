import React, { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './LoginPage'; 
import AboutUsPage from './AboutUsPage'; 
import RegistrationPage from './RegistrationPage'; // Import RegistrationPage

// Mock data service - keep for other sections until they are migrated
const mockData = {
  pages: [
    { id: 1, title: 'Home', layout: 'default', status: 'published' },
    { id: 2, title: 'About', layout: 'sidebar', status: 'published' }
  ],
  media: [
    { id: 1, name: 'hero.jpg', type: 'image', url: '/images/hero.jpg', size: '1.2 MB' },
    { id: 2, name: 'video.mp4', type: 'video', url: '/videos/promo.mp4', size: '5.4 MB' }  
  ],
  analytics: {
    pageViews: 12453,
    uniqueVisitors: 5234,
    bounceRate: '45%',
    avgTimeOnSite: '2:35'
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [currentUser, setCurrentUser] = useState(null); // Store user info

  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState('light')
  const [notification, setNotification] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  
  const [posts, setPosts] = useState([]) // Initialize posts as empty array
  const [pages, setPages] = useState(mockData.pages)
  const [media, setMedia] = useState(mockData.media)
  const [analyticsData, setAnalyticsData] = useState(mockData.analytics);

  // State for auth view (login or register)
  const [authView, setAuthView] = useState('login'); 

  // State for change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Check for existing session/token on initial load (e.g., from localStorage)
  useEffect(() => {
    // For now, we'll just keep it simple. In a real app, you'd check for a token.
    // const token = localStorage.getItem('cms-token');
    // if (token) {
    //   // You would typically verify the token with the backend here
    //   // For simplicity, we'll assume if a token exists, user is "logged in"
    //   // This is NOT secure for a real app.
    //   const storedUser = localStorage.getItem('cms-user');
    //   if (storedUser) {
    //      setIsAuthenticated(true);
    //      setCurrentUser(JSON.parse(storedUser));
    //   }
    // }
  }, []);

  // Effects
  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('cms-theme') || 'light'
    setTheme(savedTheme)
  }, [])

  // Fetch posts from backend
  useEffect(() => {
    if (isAuthenticated && (activeSection === 'posts' || activeSection === 'dashboard')) { // Only fetch if authenticated
      fetchPosts();
    }
  }, [activeSection, isAuthenticated]); // Add isAuthenticated to dependency array

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      showNotification('Failed to load posts', 'error');
    }
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setAuthView('login'); // Reset to login view in case they were on register
    showNotification(`Welcome, ${userData.username}!`, 'info');
    setActiveSection('dashboard'); // Go to dashboard after login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthView('login'); // Reset to login view
    setActiveSection('dashboard'); // Or redirect to login
    showNotification('Logged out successfully.', 'info');
  };

  // Event handlers
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    // Implement search logic
  }

  const handleDelete = async (type, id) => {
    if (type === 'posts') {
      try {
        const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        setPosts(posts.filter(post => post.id !== id));
        showNotification('Post deleted successfully', 'info');
      } catch (error) {
        console.error("Failed to delete post:", error);
        showNotification('Failed to delete post', 'error');
      }
    } else if (type === 'pages') {
      setPages(pages.filter(page => page.id !== id))
      showNotification(`${type} item deleted successfully`, 'info') // Keep mock for now
    } else if (type === 'media') {
      setMedia(media.filter(item => item.id !== id))
      showNotification(`${type} item deleted successfully`, 'info') // Keep mock for now
    }
  }

  const handleSave = async (type, item) => {
    if (type === 'posts') {
      try {
        let response;
        if (item.id) { // Existing post: PUT request
          response = await fetch(`/api/posts/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
        } else { // New post: POST request
          response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, date: new Date().toISOString() }), // Ensure date is set
          });
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to save post');
        }
        const savedPost = await response.json();
        if (item.id) {
          setPosts(posts.map(p => (p.id === savedPost.id ? savedPost : p)));
        } else {
          setPosts([...posts, savedPost]);
        }
        showNotification('Post saved successfully', 'info');
      } catch (error) {
        console.error("Failed to save post:", error);
        showNotification(error.message || 'Failed to save post', 'error');
      }
    } else if (type === 'pages') { // Keep mock for now
      if (item.id) {
        setPages(pages.map(p => p.id === item.id ? item : p))
      } else {
        setPages([...pages, { ...item, id: Date.now() }])
      }
      showNotification(`${type} saved successfully`, 'info');
    }
    setIsEditing(false);
    setSelectedItem(null);
  }

  const handleUpload = (files) => {
    const newMedia = Array.from(files).map(file => ({
      id: Date.now(),
      name: file.name,
      type: file.type.split('/')[0],
      url: URL.createObjectURL(file),
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    }))
    setMedia([...media, ...newMedia])
    showNotification('Media uploaded successfully', 'info')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showNotification('New passwords do not match.', 'error');
      return;
    }
    if (!currentPassword || !newPassword) {
      showNotification('Please fill in all password fields.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id, // Sending userId, assumes currentUser is populated
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to change password.');
      }

      showNotification('Password changed successfully!', 'info');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      showNotification(error.message || 'An error occurred.', 'error');
      console.error('Change password error:', error);
    }
  };

  // Content rendering
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Page Views</h3>
          <div className="stat-value">{analyticsData.pageViews}</div>
        </div>
        <div className="stat-card">
          <h3>Unique Visitors</h3>
          <div className="stat-value">{analyticsData.uniqueVisitors}</div>
        </div>
        <div className="stat-card">
          <h3>Bounce Rate</h3>
          <div className="stat-value">{analyticsData.bounceRate}</div>
        </div>
        <div className="stat-card">
          <h3>Avg Time on Site</h3>
          <div className="stat-value">{analyticsData.avgTimeOnSite}</div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveSection('posts')}>New Post</button>
          <button onClick={() => setActiveSection('media')}>Upload Media</button>
          <button onClick={() => setActiveSection('pages')}>Edit Pages</button>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {/* Add activity feed */}
      </div>
    </div>
  )

  const renderPosts = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>Posts</h2>
        <button onClick={() => {
          setSelectedItem({ title: '', content: '', status: 'draft' }) // Default values for new post
          setIsEditing(true)
        }}>Add New Post</button>
      </div>
      {posts.length === 0 && <p>No posts found. Add one!</p>}
      <div className="items-grid">
        {posts.map(post => (
          <div key={post.id} className="item-card">
            <h3>{post.title}</h3>
            <p>{post.content ? post.content.substring(0, 100) : 'No content'}...</p>
            <div className="status-badge">{post.status}</div>
            <small>Last updated: {new Date(post.updated_at || post.date).toLocaleDateString()}</small>
            <div className="item-actions">
              <button onClick={() => {
                setSelectedItem(post)
                setIsEditing(true)
              }}>Edit</button>
              <button onClick={() => handleDelete('posts', post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isEditing && selectedItem && activeSection === 'posts' && (
        <EditModal
          item={selectedItem}
          type="posts"
          onSave={handleSave}
          onClose={() => {
            setIsEditing(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  )

  const renderPages = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>Pages</h2>
        <button onClick={() => {
          setSelectedItem({ title: '', content: '', layout: 'default', status: 'published' }) // Default values for new page
          setIsEditing(true)
        }}>Add New Page</button>
      </div>
      <div className="items-grid">
        {pages.map(page => (
          <div 
            key={page.id} 
            className="item-card"
            draggable
            onDragStart={() => setDraggedItem(page)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => {
              if (draggedItem && draggedItem.id !== page.id) {
                const newPages = [...pages]
                const dragIndex = pages.findIndex(p => p.id === draggedItem.id)
                const dropIndex = pages.findIndex(p => p.id === page.id)
                newPages.splice(dragIndex, 1)
                newPages.splice(dropIndex, 0, draggedItem)
                setPages(newPages)
              }
            }}
          >
            <h3>{page.title}</h3>
            <div className="layout-badge">{page.layout}</div>
            <div className="item-actions">
              <button onClick={() => {
                setSelectedItem(page)
                setIsEditing(true)
              }}>Edit</button>
              <button onClick={() => handleDelete('pages', page.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isEditing && selectedItem && activeSection === 'pages' && (
        <EditModal 
          item={selectedItem}
          type="pages"
          onSave={handleSave}
          onClose={() => {
            setIsEditing(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  )

  const renderMedia = () => (
    <div className="section-content">
      <div className="section-header">
        <h2>Media Library</h2>
        <div 
          className="upload-zone"
          onDragOver={e => {
            e.preventDefault()
            e.currentTarget.classList.add('active')
          }}
          onDragLeave={e => e.currentTarget.classList.remove('active')}
          onDrop={e => {
            e.preventDefault()
            e.currentTarget.classList.remove('active')
            handleUpload(e.dataTransfer.files)
          }}
        >
          <input 
            type="file" 
            multiple 
            onChange={e => handleUpload(e.target.files)}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            Drop files here or click to upload
          </label>
        </div>
      </div>
      <div className="media-grid">
        {media.map(item => (
          <div key={item.id} className="media-card">
            {item.type === 'image' ? (
              <img src={item.url} alt={item.name} />
            ) : (
              <div className="file-icon">{item.type}</div>
            )}
            <p>{item.name}</p>
            <small>{item.size}</small>
            <button onClick={() => handleDelete('media', item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="section-content">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={e => {
        e.preventDefault()
        showNotification('Settings saved successfully', 'info')
      }}>
        <div className="form-group">
          <h3>General Settings</h3>
          <label>
            Site Title
            <input type="text" defaultValue="My CMS Site" />
          </label>
          <label>
            Site Description
            <textarea defaultValue="A modern content management system" />
          </label>
        </div>
        
        <div className="form-group">
          <h3>Theme Settings</h3>
          <label>
            Color Scheme
            <select value={theme} onChange={handleThemeToggle}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        
        <div className="form-group">
          <h3>User Preferences</h3>
          <label>
            <input type="checkbox" defaultChecked />
            Show notifications
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Enable autosave
          </label>
        </div>
        
        <button type="submit" className="save-settings">
          Save Settings
        </button>
      </form>

      {/* Change Password Form */}
      <form className="settings-form" onSubmit={handleChangePassword} style={{ marginTop: '30px' }}>
        <div className="form-group">
          <h3>Change Password</h3>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="save-settings">
          Change Password
        </button>
      </form>
    </div>
  )

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'posts':
        return renderPosts()
      case 'pages':
        return renderPages()
      case 'media': 
        return renderMedia()
      case 'settings':
        return renderSettings()
      case 'about-us': // Add new case for About Us
        return <AboutUsPage />
      default:
        return <div>404 - Section not found</div>
    }
  }
  
  const handleThemeToggle = () => { 
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('cms-theme', newTheme)
  }

  // If not authenticated, render LoginPage or RegistrationPage
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage 
                onLoginSuccess={handleLoginSuccess} 
                onShowRegister={() => setAuthView('register')} 
             />;
    } else if (authView === 'register') {
      return <RegistrationPage 
                onRegisterSuccess={() => {
                  showNotification('Registration successful! Please login.', 'info');
                  setAuthView('login');
                }}
                onShowLogin={() => setAuthView('login')} 
             />;
    }
  }

  return (
    <div className={`cms-admin ${theme}`}>
      {/* Top Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>
          <span className="site-title">Modern CMS</span>
        </div>
        
        <div className="top-bar-center">
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="top-bar-right">
          <button onClick={handleThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {currentUser && <span style={{margin: '0 10px'}}>Hi, {currentUser.username}</span>}
          <button className="profile-button" onClick={handleLogout}>Logout</button> {/* Changed to Logout */}
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <nav>
            <ul>
              <li 
                className={activeSection === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveSection('dashboard')}
              >
                Dashboard
              </li>
              <li 
                className={activeSection === 'posts' ? 'active' : ''}
                onClick={() => setActiveSection('posts')}
              >
                Posts
              </li>
              <li 
                className={activeSection === 'pages' ? 'active' : ''}
                onClick={() => setActiveSection('pages')}
              >
                Pages
              </li>
              <li 
                className={activeSection === 'media' ? 'active' : ''}
                onClick={() => setActiveSection('media')}
              >
                Media
              </li>
              <li 
                className={activeSection === 'about-us' ? 'active' : ''} // Add About Us link
                onClick={() => setActiveSection('about-us')}
              >
                About Us
              </li>
              <li 
                className={activeSection === 'settings' ? 'active' : ''}
                onClick={() => setActiveSection('settings')}
              >
                Settings
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content">
          {renderContent()}
        </main>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}

function EditModal({ item, type, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...item });

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(type, formData);
  };

  if (type === 'posts') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{formData.id ? 'Edit Post' : 'Add New Post'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
            </label>
            <label>
              Content:
              <textarea name="content" value={formData.content || ''} onChange={handleChange} rows="5" required />
            </label>
            <label>
              Status:
              <select name="status" value={formData.status || 'draft'} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (type === 'pages') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{formData.id ? 'Edit Page' : 'Add New Page'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
            </label>
            <label>
              Layout:
              <select name="layout" value={formData.layout || 'default'} onChange={handleChange}>
                <option value="default">Default</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </label>
            <label>
              Status:
              <select name="status" value={formData.status || 'draft'} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

export default App