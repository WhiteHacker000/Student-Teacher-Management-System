import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiService from '@/services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudents();
      if (response.success) {
        setStudents(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  // Handle create student
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createStudent(formData);
      if (response.success) {
        await fetchStudents();
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit student
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      phone: student.phone || '',
      dob: student.dob ? student.dob.split('T')[0] : '',
      enrollmentDate: student.enrollmentDate ? student.enrollmentDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  // Handle update student
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateStudent(editingStudent._id, formData);
      if (response.success) {
        await fetchStudents();
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await apiService.deleteStudent(id);
        if (response.success) {
          await fetchStudents();
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right">&times;</button>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingStudent ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    name="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingStudent ? 'Update Student' : 'Create Student'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Total: {students.length} students</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No students found. Add your first student!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">DOB</th>
                    <th className="text-left p-2">Enrolled</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{student.firstName} {student.lastName}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">{student.phone || '-'}</td>
                      <td className="p-2">{formatDate(student.dob)}</td>
                      <td className="p-2">{formatDate(student.enrollmentDate)}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


