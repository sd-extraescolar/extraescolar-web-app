/**
 * Interfaz para representar un estudiante de Google Classroom
 */
export interface Student {
  userId: string;
  courseId: string;
  profile: {
    id: string;
    name: {
      givenName: string;
      familyName: string;
      fullName: string;
    };
    emailAddress: string;
    photoUrl?: string;
  };
  studentWorkFolder?: {
    id: string;
    title: string;
    alternateLink: string;
  };
}
