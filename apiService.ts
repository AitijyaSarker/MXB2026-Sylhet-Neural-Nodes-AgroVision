const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://your-production-backend.com/api'
    : 'http://localhost:3001/api');

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(userData: { name: string; email: string; password: string; role?: string; location?: any }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // User methods
  async getUserProfile(userId: string) {
    return this.request(`/users/profile/${userId}`);
  }

  async updateUserProfile(userId: string, data: any) {
    return this.request(`/users/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Specialist methods
  async getSpecialists() {
    return this.request('/specialists');
  }

  async getSpecialist(id: string) {
    return this.request(`/specialists/${id}`);
  }

  // Message methods
  async getMessages(userId: string) {
    return this.request(`/messages/${userId}`);
  }

  async sendMessage(message: { senderId: string; receiverId: string; content: string }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Scan methods
  async getScans(userId: string) {
    return this.request(`/scans/${userId}`);
  }

  async saveScan(scan: { userId: string; imageUrl: string; disease: string; confidence: number; recommendations: string[] }) {
    return this.request('/scans', {
      method: 'POST',
      body: JSON.stringify(scan),
    });
  }
}

export const apiService = new ApiService();