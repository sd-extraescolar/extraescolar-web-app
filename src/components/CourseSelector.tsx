import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCourses } from "@/hooks/useCourses";
import { ChevronDown, School } from "lucide-react";

export const CourseSelector = () => {
  const { 
    courses, 
    selectedCourse, 
    selectCourse, 
    getSelectedCourseInfo 
  } = useCourses();

  const selectedCourseInfo = getSelectedCourseInfo();

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center text-medium-gray ml-4">
      <ChevronDown className="h-4 w-4 rotate-[-90deg] mx-2" />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button 
            variant="ghost" 
            className="text-dark-text hover:bg-sidebar-hover font-medium rounded-lg px-3 py-2 transition-all duration-200 ease-in-out"
          >
            {selectedCourseInfo?.displayName || "Seleccionar curso"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-blue-100 border-none" align="start">
          {courses.map((course) => (
            <DropdownMenuItem
              key={course.id}
              onClick={() => selectCourse(course)}
              className="flex items-center gap-3 p-3 text-blue-900 hover:bg-blue-200 cursor-pointer transition-colors duration-200"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500">
                <School className="h-4 w-4 text-white" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {course.section 
                    ? `${course.name} - ${course.section}`
                    : course.name
                  }
                </div>
                {course.room && (
                  <div className="text-xs text-gray-600">Aula: {course.room}</div>
                )}
                {course.descriptionHeading && (
                  <div className="text-xs text-gray-600">{course.descriptionHeading}</div>
                )}
              </div>
              {selectedCourse?.id === course.id && (
                <div className="w-2 h-2 rounded-full bg-education-green-500"></div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};