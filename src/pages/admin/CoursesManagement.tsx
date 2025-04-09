
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Course = Tables<'courses'>;

interface CourseFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  duration: string;
  image: string;
  rating?: number;
  students?: number;
  video_url?: string;
  href: string;
  course_type: string;
}

const CoursesManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseFormData | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    instructor: '',
    duration: '',
    image: '/placeholder.svg',
    href: '',
    course_type: 'basis',
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching courses',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Course created successfully',
      });
      
      setIsDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating course',
        description: error.message,
      });
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse?.id) return;

    try {
      const { error } = await supabase
        .from('courses')
        .update(formData)
        .eq('id', selectedCourse.id);

      if (error) throw error;

      toast({
        title: 'Course updated successfully',
      });
      
      setIsDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating course',
        description: error.message,
      });
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse?.id) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', selectedCourse.id);

      if (error) throw error;

      toast({
        title: 'Course deleted successfully',
      });
      
      setIsDeleteDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting course',
        description: error.message,
      });
    }
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      instructor: course.instructor,
      duration: course.duration,
      image: course.image,
      video_url: course.video_url || '',
      rating: course.rating,
      students: course.students,
      href: course.href,
      course_type: course.course_type,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      instructor: '',
      duration: '',
      image: '/placeholder.svg',
      href: '',
      course_type: 'basic',
    });
    setSelectedCourse(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Courses Management</h2>
            <p className="text-muted-foreground">Create, edit and delete courses</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedCourse ? 'Edit Course' : 'Create New Course'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <Input
                            id="description" 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                          />
                        </div>

                          <div className="space-y-2">
                            <Label htmlFor="level">Kurs-Typ *</Label>
                            <select
                              id="course_type"
                              name="course_type"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={formData.course_type}
                              onChange={handleChange}
                              required
                            >
                              <option value="basic">Basis</option>
                              <option value="premium">Premium</option>
                              
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="level">Level *</Label>
                            <select
                              id="level"
                              name="level"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={formData.level}
                              onChange={handleChange}
                              required
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="instructor">Instructor *</Label>
                          <Input
                            id="instructor"
                            name="instructor"
                            value={formData.instructor}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration *</Label>
                          <Input
                            id="duration"
                            name="duration"
                            placeholder="e.g. 8 weeks"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="video_url">Video URL</Label>
                          <Input
                            id="video_url"
                            name="video_url"
                            value={formData.video_url || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="href">URL Path *</Label>
                          <Input
                            id="href"
                            name="href"
                            placeholder="/courses/course-slug"
                            value={formData.href}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                              id="rating"
                              name="rating"
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={formData.rating || ''}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="students">Students</Label>
                            <Input
                              id="students"
                              name="students"
                              type="number"
                              min="0"
                              value={formData.students || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={selectedCourse ? handleUpdateCourse : handleCreateCourse}>
                    {selectedCourse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No courses matching your search' : 'No courses found. Create your first course!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>
                        <span className="capitalize">{course.level}</span>
                      </TableCell>
                      <TableCell>{course.duration}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(course)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the course "{selectedCourse?.title}"? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CoursesManagement;
