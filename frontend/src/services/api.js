// API service utility for making authenticated requests
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('sms_token');
  }

  // Get headers with auth token
  getHeaders(additionalHeaders = {}) {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...additionalHeaders,
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication endpoints
  async login(username, password) {
    return this.post('/api/auth/login', { username, password });
  }

  async register(userData) {
    return this.post('/api/auth/register', userData);
  }

  async getProfile() {
    return this.get('/api/auth/profile');
  }

  async updateProfile(userData) {
    return this.put('/api/auth/profile', userData);
  }

  // Student endpoints
  async getStudents() {
    return this.get('/api/students');
  }

  async getStudent(id) {
    return this.get(`/api/students/${id}`);
  }

  async getStudentDashboard(id) {
    return this.get(`/api/students/${id}/dashboard`);
  }

  async getStudentClasses(id) {
    return this.get(`/api/students/${id}/classes`);
  }

  async getStudentAssignments(id) {
    return this.get(`/api/students/${id}/assignments`);
  }

  async getStudentAttendance(id, classId = null) {
    const params = classId ? `?classId=${classId}` : '';
    return this.get(`/api/students/${id}/attendance${params}`);
  }

  async getStudentGrades(id) {
    return this.get(`/api/students/${id}/grades`);
  }

  // Teacher endpoints
  async getTeachers() {
    return this.get('/api/teachers');
  }

  async getTeacher(id) {
    return this.get(`/api/teachers/${id}`);
  }

  async getTeacherDashboard(id) {
    return this.get(`/api/teachers/${id}/dashboard`);
  }

  async getTeacherClasses(id) {
    return this.get(`/api/teachers/${id}/classes`);
  }

  async getTeacherStudents(id) {
    return this.get(`/api/teachers/${id}/students`);
  }

  async getTeacherAssignments(id) {
    return this.get(`/api/teachers/${id}/assignments`);
  }

  async getStudentsInClass(teacherId, classId) {
    return this.get(`/api/teachers/${teacherId}/classes/${classId}/students`);
  }

  async getClassAttendance(teacherId, classId, date = null) {
    const params = date ? `?date=${date}` : '';
    return this.get(`/api/teachers/${teacherId}/classes/${classId}/attendance${params}`);
  }

  // Class endpoints
  async getClasses() {
    return this.get('/api/classes');
  }

  async getClass(id) {
    return this.get(`/api/classes/${id}`);
  }

  // Assignment endpoints
  async getAssignments() {
    return this.get('/api/assignments');
  }

  // Attendance endpoints
  async getAttendance(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const queryString = params ? `?${params}` : '';
    return this.get(`/api/attendance${queryString}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
