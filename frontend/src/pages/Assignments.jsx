import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import apiService from '@/services/api';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    assignmentType: 'homework',
    status: 'published'
  });

  // Fetch all assignments and courses
  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, coursesRes] = await Promise.all([
        apiService.getAssignments(),
        apiService.getCourses()
      ]);
      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.data || []);
      }
      if (coursesRes.success) {
        setCourses(coursesRes.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      dueDate: '',
      maxPoints: 100,
      assignmentType: 'homework',
      status: 'published'
    });
    setEditingAssignment(null);
    setShowForm(false);
  };

  // Handle create assignment
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createAssignment(formData);
      if (response.success) {
        await fetchData();
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit assignment
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      courseId: assignment.courseId?._id || assignment.courseId || '',
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
      maxPoints: assignment.maxPoints || 100,
      assignmentType: assignment.assignmentType || 'homework',
      status: assignment.status || 'published'
    });
    setShowForm(true);
  };

  // Handle update assignment
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateAssignment(editingAssignment._id, formData);
      if (response.success) {
        await fetchData();
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete assignment
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await apiService.deleteAssignment(id);
        if (response.success) {
          await fetchData();
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      homework: 'bg-blue-100 text-blue-800',
      quiz: 'bg-yellow-100 text-yellow-800',
      exam: 'bg-red-100 text-red-800',
      project: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={colors[type] || colors.homework}>{type}</Badge>;
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status] || colors.draft}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Assignments</h1>
          <p className="text-muted-foreground mt-1">Manage course assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Assignment'}
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
            <CardTitle>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingAssignment ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseId">Course</Label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.courseCode} - {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Assignment title"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Assignment description..."
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxPoints">Max Points</Label>
                  <Input
                    id="maxPoints"
                    name="maxPoints"
                    type="number"
                    min="1"
                    value={formData.maxPoints}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="assignmentType">Type</Label>
                  <select
                    id="assignmentType"
                    name="assignmentType"
                    value={formData.assignmentType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="homework">Homework</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>Total: {assignments.length} assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : assignments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No assignments found. Add your first assignment!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Course</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Due Date</th>
                    <th className="text-left p-2">Points</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr 
                      key={assignment._id} 
                      className={`border-b hover:bg-gray-50 ${isOverdue(assignment.dueDate) && assignment.status === 'published' ? 'bg-red-50' : ''}`}
                    >
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{assignment.description}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="text-sm">
                          {assignment.courseId?.courseCode || '-'}
                          {assignment.courseId?.courseName && <span className="block text-xs text-muted-foreground">{assignment.courseId.courseName}</span>}
                        </span>
                      </td>
                      <td className="p-2">{getTypeBadge(assignment.assignmentType)}</td>
                      <td className="p-2">
                        <span className={isOverdue(assignment.dueDate) ? 'text-red-600' : ''}>
                          {formatDate(assignment.dueDate)}
                        </span>
                      </td>
                      <td className="p-2">{assignment.maxPoints}</td>
                      <td className="p-2">{getStatusBadge(assignment.status)}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(assignment)}>
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(assignment._id)}
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
