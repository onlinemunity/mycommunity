
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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, Search, Loader2, ListFilter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

type Lecture = Tables<'lectures'>;
type Course = Tables<'courses'>;

interface LectureFormData {
  id?: string;
  title: string;
  description: string | null;
  content: string | null;
  duration: string;
  video_url: string | null;
  sort_order: number;
  course_id: string;
}

const LecturesManagement = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<LectureFormData | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [formData, setFormData] = useState<LectureFormData>({
    title: '',
    description: '',
    content: '',
    duration: '',
    video_url: '',
    sort_order: 0,
    course_id: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch courses first
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('title');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Then fetch lectures with course information
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setLectures(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching data',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLecture = async () => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Lecture created successfully',
      });
      
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating lecture',
        description: error.message,
      });
    }
  };

  const handleUpdateLecture = async () => {
    if (!selectedLecture?.id) return;

    try {
      const { error } = await supabase
        .from('lectures')
        .update(formData)
        .eq('id', selectedLecture.id);

      if (error) throw error;

      toast({
        title: 'Lecture updated successfully',
      });
      
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating lecture',
        description: error.message,
      });
    }
  };

  const handleDeleteLecture = async () => {
    if (!selectedLecture?.id) return;

    try {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', selectedLecture.id);

      if (error) throw error;

      toast({
        title: 'Lecture deleted successfully',
      });
      
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting lecture',
        description: error.message,
      });
    }
  };

  const openEditDialog = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setFormData({
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      content: lecture.content,
      duration: lecture.duration,
      video_url: lecture.video_url,
      sort_order: lecture.sort_order,
      course_id: lecture.course_id,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      duration: '',
      video_url: '',
      sort_order: 0,
      course_id: courses.length > 0 ? courses[0].id : '',
    });
    setSelectedLecture(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'sort_order' ? parseInt(value) : value 
    }));
  };

  // Filter lectures by course and search term
  const filteredLectures = lectures.filter(lecture => {
    const matchesCourse = courseFilter === 'all' || lecture.course_id === courseFilter;
    const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

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
            <h2 className="text-3xl font-bold">Lectures Management</h2>
            <p className="text-muted-foreground">Create, edit and delete lectures</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lectures..."
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
                  Add Lecture
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedLecture ? 'Edit Lecture' : 'Create New Lecture'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="course_id">Course *</Label>
                      <select
                        id="course_id"
                        name="course_id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.course_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>{courses.length === 0 ? 'No courses available' : 'Select a course'}</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
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
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description" 
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <textarea
                        id="content"
                        name="content"
                        className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.content || ''}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration *</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g. 30 minutes"
                          value={formData.duration}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sort_order">Sort Order</Label>
                        <Input
                          id="sort_order"
                          name="sort_order"
                          type="number"
                          min="0"
                          value={formData.sort_order}
                          onChange={handleChange}
                        />
                      </div>
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
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={selectedLecture ? handleUpdateLecture : handleCreateLecture}>
                    {selectedLecture ? 'Update' : 'Create'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Add course filter */}
        <div className="flex items-center gap-3">
          <ListFilter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by course:</span>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectGroup>
                <SelectLabel>Courses</SelectLabel>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLectures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery || courseFilter !== 'all' ? 'No lectures matching your filters' : 'No lectures found. Create your first lecture!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLectures.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="font-medium">{lecture.title}</TableCell>
                      <TableCell>{getCourseTitle(lecture.course_id)}</TableCell>
                      <TableCell>{lecture.duration}</TableCell>
                      <TableCell>{lecture.sort_order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(lecture)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(lecture)}>
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
            <p>Are you sure you want to delete the lecture "{selectedLecture?.title}"? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLecture}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default LecturesManagement;
